import { toGeo } from './mock-geo';

/** Position simulée du citoyen connecté (quartier Ngambio) */
export const CITIZEN_POSITION = { x: 344, y: 528 };

export const CITIZEN_GEO = toGeo(CITIZEN_POSITION.x, CITIZEN_POSITION.y);