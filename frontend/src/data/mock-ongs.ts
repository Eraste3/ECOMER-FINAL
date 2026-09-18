import type { Ong } from '../types';

export const mockOngs: Ong[] = [
{
  id: 'ONG-01',
  name: 'Océan Propre Congo',
  manager: 'Grâce Mabiala',
  email: 'contact@oceanpropre.cg',
  phone: '+242 06 512 44 08',
  zone: 'Ngambio',
  status: 'actif',
  createdAt: '2025-11-04T09:00:00Z',
  agents: 24,
  interventionsDone: 31,
  accredited: true,
  logoColor: '#22d3ee'
},
{
  id: 'ONG-02',
  name: 'Association Mer & Vie',
  manager: 'Patrick Loemba',
  email: 'direction@meretvie.org',
  phone: '+242 05 774 12 90',
  zone: 'Port Autonome',
  status: 'actif',
  createdAt: '2025-09-21T09:00:00Z',
  agents: 18,
  interventionsDone: 27,
  accredited: true,
  logoColor: '#14b8a6'
},
{
  id: 'ONG-03',
  name: 'Loandjili Verte',
  manager: 'Sylvie Nkodia',
  email: 'contact@loandjiliverte.cg',
  phone: '+242 06 330 55 71',
  zone: 'Loandjili',
  status: 'actif',
  createdAt: '2026-01-16T09:00:00Z',
  agents: 12,
  interventionsDone: 14,
  accredited: true,
  logoColor: '#10b981'
},
{
  id: 'ONG-04',
  name: 'Brigade Bleue Tié-Tié',
  manager: 'Jean-Claude Bouity',
  email: 'brigadebleue@gmail.com',
  phone: '+242 06 118 74 23',
  zone: 'Tié-Tié',
  status: 'actif',
  createdAt: '2026-02-28T09:00:00Z',
  agents: 9,
  interventionsDone: 8,
  accredited: true,
  logoColor: '#1273b8'
},
{
  id: 'ONG-05',
  name: 'Collectif Côte Sauvage',
  manager: 'Aurélie Tchicaya',
  email: 'collectif.cs@outlook.com',
  phone: '+242 05 902 61 34',
  zone: 'Côte Sauvage',
  status: 'en_attente',
  createdAt: '2026-08-24T09:00:00Z',
  agents: 15,
  interventionsDone: 0,
  accredited: false,
  logoColor: '#f59e0b'
},
{
  id: 'ONG-06',
  name: 'Jeunesse Éco Mvou-Mvou',
  manager: 'Rodrigue Samba',
  email: 'jeunesse.eco@proton.me',
  phone: '+242 06 441 07 55',
  zone: 'Mvou-Mvou',
  status: 'en_attente',
  createdAt: '2026-08-29T09:00:00Z',
  agents: 7,
  interventionsDone: 0,
  accredited: false,
  logoColor: '#f97316'
},
{
  id: 'ONG-07',
  name: 'Horizon Bleu Lumumba',
  manager: 'Merveille Kimbembe',
  email: 'horizonbleu@yahoo.fr',
  phone: '+242 06 700 21 18',
  zone: 'Lumumba',
  status: 'suspendu',
  createdAt: '2025-12-11T09:00:00Z',
  agents: 5,
  interventionsDone: 3,
  accredited: false,
  logoColor: '#ef4444'
},
{
  id: 'ONG-08',
  name: 'Eaux Vives Mongo-Mpoukou',
  manager: 'Christelle Bakala',
  email: 'eauxvives@ecomer.cg',
  phone: '+242 05 265 88 42',
  zone: 'Mongo-Mpoukou',
  status: 'actif',
  createdAt: '2026-03-30T09:00:00Z',
  agents: 11,
  interventionsDone: 6,
  accredited: true,
  logoColor: '#0e4f7d'
}];


export const CURRENT_ONG_ID = 'ONG-01';