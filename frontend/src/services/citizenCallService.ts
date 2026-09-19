import { API_BASE_URL } from '../config/api';

export interface CitizenCall {
  id: string;
  perimeterId: string;
  zone: string;
  title: string;
  description: string;
  plannedDate: string;
  startTime: string;
  endTime: string;
  maxParticipants: number;
  currentParticipants: number;
  materials: string[];
  compensation?: number;
  ecoPoints: number;
  status: 'ouvert' | 'en_cours' | 'termine' | 'annule';
  organizer: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateCitizenCall {
  perimeterId: string;
  zone: string;
  title: string;
  description: string;
  plannedDate: string;
  startTime: string;
  endTime: string;
  maxParticipants: number;
  materials: string[];
  compensation?: number;
  ecoPoints: number;
  organizer: string;
}

export interface UpdateCitizenCall {
  status?: CitizenCall['status'];
  currentParticipants?: number;
  description?: string;
}

class CitizenCallService {
  async getCitizenCalls(): Promise<CitizenCall[]> {
    // Mock implementation
    const mockCalls: CitizenCall[] = [
      {
        id: 'CALL-001',
        perimeterId: 'PER-001',
        zone: 'Ngambio',
        title: 'Nettoyage de la plage de Ngambio',
        description: 'Opération de collecte des déchets plastiques sur la plage de Ngambio. Matériel fourni.',
        plannedDate: '2026-09-20',
        startTime: '08:00',
        endTime: '12:00',
        maxParticipants: 20,
        currentParticipants: 15,
        materials: ['sacs', 'gants', 'bouteilles_eau'],
        compensation: 5000,
        ecoPoints: 100,
        status: 'ouvert',
        organizer: 'ECOMER',
        createdAt: '2026-09-10T10:00:00Z'
      },
      {
        id: 'CALL-002',
        perimeterId: 'PER-002',
        zone: 'Littoral Sud',
        title: 'Collecte des filets de pêche',
        description: 'Retrait des filets de pêche abandonnés le long du littoral sud.',
        plannedDate: '2026-09-25',
        startTime: '07:00',
        endTime: '11:00',
        maxParticipants: 15,
        currentParticipants: 8,
        materials: ['sacs', 'gants', 'ciseaux'],
        compensation: 7500,
        ecoPoints: 150,
        status: 'ouvert',
        organizer: 'ECOMER',
        createdAt: '2026-09-12T14:00:00Z'
      },
      {
        id: 'CALL-003',
        perimeterId: 'PER-003',
        zone: 'Tchimbamba',
        title: 'Curage du canal de Tchimbamba',
        description: 'Opération de nettoyage du canal de Tchimbamba avec les résidents locaux.',
        plannedDate: '2026-09-15',
        startTime: '09:00',
        endTime: '13:00',
        maxParticipants: 25,
        currentParticipants: 25,
        materials: ['sacs', 'gants', 'pelles'],
        compensation: 3000,
        ecoPoints: 75,
        status: 'termine',
        organizer: 'ECOMER',
        createdAt: '2026-09-05T09:00:00Z'
      }
    ];

    await new Promise(resolve => setTimeout(resolve, 300));
    return mockCalls;
  }

  async getCitizenCallById(id: string): Promise<CitizenCall> {
    const calls = await this.getCitizenCalls();
    const call = calls.find(c => c.id === id);
    if (!call) throw new Error('Citizen call not found');
    return call;
  }

  async createCitizenCall(data: CreateCitizenCall): Promise<CitizenCall> {
    const newCall: CitizenCall = {
      id: `CALL-${Date.now().toString().slice(-3)}`,
      ...data,
      currentParticipants: 0,
      status: 'ouvert',
      createdAt: new Date().toISOString()
    };

    await new Promise(resolve => setTimeout(resolve, 300));
    return newCall;
  }

  async updateCitizenCall(id: string, data: UpdateCitizenCall): Promise<CitizenCall> {
    const calls = await this.getCitizenCalls();
    const index = calls.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Citizen call not found');

    const updated = { ...calls[index], ...data, updatedAt: new Date().toISOString() };
    await new Promise(resolve => setTimeout(resolve, 300));
    return updated;
  }

  async registerParticipant(callId: string): Promise<CitizenCall> {
    const calls = await this.getCitizenCalls();
    const index = calls.findIndex(c => c.id === callId);
    if (index === -1) throw new Error('Citizen call not found');

    const updated = { 
      ...calls[index], 
      currentParticipants: calls[index].currentParticipants + 1,
      updatedAt: new Date().toISOString() 
    };
    await new Promise(resolve => setTimeout(resolve, 300));
    return updated;
  }

  async startCall(id: string): Promise<CitizenCall> {
    return this.updateCitizenCall(id, { status: 'en_cours' });
  }

  async completeCall(id: string): Promise<CitizenCall> {
    return this.updateCitizenCall(id, { status: 'termine' });
  }

  async cancelCall(id: string): Promise<CitizenCall> {
    return this.updateCitizenCall(id, { status: 'annule' });
  }

  async deleteCitizenCall(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
  }
}

export const citizenCallService = new CitizenCallService();
