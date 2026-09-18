import type { Perimeter } from '../types';
import { toGeo } from './mock-geo';

function blob(cx: number, cy: number, rx: number, ry: number, seed = 1) {
  const pts: Array<{x: number;y: number;}> = [];
  const steps = 9;
  for (let i = 0; i < steps; i++) {
    const a = i / steps * Math.PI * 2;
    const wobble = 0.78 + (Math.sin(a * 3 + seed) + 1) / 2 * 0.34;
    pts.push({
      x: Math.round(cx + Math.cos(a) * rx * wobble),
      y: Math.round(cy + Math.sin(a) * ry * wobble)
    });
  }
  return pts;
}

interface Seed {
  id: string;
  zone: Perimeter['zone'];
  dominantWaste: Perimeter['dominantWaste'];
  severity: Perimeter['severity'];
  status: Perimeter['status'];
  areaM2: number;
  reportCount: number;
  createdAt: string;
  deadline?: string;
  assignedOngId?: string;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  wasteTons: number;
}

const seeds: Seed[] = [
{
  id: 'PER-0041',
  zone: 'Ngambio',
  dominantWaste: 'plastiques',
  severity: 'critique',
  status: 'en_intervention',
  areaM2: 18400,
  reportCount: 34,
  createdAt: '2026-08-09T08:12:00Z',
  deadline: '2026-09-24T23:59:00Z',
  assignedOngId: 'ONG-01',
  cx: 344,
  cy: 520,
  rx: 58,
  ry: 44,
  wasteTons: 12.4
},
{
  id: 'PER-0038',
  zone: 'Côte Sauvage',
  dominantWaste: 'hydrocarbures',
  severity: 'critique',
  status: 'en_validation',
  areaM2: 26100,
  reportCount: 41,
  createdAt: '2026-08-18T15:40:00Z',
  cx: 356,
  cy: 646,
  rx: 70,
  ry: 34,
  wasteTons: 9.1
},
{
  id: 'PER-0036',
  zone: 'Port Autonome',
  dominantWaste: 'filets',
  severity: 'eleve',
  status: 'en_intervention',
  areaM2: 11800,
  reportCount: 22,
  createdAt: '2026-08-12T09:05:00Z',
  deadline: '2026-09-18T23:59:00Z',
  assignedOngId: 'ONG-02',
  cx: 300,
  cy: 192,
  rx: 46,
  ry: 30,
  wasteTons: 6.7
},
{
  id: 'PER-0034',
  zone: 'Mvou-Mvou',
  dominantWaste: 'menagers',
  severity: 'eleve',
  status: 'nouveau',
  areaM2: 9400,
  reportCount: 17,
  createdAt: '2026-08-28T06:20:00Z',
  cx: 330,
  cy: 402,
  rx: 42,
  ry: 34,
  wasteTons: 5.2
},
{
  id: 'PER-0031',
  zone: 'Tié-Tié',
  dominantWaste: 'menagers',
  severity: 'modere',
  status: 'en_validation',
  areaM2: 7200,
  reportCount: 12,
  createdAt: '2026-08-22T11:30:00Z',
  cx: 522,
  cy: 392,
  rx: 40,
  ry: 30,
  wasteTons: 3.8
},
{
  id: 'PER-0029',
  zone: 'Loandjili',
  dominantWaste: 'divers',
  severity: 'modere',
  status: 'en_intervention',
  areaM2: 6100,
  reportCount: 11,
  createdAt: '2026-08-15T14:10:00Z',
  deadline: '2026-09-14T23:59:00Z',
  assignedOngId: 'ONG-03',
  cx: 548,
  cy: 514,
  rx: 38,
  ry: 30,
  wasteTons: 3.1
},
{
  id: 'PER-0027',
  zone: 'Centre-ville',
  dominantWaste: 'plastiques',
  severity: 'eleve',
  status: 'en_validation',
  areaM2: 8800,
  reportCount: 19,
  createdAt: '2026-08-25T07:45:00Z',
  cx: 314,
  cy: 292,
  rx: 40,
  ry: 28,
  wasteTons: 4.6
},
{
  id: 'PER-0024',
  zone: 'Lumumba',
  dominantWaste: 'divers',
  severity: 'faible',
  status: 'nouveau',
  areaM2: 3200,
  reportCount: 6,
  createdAt: '2026-08-30T16:00:00Z',
  cx: 492,
  cy: 274,
  rx: 30,
  ry: 22,
  wasteTons: 1.4
},
{
  id: 'PER-0021',
  zone: 'Mongo-Mpoukou',
  dominantWaste: 'menagers',
  severity: 'modere',
  status: 'nouveau',
  areaM2: 5400,
  reportCount: 9,
  createdAt: '2026-08-29T10:25:00Z',
  cx: 714,
  cy: 378,
  rx: 40,
  ry: 30,
  wasteTons: 2.7
},
{
  id: 'PER-0018',
  zone: 'Baie de Loango',
  dominantWaste: 'filets',
  severity: 'faible',
  status: 'resolu',
  areaM2: 4100,
  reportCount: 8,
  createdAt: '2026-07-14T08:00:00Z',
  assignedOngId: 'ONG-02',
  cx: 312,
  cy: 100,
  rx: 44,
  ry: 26,
  wasteTons: 2.2
},
{
  id: 'PER-0015',
  zone: 'Ngambio',
  dominantWaste: 'menagers',
  severity: 'modere',
  status: 'resolu',
  areaM2: 5900,
  reportCount: 14,
  createdAt: '2026-07-02T09:30:00Z',
  assignedOngId: 'ONG-01',
  cx: 398,
  cy: 552,
  rx: 34,
  ry: 24,
  wasteTons: 3.3
},
{
  id: 'PER-0012',
  zone: 'Tié-Tié',
  dominantWaste: 'plastiques',
  severity: 'eleve',
  status: 'resolu',
  areaM2: 8200,
  reportCount: 21,
  createdAt: '2026-06-19T13:00:00Z',
  assignedOngId: 'ONG-04',
  cx: 586,
  cy: 356,
  rx: 36,
  ry: 26,
  wasteTons: 4.9
}];


export const mockPerimeters: Perimeter[] = seeds.map((s, i) => ({
  id: s.id,
  zone: s.zone,
  dominantWaste: s.dominantWaste,
  severity: s.severity,
  status: s.status,
  areaM2: s.areaM2,
  reportCount: s.reportCount,
  createdAt: s.createdAt,
  deadline: s.deadline,
  assignedOngId: s.assignedOngId,
  polygon: blob(s.cx, s.cy, s.rx, s.ry, i + 1),
  centroid: toGeo(s.cx, s.cy),
  wasteTons: s.wasteTons
}));

export const criticalPerimeters = mockPerimeters.
filter((p) => p.status !== 'resolu').
sort((a, b) => {
  const order = { critique: 0, eleve: 1, modere: 2, faible: 3 } as const;
  return order[a.severity] - order[b.severity] || b.reportCount - a.reportCount;
}).
slice(0, 5);