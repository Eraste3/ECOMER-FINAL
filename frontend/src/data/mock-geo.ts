import type { GeoPoint, ZoneName } from '../types';

/**
 * Espace cartographique stylisé de Pointe-Noire.
 * Repère SVG : 1000 x 700. L'océan Atlantique occupe l'ouest (x faible).
 */
export const MAP_WIDTH = 1000;
export const MAP_HEIGHT = 700;

const LAT_NORTH = -4.716;
const LAT_SOUTH = -4.884;
const LNG_WEST = 11.784;
const LNG_EAST = 11.952;

export function toGeo(x: number, y: number): GeoPoint {
  return {
    x,
    y,
    lat: LAT_NORTH + y / MAP_HEIGHT * (LAT_SOUTH - LAT_NORTH),
    lng: LNG_WEST + x / MAP_WIDTH * (LNG_EAST - LNG_WEST)
  };
}

export function formatCoord(value: number, axis: 'lat' | 'lng'): string {
  const hemi = axis === 'lat' ? value < 0 ? 'S' : 'N' : value < 0 ? 'O' : 'E';
  return `${Math.abs(value).toFixed(5)}° ${hemi}`;
}

/** Trait de côte + estuaires (chemin SVG fermé décrivant la terre) */
export const LAND_PATH =
'M 158 0 L 1000 0 L 1000 700 L 236 700 C 250 640 214 596 236 540 C 258 486 210 452 232 400 C 254 348 196 318 214 262 C 232 206 150 150 158 96 Z';

/** Lagune / baie intérieure */
export const LAGOON_PATH =
'M 300 470 C 352 442 424 452 456 486 C 490 522 462 574 408 588 C 350 604 292 578 284 534 C 279 506 282 482 300 470 Z';

/** Cours d'eau (Tchinouka) */
export const RIVER_PATH = 'M 900 120 C 760 190 690 250 600 300 C 520 344 430 400 330 462';

/** Port autonome (quais) */
export const PORT_PATH = 'M 232 172 L 352 172 L 352 236 L 262 236 L 240 212 Z';

export interface ZoneShape {
  name: ZoneName;
  label: string;
  polygon: Array<{x: number;y: number;}>;
  labelAt: {x: number;y: number;};
  coastal: boolean;
}

export const ZONE_SHAPES: ZoneShape[] = [
{
  name: 'Centre-ville',
  label: 'Centre-ville',
  polygon: [
  { x: 236, y: 240 },
  { x: 400, y: 232 },
  { x: 420, y: 330 },
  { x: 250, y: 344 }],

  labelAt: { x: 316, y: 290 },
  coastal: true
},
{
  name: 'Port Autonome',
  label: 'Port Autonome',
  polygon: [
  { x: 224, y: 150 },
  { x: 386, y: 148 },
  { x: 398, y: 226 },
  { x: 236, y: 234 }],

  labelAt: { x: 306, y: 190 },
  coastal: true
},
{
  name: 'Lumumba',
  label: 'Lumumba',
  polygon: [
  { x: 404, y: 226 },
  { x: 560, y: 214 },
  { x: 582, y: 320 },
  { x: 424, y: 330 }],

  labelAt: { x: 492, y: 272 },
  coastal: false
},
{
  name: 'Mvou-Mvou',
  label: 'Mvou-Mvou',
  polygon: [
  { x: 240, y: 350 },
  { x: 420, y: 340 },
  { x: 436, y: 448 },
  { x: 254, y: 458 }],

  labelAt: { x: 336, y: 398 },
  coastal: true
},
{
  name: 'Tié-Tié',
  label: 'Tié-Tié',
  polygon: [
  { x: 428, y: 336 },
  { x: 606, y: 326 },
  { x: 624, y: 442 },
  { x: 444, y: 452 }],

  labelAt: { x: 522, y: 388 },
  coastal: false
},
{
  name: 'Ngambio',
  label: 'Ngambio',
  polygon: [
  { x: 258, y: 466 },
  { x: 440, y: 458 },
  { x: 456, y: 574 },
  { x: 262, y: 586 }],

  labelAt: { x: 352, y: 522 },
  coastal: true
},
{
  name: 'Loandjili',
  label: 'Loandjili',
  polygon: [
  { x: 448, y: 458 },
  { x: 634, y: 448 },
  { x: 650, y: 572 },
  { x: 464, y: 580 }],

  labelAt: { x: 548, y: 512 },
  coastal: false
},
{
  name: 'Mongo-Mpoukou',
  label: 'Mongo-Mpoukou',
  polygon: [
  { x: 614, y: 320 },
  { x: 800, y: 306 },
  { x: 822, y: 440 },
  { x: 632, y: 446 }],

  labelAt: { x: 716, y: 378 },
  coastal: false
},
{
  name: 'Côte Sauvage',
  label: 'Côte Sauvage',
  polygon: [
  { x: 266, y: 594 },
  { x: 470, y: 588 },
  { x: 482, y: 690 },
  { x: 276, y: 696 }],

  labelAt: { x: 372, y: 640 },
  coastal: true
},
{
  name: 'Baie de Loango',
  label: 'Baie de Loango',
  polygon: [
  { x: 214, y: 60 },
  { x: 400, y: 54 },
  { x: 412, y: 140 },
  { x: 224, y: 144 }],

  labelAt: { x: 312, y: 100 },
  coastal: true
}];


export const ZONE_NAMES: ZoneName[] = ZONE_SHAPES.map((z) => z.name);