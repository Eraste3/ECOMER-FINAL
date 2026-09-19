const prisma = require('../config/database');
const env = require('../config/env');

function distanceMeters(a, b) {
  const R = 6371000;
  const p1 = a.latitude * Math.PI / 180, p2 = b.latitude * Math.PI / 180;
  const dp = (b.latitude - a.latitude) * Math.PI / 180;
  const dl = (b.longitude - a.longitude) * Math.PI / 180;
  const h = Math.sin(dp / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/**
 * DBSCAN optimisé par grille spatiale : chaque point n'est comparé qu'aux
 * voisins de sa cellule et des 8 cellules adjacentes (cellule = rayon), ce qui
 * évite le balayage quadratique complet sur des volumes importants.
 */
function dbscan(points, radius, minSamples) {
  const n = points.length;
  if (n === 0) return [];

  // AST (approximatif pour 3 cellules : 3x3) : grille flottante en degrés.
  // rayon (m) -> ~deg à l'équateur pour dimensionner la cellule.
  const cellDeg = Math.max(1e-6, radius / 111320);
  const grid = new Map();
  for (let i = 0; i < n; i++) {
    const key = `${Math.floor(points[i].latitude / cellDeg)},${Math.floor(points[i].longitude / cellDeg)}`;
    if (!grid.has(key)) grid.set(key, []);
    grid.get(key).push(i);
  }

  const neighborsCache = new Array(n);
  function neighbors(i) {
    if (neighborsCache[i]) return neighborsCache[i];
    const cx = Math.floor(points[i].latitude / cellDeg);
    const cy = Math.floor(points[i].longitude / cellDeg);
    const result = [];
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const bucket = grid.get(`${cx + dx},${cy + dy}`);
        if (!bucket) continue;
        for (const j of bucket) {
          if (i !== j && distanceMeters(points[i], points[j]) <= radius) result.push(j);
        }
      }
    }
    neighborsCache[i] = result;
    return result;
  }

  const labels = new Array(n).fill(null);
  let clusterId = 0;
  for (let i = 0; i < n; i++) {
    if (labels[i] !== null) continue;
    const ns = neighbors(i);
    if (ns.length < minSamples) { labels[i] = -1; continue; }
    labels[i] = clusterId;
    const queue = [...ns];
    const seen = new Set(ns);
    for (let q = 0; q < queue.length; q++) {
      const j = queue[q];
      if (labels[j] === -1) labels[j] = clusterId;
      if (labels[j] !== null) continue;
      labels[j] = clusterId;
      const jn = neighbors(j);
      if (jn.length < minSamples) continue;
      for (const x of jn) {
        if (!seen.has(x)) { seen.add(x); queue.push(x); }
      }
    }
    clusterId++;
  }
  return labels;
}

function estimateKg(items) {
  const weights = { faible: 5, moyenne: 20, elevee: 50 };
  return items.reduce((s, x) => s + (weights[x.gravite] || 5), 0);
}

function criticity(count, kg) {
  if (count >= 15 || kg >= 1000) return 'critique';
  if (count >= 8 || kg >= 500) return 'elevee';
  if (count >= 3 || kg >= 100) return 'moyenne';
  return 'faible';
}

async function clusterSignalements() {
  const items = await prisma.signalement.findMany({ where: { zoneId: null, statut: 'valide' } });
  if (!items.length) return [];
  const labels = dbscan(items, env.clusteringRadiusMeters, env.clusteringMinSamples);
  const created = [];
  const groups = new Map();
  labels.forEach((label, i) => { if (label >= 0) { if (!groups.has(label)) groups.set(label, []); groups.get(label).push(items[i]); } });
  for (const group of groups.values()) {
    const latitude = group.reduce((s, x) => s + x.latitude, 0) / group.length;
    const longitude = group.reduce((s, x) => s + x.longitude, 0) / group.length;
    const tonnageEstimeKg = estimateKg(group);
    const counts = {};
    for (const x of group) if (x.typeDechet) counts[x.typeDechet] = (counts[x.typeDechet] || 0) + 1;
    const typeDechetDominant = Object.entries(counts).sort((a,b) => b[1] - a[1])[0]?.[0] || null;
    const zone = await prisma.zonePollution.create({ data: { latitude, longitude, rayonMetres: env.clusteringRadiusMeters, tonnageEstimeKg, criticite: criticity(group.length, tonnageEstimeKg), typeDechetDominant } });
    await prisma.signalement.updateMany({ where: { id: { in: group.map(x => x.id) } }, data: { zoneId: zone.id } });
    created.push(zone);
  }
  return created;
}
module.exports = { clusterSignalements, distanceMeters, dbscan };