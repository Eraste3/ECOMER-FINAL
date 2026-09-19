import { API_BASE_URL } from '../config/api';

export interface AuthorizationRequest {
  id: string;
  ongId: string;
  ongName: string;
  perimeterId: string;
  zone: string;
  wasteType: string;
  severity: string;
  plannedDate: string;
  agents: number;
  interventionType: string;
  materials: string[];
  note?: string;
  status: 'en_attente' | 'approuvee' | 'refusee';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface CreateAuthorizationRequest {
  ongId: string;
  ongName: string;
  perimeterId: string;
  zone: string;
  wasteType: string;
  severity: string;
  plannedDate: string;
  agents: number;
  interventionType: string;
  materials: string[];
  note?: string;
}

export interface UpdateAuthorizationRequest {
  status?: AuthorizationRequest['status'];
  reviewedBy?: string;
}

class AuthorizationRequestService {
  async getAuthorizationRequests(): Promise<AuthorizationRequest[]> {
    // Mock implementation
    const mockRequests: AuthorizationRequest[] = [
      {
        id: 'REQ-001',
        ongId: 'ONG-001',
        ongName: 'Océan Propre Congo',
        perimeterId: 'PER-001',
        zone: 'Ngambio',
        wasteType: 'plastiques',
        severity: 'critique',
        plannedDate: '2026-09-15',
        agents: 12,
        interventionType: 'Collecte manuelle',
        materials: ['sacs', 'gants', 'camion'],
        note: 'Zone difficile d\'accès',
        status: 'en_attente',
        submittedAt: '2026-09-06T10:00:00Z'
      },
      {
        id: 'REQ-002',
        ongId: 'ONG-001',
        ongName: 'Océan Propre Congo',
        perimeterId: 'PER-002',
        zone: 'Littoral Sud',
        wasteType: 'filets',
        severity: 'eleve',
        plannedDate: '2026-09-20',
        agents: 8,
        interventionType: 'Dépollution littorale',
        materials: ['sacs', 'gants'],
        status: 'approuvee',
        submittedAt: '2026-09-05T14:00:00Z',
        reviewedAt: '2026-09-06T09:00:00Z',
        reviewedBy: 'Admin ECOMER'
      },
      {
        id: 'REQ-003',
        ongId: 'ONG-002',
        ongName: 'Congo Clean',
        perimeterId: 'PER-003',
        zone: 'Tchimbamba',
        wasteType: 'menagers',
        severity: 'modere',
        plannedDate: '2026-09-25',
        agents: 6,
        interventionType: 'Curage de canal',
        materials: ['sacs', 'collecte'],
        status: 'refusee',
        submittedAt: '2026-09-04T16:00:00Z',
        reviewedAt: '2026-09-05T11:00:00Z',
        reviewedBy: 'Admin ECOMER'
      }
    ];

    await new Promise(resolve => setTimeout(resolve, 300));
    return mockRequests;
  }

  async getAuthorizationRequestById(id: string): Promise<AuthorizationRequest> {
    const requests = await this.getAuthorizationRequests();
    const request = requests.find(r => r.id === id);
    if (!request) throw new Error('Authorization request not found');
    return request;
  }

  async createAuthorizationRequest(data: CreateAuthorizationRequest): Promise<AuthorizationRequest> {
    const newRequest: AuthorizationRequest = {
      id: `REQ-${Date.now().toString().slice(-3)}`,
      ...data,
      status: 'en_attente',
      submittedAt: new Date().toISOString()
    };

    await new Promise(resolve => setTimeout(resolve, 300));
    return newRequest;
  }

  async updateAuthorizationRequest(id: string, data: UpdateAuthorizationRequest): Promise<AuthorizationRequest> {
    const requests = await this.getAuthorizationRequests();
    const index = requests.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Authorization request not found');

    const updated = { 
      ...requests[index], 
      ...data, 
      reviewedAt: new Date().toISOString() 
    };
    await new Promise(resolve => setTimeout(resolve, 300));
    return updated;
  }

  async approveRequest(id: string, reviewedBy: string): Promise<AuthorizationRequest> {
    return this.updateAuthorizationRequest(id, { status: 'approuvee', reviewedBy });
  }

  async rejectRequest(id: string, reviewedBy: string): Promise<AuthorizationRequest> {
    return this.updateAuthorizationRequest(id, { status: 'refusee', reviewedBy });
  }

  async deleteAuthorizationRequest(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
  }
}

export const authorizationRequestService = new AuthorizationRequestService();
