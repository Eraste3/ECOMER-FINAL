import type { Report } from '../types';
import { toGeo } from './mock-geo';
import { MEDIA } from './media';

interface Seed {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: Report['authorRole'];
  zone: Report['zone'];
  wasteType: Report['wasteType'];
  severity: Report['severity'];
  status: Report['status'];
  createdAt: string;
  description?: string;
  photoUrl?: string;
  x: number;
  y: number;
  perimeterId?: string;
  priority?: boolean;
  confidence: number;
}

const seeds: Seed[] = [
{
  id: 'ECM-00124',
  authorId: 'USR-1042',
  authorName: 'Divine Makosso',
  authorRole: 'citoyen',
  zone: 'Ngambio',
  wasteType: 'plastiques',
  severity: 'eleve',
  status: 'en_attente',
  createdAt: '2026-08-31T17:20:00Z',
  description: 'Amas de bouteilles plastiques bloquant le canal derrière le marché.',
  photoUrl: MEDIA.householdWaste,
  x: 338,
  y: 514,
  perimeterId: 'PER-0041',
  confidence: 94
},
{
  id: 'ECM-00121',
  authorId: 'USR-1042',
  authorName: 'Divine Makosso',
  authorRole: 'citoyen',
  zone: 'Ngambio',
  wasteType: 'menagers',
  severity: 'modere',
  status: 'autorise',
  createdAt: '2026-08-28T09:05:00Z',
  description: 'Dépôt sauvage en bord de lagune.',
  photoUrl: MEDIA.householdWaste,
  x: 356,
  y: 532,
  perimeterId: 'PER-0041',
  confidence: 88
},
{
  id: 'ECM-00118',
  authorId: 'USR-1042',
  authorName: 'Divine Makosso',
  authorRole: 'citoyen',
  zone: 'Ngambio',
  wasteType: 'plastiques',
  severity: 'eleve',
  status: 'en_cours',
  createdAt: '2026-08-22T08:35:00Z',
  photoUrl: MEDIA.beforePlastic,
  x: 328,
  y: 536,
  perimeterId: 'PER-0041',
  confidence: 96
},
{
  id: 'ECM-00098',
  authorId: 'USR-1042',
  authorName: 'Divine Makosso',
  authorRole: 'citoyen',
  zone: 'Ngambio',
  wasteType: 'menagers',
  severity: 'modere',
  status: 'resolu',
  createdAt: '2026-08-12T16:45:00Z',
  photoUrl: MEDIA.householdWaste,
  x: 396,
  y: 550,
  perimeterId: 'PER-0015',
  confidence: 82
},
{
  id: 'ECM-00123',
  authorId: 'USR-1044',
  authorName: 'Océan Propre Congo',
  authorRole: 'ong',
  zone: 'Côte Sauvage',
  wasteType: 'hydrocarbures',
  severity: 'critique',
  status: 'en_attente',
  createdAt: '2026-08-31T11:40:00Z',
  description: 'Nappe d’hydrocarbures sur 400 m de littoral, odeur forte.',
  photoUrl: MEDIA.oilSlick,
  x: 350,
  y: 640,
  perimeterId: 'PER-0038',
  priority: true,
  confidence: 97
},
{
  id: 'ECM-00122',
  authorId: 'USR-1043',
  authorName: 'Jean Tchibinda',
  authorRole: 'citoyen',
  zone: 'Tié-Tié',
  wasteType: 'menagers',
  severity: 'modere',
  status: 'en_attente',
  createdAt: '2026-08-30T14:15:00Z',
  photoUrl: MEDIA.householdWaste,
  x: 518,
  y: 388,
  perimeterId: 'PER-0031',
  confidence: 85
},
{
  id: 'ECM-00120',
  authorId: 'USR-1053',
  authorName: 'Bénédicte Loubaki',
  authorRole: 'citoyen',
  zone: 'Loandjili',
  wasteType: 'divers',
  severity: 'faible',
  status: 'autorise',
  createdAt: '2026-08-29T07:50:00Z',
  x: 544,
  y: 510,
  perimeterId: 'PER-0029',
  confidence: 71
},
{
  id: 'ECM-00119',
  authorId: 'USR-1055',
  authorName: 'Sarah Nzaba',
  authorRole: 'citoyen',
  zone: 'Centre-ville',
  wasteType: 'plastiques',
  severity: 'eleve',
  status: 'en_cours',
  createdAt: '2026-08-28T18:05:00Z',
  photoUrl: MEDIA.beforePlastic,
  x: 310,
  y: 288,
  perimeterId: 'PER-0027',
  confidence: 92
},
{
  id: 'ECM-00117',
  authorId: 'USR-1045',
  authorName: 'Association Mer & Vie',
  authorRole: 'ong',
  zone: 'Port Autonome',
  wasteType: 'filets',
  severity: 'eleve',
  status: 'en_cours',
  createdAt: '2026-08-26T10:20:00Z',
  description: 'Filets abandonnés autour des bouées du quai nord.',
  x: 296,
  y: 190,
  perimeterId: 'PER-0036',
  priority: true,
  confidence: 90
},
{
  id: 'ECM-00115',
  authorId: 'USR-1043',
  authorName: 'Jean Tchibinda',
  authorRole: 'citoyen',
  zone: 'Mvou-Mvou',
  wasteType: 'menagers',
  severity: 'eleve',
  status: 'en_attente',
  createdAt: '2026-08-28T06:20:00Z',
  photoUrl: MEDIA.householdWaste,
  x: 326,
  y: 400,
  perimeterId: 'PER-0034',
  confidence: 87
},
{
  id: 'ECM-00112',
  authorId: 'USR-1055',
  authorName: 'Sarah Nzaba',
  authorRole: 'citoyen',
  zone: 'Lumumba',
  wasteType: 'inconnue',
  severity: 'faible',
  status: 'en_attente',
  createdAt: '2026-08-30T16:00:00Z',
  x: 488,
  y: 272,
  perimeterId: 'PER-0024',
  confidence: 58
},
{
  id: 'ECM-00109',
  authorId: 'USR-1056',
  authorName: 'Eaux Vives Mongo-Mpoukou',
  authorRole: 'ong',
  zone: 'Mongo-Mpoukou',
  wasteType: 'menagers',
  severity: 'modere',
  status: 'autorise',
  createdAt: '2026-08-29T10:25:00Z',
  x: 710,
  y: 376,
  perimeterId: 'PER-0021',
  priority: true,
  confidence: 83
},
{
  id: 'ECM-00104',
  authorId: 'USR-1053',
  authorName: 'Bénédicte Loubaki',
  authorRole: 'citoyen',
  zone: 'Baie de Loango',
  wasteType: 'filets',
  severity: 'faible',
  status: 'resolu',
  createdAt: '2026-07-14T08:00:00Z',
  x: 308,
  y: 98,
  perimeterId: 'PER-0018',
  confidence: 76
},
{
  id: 'ECM-00101',
  authorId: 'USR-1043',
  authorName: 'Jean Tchibinda',
  authorRole: 'citoyen',
  zone: 'Tié-Tié',
  wasteType: 'plastiques',
  severity: 'eleve',
  status: 'resolu',
  createdAt: '2026-06-19T13:00:00Z',
  photoUrl: MEDIA.beforePlastic,
  x: 584,
  y: 354,
  perimeterId: 'PER-0012',
  confidence: 93
},
{
  id: 'ECM-00096',
  authorId: 'USR-1055',
  authorName: 'Sarah Nzaba',
  authorRole: 'citoyen',
  zone: 'Côte Sauvage',
  wasteType: 'divers',
  severity: 'modere',
  status: 'en_attente',
  createdAt: '2026-08-27T15:30:00Z',
  x: 386,
  y: 654,
  perimeterId: 'PER-0038',
  confidence: 74
}];


export const mockReports: Report[] = seeds.map((s) => ({
  id: s.id,
  authorId: s.authorId,
  authorName: s.authorName,
  authorRole: s.authorRole,
  zone: s.zone,
  wasteType: s.wasteType,
  severity: s.severity,
  status: s.status,
  createdAt: s.createdAt,
  description: s.description,
  photoUrl: s.photoUrl,
  point: toGeo(s.x, s.y),
  perimeterId: s.perimeterId,
  priority: Boolean(s.priority),
  ai: {
    detectedType: s.wasteType,
    confidence: s.confidence,
    estimatedSeverity: s.severity
  }
}));