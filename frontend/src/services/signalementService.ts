import api from './api';
import { API_ENDPOINTS } from '../config/api';

export interface SignalementData {
  photoUrl: string;
  latitude: number;
  longitude: number;
  typeDechet?: string;
  description?: string;
  gravite?: 'faible' | 'moyenne' | 'elevee';
}

export interface Signalement {
  id: number;
  photoUrl: string;
  latitude: number;
  longitude: number;
  typeDechet?: string;
  description?: string;
  suggestionIa?: string;
  gravite?: string;
  statut: string;
  utilisateurId: number;
  zoneId?: number;
  createdAt: string;
  updatedAt: string;
}

export const signalementService = {
  async create(data: SignalementData): Promise<Signalement> {
    const response = await api.post(API_ENDPOINTS.signalements.create, data);
    return response.data;
  },

  async getAll(page?: number, limit?: number): Promise<Signalement[]> {
    const params: any = {};
    if (page) params.page = page;
    if (limit) params.limit = limit;
    const response = await api.get(API_ENDPOINTS.signalements.list, { params });
    return response.data;
  },

  async getMyReports(): Promise<Signalement[]> {
    const response = await api.get(API_ENDPOINTS.signalements.myReports);
    return response.data;
  },

  async validate(id: number): Promise<Signalement> {
    const response = await api.patch(API_ENDPOINTS.signalements.validate(id.toString()));
    return response.data;
  },
};
