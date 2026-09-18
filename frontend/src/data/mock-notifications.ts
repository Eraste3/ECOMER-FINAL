import type { AppNotification } from '../types';

export const mockNotifications: AppNotification[] = [
{
  id: 'NTF-01',
  kind: 'perimetre_critique',
  title: 'Nouveau périmètre critique détecté',
  body: 'PER-0038 — Côte Sauvage : 41 signalements regroupés, hydrocarbures.',
  createdAt: '2026-09-01T06:42:00Z',
  read: false,
  audience: ['ong', 'direnv', 'admin']
},
{
  id: 'NTF-02',
  kind: 'demande_ong',
  title: 'Une ONG demande une autorisation',
  body: 'Océan Propre Congo — périmètre PER-0041 (Ngambio), 12 agents.',
  createdAt: '2026-09-01T05:55:00Z',
  read: false,
  audience: ['direnv', 'admin']
},
{
  id: 'NTF-03',
  kind: 'nouveau_signalement',
  title: 'Nouveau signalement citoyen',
  body: 'ECM-00124 — Ngambio, déchets plastiques, gravité élevée.',
  createdAt: '2026-08-31T17:21:00Z',
  read: false,
  audience: ['direnv', 'admin', 'ong']
},
{
  id: 'NTF-04',
  kind: 'nouveau_signalement',
  title: 'Signalement ONG prioritaire',
  body: 'ECM-00123 déposé par une ONG accréditée — traitement prioritaire.',
  createdAt: '2026-08-31T11:41:00Z',
  read: false,
  audience: ['direnv', 'admin']
},
{
  id: 'NTF-05',
  kind: 'intervention_terminee',
  title: 'Intervention terminée',
  body: 'INT-0074 — Baie de Loango : preuve « après » déposée, en attente de validation.',
  createdAt: '2026-08-30T16:10:00Z',
  read: true,
  audience: ['direnv', 'admin', 'ong']
},
{
  id: 'NTF-06',
  kind: 'ong_validee',
  title: 'Compte ONG validé',
  body: 'Eaux Vives Mongo-Mpoukou est désormais accréditée sur ECOMER.',
  createdAt: '2026-08-28T09:00:00Z',
  read: true,
  audience: ['admin', 'ong']
},
{
  id: 'NTF-07',
  kind: 'systeme',
  title: 'Module IA — modèle mis à jour',
  body: 'Classification des déchets v2.4 déployée (précision 94,2 %).',
  createdAt: '2026-08-27T22:30:00Z',
  read: true,
  audience: ['admin']
},
{
  id: 'NTF-08',
  kind: 'intervention_terminee',
  title: 'Périmètre résolu',
  body: 'PER-0015 — Ngambio est passé au statut « Résolu ».',
  createdAt: '2026-08-26T14:02:00Z',
  read: true,
  audience: ['citoyen', 'ong', 'direnv', 'admin']
}];