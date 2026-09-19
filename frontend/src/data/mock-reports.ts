import { toGeo } from './mock-geo';
import type { Report } from '../types';

export const mockReports: Report[] = [
  {
    id: 'R-260917-01',
    authorId: 'CIT-1842',
    authorName: 'Albert Mabiala',
    authorRole: 'citoyen',
    zone: 'Baie de Loango',
    wasteType: 'plastiques',
    severity: 'critique',
    status: 'en_cours',
    createdAt: '2026-09-17T08:42:00Z',
    description: 'Accumulation importante de bouteilles et sacs plastiques sur la plage.',
    point: toGeo(305, 92),
    perimeterId: 'PER-001',
    priority: true,
    ai: {
      detectedType: 'plastiques',
      confidence: 94,
      estimatedSeverity: 'critique'
    }
  },
  {
    id: 'R-260918-02',
    authorId: 'CIT-0931',
    authorName: 'Clarisse Okemba',
    authorRole: 'citoyen',
    zone: 'Centre-ville',
    wasteType: 'menagers',
    severity: 'eleve',
    status: 'en_attente',
    createdAt: '2026-09-18T09:10:00Z',
    description: 'Dépôt sauvage d’ordures ménagères derrière le marché.',
    point: toGeo(336, 284),
    perimeterId: 'PER-002',
    priority: false,
    ai: {
      detectedType: 'menagers',
      confidence: 89,
      estimatedSeverity: 'eleve'
    }
  },
  {
    id: 'R-260915-03',
    authorId: 'ONG-07',
    authorName: 'Dieudonné Ngoma',
    authorRole: 'ong',
    zone: 'Port Autonome',
    wasteType: 'hydrocarbures',
    severity: 'critique',
    status: 'en_validation',
    createdAt: '2026-09-15T07:35:00Z',
    description: 'Nappe d’hydrocarbures détectée le long des quais, forte odeur de fioul.',
    point: toGeo(314, 186),
    perimeterId: 'PER-003',
    priority: true,
    ai: {
      detectedType: 'hydrocarbures',
      confidence: 97,
      estimatedSeverity: 'critique'
    }
  },
  {
    id: 'R-260916-04',
    authorId: 'CIT-2274',
    authorName: 'Rachelle Bantsimba',
    authorRole: 'citoyen',
    zone: 'Lumumba',
    wasteType: 'divers',
    severity: 'modere',
    status: 'autorise',
    createdAt: '2026-09-16T12:20:00Z',
    description: 'Encombrants et déchets divers déposés près de l’école primaire.',
    point: toGeo(502, 272),
    perimeterId: 'PER-004',
    priority: false,
    ai: {
      detectedType: 'divers',
      confidence: 82,
      estimatedSeverity: 'modere'
    }
  },
  {
    id: 'R-260919-05',
    authorId: 'CIT-3510',
    authorName: 'Simon Loussala',
    authorRole: 'citoyen',
    zone: 'Mvou-Mvou',
    wasteType: 'plastiques',
    severity: 'eleve',
    status: 'en_attente',
    createdAt: '2026-09-19T06:50:00Z',
    description: 'Caniveau obstrué par des déchets plastiques après la marée haute.',
    point: toGeo(344, 398),
    perimeterId: 'PER-005',
    priority: true,
    ai: {
      detectedType: 'plastiques',
      confidence: 91,
      estimatedSeverity: 'eleve'
    }
  },
  {
    id: 'R-260914-06',
    authorId: 'CIT-1198',
    authorName: 'Marthe Ibouanga',
    authorRole: 'citoyen',
    zone: 'Tié-Tié',
    wasteType: 'menagers',
    severity: 'modere',
    status: 'en_cours',
    createdAt: '2026-09-14T15:05:00Z',
    description: 'Déchets ménagers éparpillés le long du terrain de football.',
    point: toGeo(525, 390),
    perimeterId: 'PER-006',
    priority: false,
    ai: {
      detectedType: 'menagers',
      confidence: 86,
      estimatedSeverity: 'modere'
    }
  },
  {
    id: 'R-260916-07',
    authorId: 'ONG-04',
    authorName: 'Jean-Patrick Mavoungou',
    authorRole: 'ong',
    zone: 'Ngambio',
    wasteType: 'filets',
    severity: 'eleve',
    status: 'en_validation',
    createdAt: '2026-09-16T10:15:00Z',
    description: 'Filets de pêche abandonnés sur la zone de débarquement des pirogues.',
    point: toGeo(358, 518),
    perimeterId: 'PER-007',
    priority: true,
    ai: {
      detectedType: 'filets',
      confidence: 90,
      estimatedSeverity: 'eleve'
    }
  },
  {
    id: 'R-260912-08',
    authorId: 'CIT-2716',
    authorName: 'Prisca Loubaki',
    authorRole: 'citoyen',
    zone: 'Loandjili',
    wasteType: 'divers',
    severity: 'faible',
    status: 'resolu',
    createdAt: '2026-09-12T14:40:00Z',
    description: 'Petit amas de déchets divers nettoyé par la municipalité.',
    point: toGeo(553, 510),
    perimeterId: 'PER-008',
    priority: false,
    ai: {
      detectedType: 'divers',
      confidence: 78,
      estimatedSeverity: 'faible'
    }
  },
  {
    id: 'R-260918-09',
    authorId: 'CIT-0833',
    authorName: 'Joël Tchicaya',
    authorRole: 'citoyen',
    zone: 'Mongo-Mpoukou',
    wasteType: 'plastiques',
    severity: 'modere',
    status: 'en_cours',
    createdAt: '2026-09-18T11:30:00Z',
    description: 'Bouteilles et sachets plastiques accumulés près du marché de quartier.',
    point: toGeo(720, 376),
    perimeterId: 'PER-009',
    priority: false,
    ai: {
      detectedType: 'plastiques',
      confidence: 88,
      estimatedSeverity: 'modere'
    }
  },
  {
    id: 'R-260919-10',
    authorId: 'ONG-02',
    authorName: 'Nadège Okana',
    authorRole: 'ong',
    zone: 'Côte Sauvage',
    wasteType: 'hydrocarbures',
    severity: 'critique',
    status: 'en_attente',
    createdAt: '2026-09-19T05:25:00Z',
    description: 'Résidus de fioul sur le sable et les rochers, périmètre à surveiller.',
    point: toGeo(374, 638),
    perimeterId: 'PER-010',
    priority: true,
    ai: {
      detectedType: 'hydrocarbures',
      confidence: 95,
      estimatedSeverity: 'critique'
    }
  }
];