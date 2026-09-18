import { ZONE_SHAPES } from '../data/mock-geo';
import type { ZoneName } from '../types';

export function pointInPolygon(
point: {x: number;y: number;},
polygon: Array<{x: number;y: number;}>)
: boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x;
    const yi = polygon[i].y;
    const xj = polygon[j].x;
    const yj = polygon[j].y;
    const intersect =
    yi > point.y !== yj > point.y && point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

/** Retourne le quartier correspondant au point, sinon le plus proche. */
export function zoneAt(point: {x: number;y: number;}): ZoneName {
  const hit = ZONE_SHAPES.find((z) => pointInPolygon(point, z.polygon));
  if (hit) return hit.name;
  let best = ZONE_SHAPES[0];
  let bestDist = Number.POSITIVE_INFINITY;
  for (const z of ZONE_SHAPES) {
    const d = Math.hypot(z.labelAt.x - point.x, z.labelAt.y - point.y);
    if (d < bestDist) {
      bestDist = d;
      best = z;
    }
  }
  return best.name;
}