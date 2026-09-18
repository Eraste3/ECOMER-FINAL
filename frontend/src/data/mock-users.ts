import type { AppUser } from '../types';

export const CURRENT_CITIZEN_ID = 'USR-1042';

export const mockUsers: AppUser[] = [
{
  id: 'USR-1042',
  name: 'Divine Makosso',
  email: 'divine.makosso@gmail.com',
  role: 'citoyen',
  status: 'actif',
  createdAt: '2026-03-12T08:00:00Z',
  lastActivity: '2026-09-01T07:15:00Z',
  zone: 'Ngambio',
  ecoPoints: 340
},
{
  id: 'USR-1043',
  name: 'Jean Tchibinda',
  email: 'jean.tchibinda@gmail.com',
  role: 'citoyen',
  status: 'actif',
  createdAt: '2025-12-02T08:00:00Z',
  lastActivity: '2026-08-31T18:40:00Z',
  zone: 'Tié-Tié',
  ecoPoints: 820
},
{
  id: 'USR-1044',
  name: 'Grâce Mabiala',
  email: 'grace.mabiala@oceanpropre.cg',
  role: 'ong',
  status: 'actif',
  createdAt: '2025-11-04T08:00:00Z',
  lastActivity: '2026-09-01T06:50:00Z',
  zone: 'Ngambio',
  organisation: 'Océan Propre Congo',
  ecoPoints: 740
},
{
  id: 'USR-1045',
  name: 'Patrick Loemba',
  email: 'patrick.loemba@meretvie.org',
  role: 'ong',
  status: 'actif',
  createdAt: '2025-09-21T08:00:00Z',
  lastActivity: '2026-08-30T12:05:00Z',
  zone: 'Port Autonome',
  organisation: 'Association Mer & Vie',
  ecoPoints: 690
},
{
  id: 'USR-1046',
  name: 'Alphonse Ngoma',
  email: 'a.ngoma@environnement.pnr.cg',
  role: 'direnv',
  status: 'actif',
  createdAt: '2025-06-01T08:00:00Z',
  lastActivity: '2026-09-01T07:02:00Z',
  zone: 'Centre-ville',
  organisation: 'Direction de l’Environnement'
},
{
  id: 'USR-1047',
  name: 'Chancelle Mouanda',
  email: 'c.mouanda@environnement.pnr.cg',
  role: 'direnv',
  status: 'actif',
  createdAt: '2025-06-01T08:00:00Z',
  lastActivity: '2026-08-31T16:20:00Z',
  zone: 'Centre-ville',
  organisation: 'Direction de l’Environnement'
},
{
  id: 'USR-1048',
  name: 'Équipe Municipale A',
  email: 'equipe.a@voirie.pnr.cg',
  role: 'agent',
  status: 'actif',
  createdAt: '2025-07-15T08:00:00Z',
  lastActivity: '2026-08-31T09:30:00Z',
  zone: 'Mvou-Mvou',
  organisation: 'Voirie municipale'
},
{
  id: 'USR-1049',
  name: 'Équipe Municipale B',
  email: 'equipe.b@voirie.pnr.cg',
  role: 'agent',
  status: 'actif',
  createdAt: '2025-07-15T08:00:00Z',
  lastActivity: '2026-08-29T14:10:00Z',
  zone: 'Loandjili',
  organisation: 'Voirie municipale'
},
{
  id: 'USR-1050',
  name: 'Rachel Bantsimba',
  email: 'rachel.b@ecomer.cg',
  role: 'admin',
  status: 'actif',
  createdAt: '2025-05-20T08:00:00Z',
  lastActivity: '2026-09-01T07:40:00Z',
  zone: 'Centre-ville',
  organisation: 'ECOMER'
},
{
  id: 'USR-1051',
  name: 'Merveille Kimbembe',
  email: 'horizonbleu@yahoo.fr',
  role: 'ong',
  status: 'suspendu',
  createdAt: '2025-12-11T08:00:00Z',
  lastActivity: '2026-07-18T11:00:00Z',
  zone: 'Lumumba',
  organisation: 'Horizon Bleu Lumumba'
},
{
  id: 'USR-1052',
  name: 'Aurélie Tchicaya',
  email: 'collectif.cs@outlook.com',
  role: 'ong',
  status: 'en_attente',
  createdAt: '2026-08-24T08:00:00Z',
  lastActivity: '2026-08-31T08:45:00Z',
  zone: 'Côte Sauvage',
  organisation: 'Collectif Côte Sauvage'
},
{
  id: 'USR-1053',
  name: 'Bénédicte Loubaki',
  email: 'benedicte.l@gmail.com',
  role: 'citoyen',
  status: 'actif',
  createdAt: '2026-05-19T08:00:00Z',
  lastActivity: '2026-08-31T20:12:00Z',
  zone: 'Loandjili',
  ecoPoints: 410
},
{
  id: 'USR-1054',
  name: 'Ferdinand Kaya',
  email: 'ferdinand.kaya@gmail.com',
  role: 'citoyen',
  status: 'suspendu',
  createdAt: '2026-02-08T08:00:00Z',
  lastActivity: '2026-06-14T10:00:00Z',
  zone: 'Mongo-Mpoukou',
  ecoPoints: 60
},
{
  id: 'USR-1055',
  name: 'Sarah Nzaba',
  email: 'sarah.nzaba@gmail.com',
  role: 'citoyen',
  status: 'actif',
  createdAt: '2026-07-30T08:00:00Z',
  lastActivity: '2026-09-01T06:05:00Z',
  zone: 'Centre-ville',
  ecoPoints: 190
},
{
  id: 'USR-1056',
  name: 'Christelle Bakala',
  email: 'eauxvives@ecomer.cg',
  role: 'ong',
  status: 'actif',
  createdAt: '2026-03-30T08:00:00Z',
  lastActivity: '2026-08-28T15:40:00Z',
  zone: 'Mongo-Mpoukou',
  organisation: 'Eaux Vives Mongo-Mpoukou'
}];


export const currentCitizen = mockUsers[0];