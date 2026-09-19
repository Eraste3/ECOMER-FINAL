import { API_BASE_URL } from '../config/api';

export interface CollecteOperation {
  id: string;
  perimeterId: string;
  zone: string;
  operatorType: 'ecomer' | 'ong' | 'recycleur';
  operator: string;
  status: 'planifie' | 'en_cours' | 'terminee' | 'annulee';
  plannedDate: string;
  startDate?: string;
  endDate?: string;
  team: string;
  lead: string;
  agents: number;
  materials: string[];
  beforePhoto?: string;
  afterPhoto?: string;
  collectedTons?: number;
  wasteTypes: string[];
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateCollecteOperation {
  perimeterId: string;
  zone: string;
  operatorType: CollecteOperation['operatorType'];
  operator: string;
  plannedDate: string;
  team: string;
  lead: string;
  agents: number;
  materials: string[];
  wasteTypes: string[];
  notes?: string;
}

export interface UpdateCollecteOperation {
  status?: CollecteOperation['status'];
  startDate?: string;
  endDate?: string;
  afterPhoto?: string;
  collectedTons?: number;
  notes?: string;
}

class CollecteService {
  async getCollecteOperations(): Promise<CollecteOperation[]> {
    // Mock implementation
    const mockOperations: CollecteOperation[] = [
      {
        id: 'COL-001',
        perimeterId: 'PER-001',
        zone: 'Ngambio',
        operatorType: 'ecomer',
        operator: 'ECOMER',
        status: 'en_cours',
        plannedDate: '2026-09-10',
        startDate: '2026-09-10T08:00:00Z',
        team: 'Équipe Alpha',
        lead: 'Jean Kouassi',
        agents: 12,
        materials: ['sacs', 'gants', 'camion'],
        wasteTypes: ['plastiques', 'menagers'],
        beforePhoto: '/091ac480-3406-4ca0-af91-85559655c127.jpg',
        collectedTons: 2.5,
        createdAt: '2026-09-08T10:00:00Z'
      },
      {
        id: 'COL-002',
        perimeterId: 'PER-002',
        zone: 'Littoral Sud',
        operatorType: 'ong',
        operator: 'Océan Propre Congo',
        status: 'planifie',
        plannedDate: '2026-09-15',
        team: 'Équipe Beta',
        lead: 'Marie Malonga',
        agents: 8,
        materials: ['sacs', 'gants'],
        wasteTypes: ['filets'],
        createdAt: '2026-09-09T14:00:00Z'
      },
      {
        id: 'COL-003',
        perimeterId: 'PER-003',
        zone: 'Tchimbamba',
        operatorType: 'ecomer',
        operator: 'ECOMER',
        status: 'terminee',
        plannedDate: '2026-09-01',
        startDate: '2026-09-01T08:00:00Z',
        endDate: '2026-09-02T17:00:00Z',
        team: 'Équipe Gamma',
        lead: 'Paul Mboussi',
        agents: 6,
        materials: ['sacs', 'collecte'],
        wasteTypes: ['menagers'],
        beforePhoto: '/091ac480-3406-4ca0-af91-85559655c127.jpg',
        afterPhoto: '/091ac480-3406-4ca0-af91-85559655c127.jpg',
        collectedTons: 1.8,
        createdAt: '2026-08-30T10:00:00Z'
      }
    ];

    await new Promise(resolve => setTimeout(resolve, 300));
    return mockOperations;
  }

  async getCollecteOperationById(id: string): Promise<CollecteOperation> {
    const operations = await this.getCollecteOperations();
    const operation = operations.find(o => o.id === id);
    if (!operation) throw new Error('Collecte operation not found');
    return operation;
  }

  async createCollecteOperation(data: CreateCollecteOperation): Promise<CollecteOperation> {
    const newOperation: CollecteOperation = {
      id: `COL-${Date.now().toString().slice(-3)}`,
      ...data,
      status: 'planifie',
      beforePhoto: undefined,
      afterPhoto: undefined,
      collectedTons: undefined,
      createdAt: new Date().toISOString()
    };

    await new Promise(resolve => setTimeout(resolve, 300));
    return newOperation;
  }

  async updateCollecteOperation(id: string, data: UpdateCollecteOperation): Promise<CollecteOperation> {
    const operations = await this.getCollecteOperations();
    const index = operations.findIndex(o => o.id === id);
    if (index === -1) throw new Error('Collecte operation not found');

    const updated = { ...operations[index], ...data, updatedAt: new Date().toISOString() };
    await new Promise(resolve => setTimeout(resolve, 300));
    return updated;
  }

  async startOperation(id: string): Promise<CollecteOperation> {
    return this.updateCollecteOperation(id, { status: 'en_cours', startDate: new Date().toISOString() });
  }

  async completeOperation(id: string, afterPhoto: string, collectedTons: number): Promise<CollecteOperation> {
    return this.updateCollecteOperation(id, {
      status: 'terminee',
      afterPhoto,
      collectedTons,
      endDate: new Date().toISOString()
    });
  }

  async cancelOperation(id: string): Promise<CollecteOperation> {
    return this.updateCollecteOperation(id, { status: 'annulee' });
  }

  async deleteCollecteOperation(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
  }
}

export const collecteService = new CollecteService();
