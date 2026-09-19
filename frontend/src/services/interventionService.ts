import { API_BASE_URL } from '../config/api';

export interface Intervention {
  id: string;
  perimeterId: string;
  zone: string;
  operatorType: 'ecomer' | 'ong' | 'recycleur';
  operator: string;
  status: 'planifie' | 'en_cours' | 'terminee' | 'validee' | 'annulee';
  severity: 'critique' | 'eleve' | 'modere' | 'faible';
  areaM2: number;
  team: string;
  lead: string;
  agents: number;
  startDate: string;
  deadline: string;
  materials: string[];
  beforePhoto?: string;
  afterPhoto?: string;
  collectedTons?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateInterventionRequest {
  perimeterId: string;
  zone: string;
  operatorType: Intervention['operatorType'];
  operator: string;
  severity: Intervention['severity'];
  areaM2: number;
  team: string;
  lead: string;
  agents: number;
  startDate: string;
  deadline: string;
  materials: string[];
}

export interface UpdateInterventionRequest {
  status?: Intervention['status'];
  afterPhoto?: string;
  collectedTons?: number;
}

class InterventionService {
  async getInterventions(): Promise<Intervention[]> {
    // Mock implementation
    const mockInterventions: Intervention[] = [
      {
        id: 'INT-001',
        perimeterId: 'PER-001',
        zone: 'Ngambio',
        operatorType: 'ong',
        operator: 'Océan Propre Congo',
        status: 'en_cours',
        severity: 'critique',
        areaM2: 2500,
        team: 'Équipe Alpha',
        lead: 'Jean Kouassi',
        agents: 12,
        startDate: '2026-09-05T08:00:00Z',
        deadline: '2026-10-05T08:00:00Z',
        materials: ['sacs', 'gants', 'camion'],
        beforePhoto: '/091ac480-3406-4ca0-af91-85559655c127.jpg',
        createdAt: '2026-09-05T08:00:00Z'
      },
      {
        id: 'INT-002',
        perimeterId: 'PER-002',
        zone: 'Littoral Sud',
        operatorType: 'ong',
        operator: 'Océan Propre Congo',
        status: 'planifie',
        severity: 'eleve',
        areaM2: 1800,
        team: 'Équipe Beta',
        lead: 'Marie Malonga',
        agents: 8,
        startDate: '2026-09-10T08:00:00Z',
        deadline: '2026-10-10T08:00:00Z',
        materials: ['sacs', 'gants'],
        createdAt: '2026-09-06T10:00:00Z'
      },
      {
        id: 'INT-003',
        perimeterId: 'PER-003',
        zone: 'Tchimbamba',
        operatorType: 'ecomer',
        operator: 'ECOMER',
        status: 'terminee',
        severity: 'modere',
        areaM2: 1200,
        team: 'Équipe Gamma',
        lead: 'Paul Mboussi',
        agents: 6,
        startDate: '2026-08-20T08:00:00Z',
        deadline: '2026-09-19T08:00:00Z',
        materials: ['sacs', 'gants', 'collecte'],
        beforePhoto: '/091ac480-3406-4ca0-af91-85559655c127.jpg',
        afterPhoto: '/091ac480-3406-4ca0-af91-85559655c127.jpg',
        collectedTons: 1.8,
        createdAt: '2026-08-20T08:00:00Z'
      }
    ];

    await new Promise(resolve => setTimeout(resolve, 300));
    return mockInterventions;
  }

  async getInterventionById(id: string): Promise<Intervention> {
    const interventions = await this.getInterventions();
    const intervention = interventions.find(i => i.id === id);
    if (!intervention) throw new Error('Intervention not found');
    return intervention;
  }

  async createIntervention(data: CreateInterventionRequest): Promise<Intervention> {
    const newIntervention: Intervention = {
      id: `INT-${Date.now().toString().slice(-3)}`,
      ...data,
      status: 'planifie',
      beforePhoto: undefined,
      afterPhoto: undefined,
      collectedTons: undefined,
      createdAt: new Date().toISOString()
    };

    await new Promise(resolve => setTimeout(resolve, 300));
    return newIntervention;
  }

  async updateIntervention(id: string, data: UpdateInterventionRequest): Promise<Intervention> {
    const interventions = await this.getInterventions();
    const index = interventions.findIndex(i => i.id === id);
    if (index === -1) throw new Error('Intervention not found');

    const updated = { ...interventions[index], ...data, updatedAt: new Date().toISOString() };
    await new Promise(resolve => setTimeout(resolve, 300));
    return updated;
  }

  async addAfterProof(id: string, afterPhoto: string, collectedTons: number): Promise<Intervention> {
    return this.updateIntervention(id, { afterPhoto, collectedTons });
  }

  async deleteIntervention(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
  }
}

export const interventionService = new InterventionService();
