const router = require('express').Router();
const { Prisma } = require('@prisma/client');
const prisma = require('../config/database');
const { auth, requireRole } = require('../middleware/auth');

function pointSql(lat, lng) {
  return Prisma.sql`ST_SetSRID(ST_MakePoint(${Number(lng)}, ${Number(lat)}), 4326)`;
}

function parseCoords(query) {
  const { lat, lng } = query;
  if (lat === undefined || lng === undefined) return { error: 'Latitude (lat) et longitude (lng) sont requises.' };
  const latitude = Number(lat);
  const longitude = Number(lng);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return { error: 'lat et lng doivent être des nombres valides.' };
  return { latitude, longitude };
}

router.get('/', auth, async (req, res, next) => {
  try {
    const [zones, signalements] = await Promise.all([prisma.zonePollution.count(), prisma.signalement.count()]);
    res.json({ endpoints: ['/zones/proximite', '/signalements/proximite', '/status'], zones, signalements });
  } catch (e) { next(e); }
});

router.get('/zones/proximite', auth, async (req, res, next) => {
  try {
    const { error, latitude, longitude } = parseCoords(req.query);
    if (error) return res.status(422).json({ detail: error });
    const rayon = Math.max(0, Number(req.query.rayonMetres || 1000));
    const { statut } = req.query;
    const rows = await prisma.$queryRaw`
      SELECT zp."id", zp."nom", zp."latitude", zp."longitude", zp."rayonMetres", zp."criticite", zp."statut", zp."tonnageEstimeKg",
             ROUND(ST_Distance(
               ${pointSql(latitude, longitude)}::geography,
               ST_SetSRID(ST_MakePoint(zp."longitude", zp."latitude"), 4326)::geography
             )::numeric, 1) AS "distanceMetres"
      FROM "ZonePollution" zp
      WHERE ST_DWithin(
              ST_SetSRID(ST_MakePoint(zp."longitude", zp."latitude"), 4326)::geography,
              ${pointSql(latitude, longitude)}::geography,
              ${rayon}
            )
      ${statut ? Prisma.sql`AND zp."statut" = ${String(statut)}` : Prisma.empty}
      ORDER BY "distanceMetres" ASC
    `;
    res.json(rows);
  } catch (e) { next(e); }
});

router.get('/signalements/proximite', auth, async (req, res, next) => {
  try {
    const { error, latitude, longitude } = parseCoords(req.query);
    if (error) return res.status(422).json({ detail: error });
    const rayon = Math.max(0, Number(req.query.rayonMetres || 500));
    const { statut } = req.query;
    const rows = await prisma.$queryRaw`
      SELECT s."id", s."latitude", s."longitude", s."typeDechet", s."gravite", s."statut", s."createdAt",
             ROUND(ST_Distance(
               ${pointSql(latitude, longitude)}::geography,
               ST_SetSRID(ST_MakePoint(s."longitude", s."latitude"), 4326)::geography
             )::numeric, 1) AS "distanceMetres"
      FROM "Signalement" s
      WHERE ST_DWithin(
              ST_SetSRID(ST_MakePoint(s."longitude", s."latitude"), 4326)::geography,
              ${pointSql(latitude, longitude)}::geography,
              ${rayon}
            )
      ${statut ? Prisma.sql`AND s."statut" = ${String(statut)}` : Prisma.empty}
      ORDER BY "distanceMetres" ASC
    `;
    res.json(rows);
  } catch (e) { next(e); }
});

router.get('/status', auth, requireRole('admin', 'agent'), async (req, res, next) => {
  try {
    const rows = await prisma.$queryRaw`SELECT postgis_version() AS "version_postgis", postgis_full_version() AS "full"`;
    res.json(rows[0]);
  } catch (e) { next(e); }
});

module.exports = router;