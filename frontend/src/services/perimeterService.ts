import { API_BASE_URL } from '../config/api';

export interface Perimeter {
  id: string;
  zone: string;
  status: 'nouveau' | 'en_validation' | 'en_cours' | 'resolu';
  severity: 'critique' | 'eleve' | 'modere' | 'faible';
  dominantWaste: string;
  reportCount: number;
  areaM2: number;
  wasteTons: number;
  centroid: { lat: number; lng: number };
  polygon?: Array<{ lat: number; lng: number }>;
  createdAt: string;
  updatedAt?: string;
}

export interface CreatePerimeterRequest {
  zone: string;
  severity: Perimeter['severity'];
  dominantWaste: string;
  reportIds: string[];
  areaM2: number;
  wasteTons: number;
  centroid: { lat: number; lng: number };
}

export interface UpdatePerimeterRequest {
  status?: Perimeter['status'];
  severity?: Perimeter['severity'];
  wasteTons?: number;
}

class PerimeterService {
  async getPerimeters(): Promise<Perimeter[]> {
    // Mock implementation - replace with actual API call when backend is ready
    const mockPerimeters: Perimeter[] = [
      {
        id: 'PER-001',
        zone: 'Ngambio',
        status: 'nouveau',
        severity: 'critique',
        dominantWaste: 'plastiques',
        reportCount: 12,
        areaM2: 2500,
        wasteTons: 3.5,
        centroid: { lat: -4.789, lng: 11.876 },
        createdAt: '2026-09-01T08:00:00Z'
      },
      {
        id: 'PER-002',
        zone: 'Littoral Sud',
        status: 'en_validation',
        severity: 'eleve',
        dominantWaste: 'filets',
        reportCount: 8,
        areaM2: 1800,
        wasteTons: 2.2,
        centroid: { lat: -4.795, lng: 11.882 },
        createdAt: '2026-09-02T10:30:00Z'
      },
      {
        id: 'PER-003',
        zone: 'Tchimbamba',
        status: 'en_cours',
        severity: 'modere',
        dominantWaste: 'menagers',
        reportCount: 5,
        areaM2: 1200,
        wasteTons: 1.8,
        centroid: { lat: -4.792, lng: 11.879 },
        createdAt: '2026-09-03T14:15:00Z'
      },
      {
        id: 'PER-004',
        zone: 'Loango',
        status: 'resolu',
        severity: 'faible',
        dominantWaste: 'divers',
        reportCount: 3,
        areaM2: 800,
        wasteTons: 0.9,
        centroid: { lat: -4.785, lng: 11.873 },
        createdAt: '2026-08-25T09:00:00Z'
      }
    ];

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockPerimeters;

    // Actual API call (commented out until backend is ready):
    // const response = await fetch(`${API_BASE_URL}/perimeters`);
    // if (!response.ok) throw new Error('Failed to fetch perimeters');
    // return response.json();
  }

  async getPerimeterById(id: string): Promise<Perimeter> {
    const perimeters = await this.getPerimeters();
    const perimeter = perimeters.find(p => p.id === id);
    if (!perimeter) throw new Error('Perimeter not found');
    return perimeter;
  }

  async createPerimeter(data: CreatePerimeterRequest): Promise<Perimeter> {
    // Mock implementation
    const newPerimeter: Perimeter = {
      id: `PER-${Date.now().toString().slice(-3)}`,
      ...data,
      status: 'nouveau',
      reportCount: data.reportIds.length,
      createdAt: new Date().toISOString()
    };

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return newPerimeter;

    // Actual API call:
    // const response = await fetch(`${API_BASE_URL}/perimeters`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // });
    // if (!response.ok) throw new Error('Failed to create perimeter');
    // return response.json();
  }

  async updatePerimeter(id: string, data: UpdatePerimeterRequest): Promise<Perimeter> {
    // Mock implementation
    const perimeters = await this.getPerimeters();
    const index = perimeters.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Perimeter not found');

    const updated = { ...perimeters[index], ...data, updatedAt: new Date().toISOString() };
    await new Promise(resolve => setTimeout(resolve, 300));
    return updated;

    // Actual API call:
    // const response = await fetch(`${API_BASE_URL}/perimeters/${id}`, {
    //   method: 'PATCH',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // });
    // if (!response.ok) throw new Error('Failed to update perimeter');
    // return response.json();
  }

  async deletePerimeter(id: string): Promise<void> {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 300));

    // Actual API call:
    // const response = await fetch(`${API_BASE_URL}/perimeters/${id}`, {
    //   method: 'DELETE'
    // });
    // if (!response.ok) throw new Error('Failed to delete perimeter');
  }

  async resolvePerimeter(id: string, collectedTons: number): Promise<Perimeter> {
    return this.updatePerimeter(id, { status: 'resolu', wasteTons: collectedTons });
  }
}

export const perimeterService = new PerimeterService();
