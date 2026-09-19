import { toGeo } from './mock-geo';
import type { Perimeter } from '../types';

export const mockPerimeters: Perimeter[] = [
  {
    id: 'PER-001',
    zone: 'Baie de Loango',
    dominantWaste: 'plastiques',
    severity: 'critique',
    status: 'en_intervention',
    areaM2: 18400,
    reportCount: 34,
    wasteTons: 6.8,
    createdAt: '2026-08-28T09:15:00Z',
    deadline: '2026-09-22T18:00:00Z',
    assignedOngId: 'ONG-01',
    polygon: [
      { x: 278, y: 70 },
      { x: 336, y: 66 },
      { x: 352, y: 112 },
      { x: 286, y: 116 }
    ],
    centroid: toGeo(310, 90)
  },
  {
    id: 'PER-002',
    zone: 'Centre-ville',
    dominantWaste: 'menagers',
    severity: 'eleve',
    status: 'nouveau',
    areaM2: 9600,
    reportCount: 22,
    wasteTons: 3.1,
    createdAt: '2026-09-14T14:05:00Z',
    polygon: [
      { x: 300, y: 262 },
      { x: 366, y: 258 },
      { x: 372, y: 312 },
      { x: 304, y: 316 }
    ],
    centroid: toGeo(334, 286)
  },
  {
    id: 'PER-003',
    zone: 'Port Autonome',
    dominantWaste: 'hydrocarbures',
    severity: 'critique',
    status: 'en_validation',
    areaM2: 12300,
    reportCount: 18,
    wasteTons: 7.4,
    createdAt: '2026-09-12T07:40:00Z',
    polygon: [
      { x: 278, y: 162 },
      { x: 340, y: 160 },
      { x: 346, y: 206 },
      { x: 284, y: 210 }
    ],
    centroid: toGeo(312, 184)
  },
  {
    id: 'PER-004',
    zone: 'Lumumba',
    dominantWaste: 'divers',
    severity: 'modere',
    status: 'en_intervention',
    areaM2: 8700,
    reportCount: 15,
    wasteTons: 2.2,
    createdAt: '2026-09-08T10:20:00Z',
    deadline: '2026-09-20T12:00:00Z',
    assignedOngId: 'ONG-03',
    polygon: [
      { x: 470, y: 248 },
      { x: 532, y: 244 },
      { x: 538, y: 300 },
      { x: 474, y: 304 }
    ],
    centroid: toGeo(504, 274)
  },
  {
    id: 'PER-005',
    zone: 'Mvou-Mvou',
    dominantWaste: 'plastiques',
    severity: 'eleve',
    status: 'nouveau',
    areaM2: 11100,
    reportCount: 26,
    wasteTons: 4.5,
    createdAt: '2026-09-15T16:30:00Z',
    polygon: [
      { x: 308, y: 374 },
      { x: 374, y: 370 },
      { x: 380, y: 424 },
      { x: 312, y: 428 }
    ],
    centroid: toGeo(342, 400)
  },
  {
    id: 'PER-006',
    zone: 'Tié-Tié',
    dominantWaste: 'menagers',
    severity: 'modere',
    status: 'en_intervention',
    areaM2: 7300,
    reportCount: 12,
    wasteTons: 1.9,
    createdAt: '2026-09-06T11:10:00Z',
    deadline: '2026-09-21T10:00:00Z',
    assignedOngId: 'ONG-02',
    polygon: [
      { x: 492, y: 366 },
      { x: 556, y: 362 },
      { x: 562, y: 418 },
      { x: 498, y: 422 }
    ],
    centroid: toGeo(527, 392)
  },
  {
    id: 'PER-007',
    zone: 'Ngambio',
    dominantWaste: 'filets',
    severity: 'eleve',
    status: 'en_validation',
    areaM2: 9800,
    reportCount: 19,
    wasteTons: 3.6,
    createdAt: '2026-09-13T08:55:00Z',
    polygon: [
      { x: 322, y: 494 },
      { x: 388, y: 490 },
      { x: 394, y: 546 },
      { x: 326, y: 550 }
    ],
    centroid: toGeo(356, 520)
  },
  {
    id: 'PER-008',
    zone: 'Loandjili',
    dominantWaste: 'divers',
    severity: 'faible',
    status: 'resolu',
    areaM2: 5400,
    reportCount: 9,
    wasteTons: 1.1,
    createdAt: '2026-08-18T13:25:00Z',
    polygon: [
      { x: 520, y: 486 },
      { x: 584, y: 482 },
      { x: 590, y: 538 },
      { x: 526, y: 542 }
    ],
    centroid: toGeo(555, 512)
  },
  {
    id: 'PER-009',
    zone: 'Mongo-Mpoukou',
    dominantWaste: 'plastiques',
    severity: 'modere',
    status: 'en_intervention',
    areaM2: 8800,
    reportCount: 16,
    wasteTons: 2.8,
    createdAt: '2026-09-05T17:45:00Z',
    deadline: '2026-09-23T14:00:00Z',
    assignedOngId: 'ONG-05',
    polygon: [
      { x: 686, y: 352 },
      { x: 750, y: 348 },
      { x: 756, y: 406 },
      { x: 692, y: 410 }
    ],
    centroid: toGeo(722, 378)
  },
  {
    id: 'PER-010',
    zone: 'Côte Sauvage',
    dominantWaste: 'hydrocarbures',
    severity: 'critique',
    status: 'nouveau',
    areaM2: 14600,
    reportCount: 28,
    wasteTons: 8.2,
    createdAt: '2026-09-16T06:20:00Z',
    polygon: [
      { x: 342, y: 614 },
      { x: 408, y: 610 },
      { x: 414, y: 668 },
      { x: 346, y: 672 }
    ],
    centroid: toGeo(376, 640)
  }
];