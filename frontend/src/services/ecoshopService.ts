import api from './api';
import { API_ENDPOINTS } from '../config/api';

export interface LotData {
  categorie: string;
  quantiteKg: number;
  qualite: 'trie' | 'prepare' | 'rejete';
  prixUnitaire: number;
}

export interface Lot {
  id: number;
  categorie: string;
  quantiteKg: number;
  qualite: string;
  prixUnitaire: number;
  statut: string;
  createdAt: string;
}

export interface CommandeData {
  lotId: number;
  quantiteKg: number;
  typeTransaction: 'achat' | 'offre';
  montantOffre?: number;
}

export interface Commande {
  id: number;
  lotId: number;
  utilisateurId: number;
  quantiteKg: number;
  typeTransaction: string;
  montantOffre?: number;
  statut: string;
  createdAt: string;
  updatedAt: string;
}

export const ecoshopService = {
  async getLots(page?: number, limit?: number): Promise<Lot[]> {
    const params: any = {};
    if (page) params.page = page;
    if (limit) params.limit = limit;
    const response = await api.get(API_ENDPOINTS.ecoshop.lots, { params });
    return response.data;
  },

  async createLot(data: LotData): Promise<Lot> {
    const response = await api.post(API_ENDPOINTS.ecoshop.createLot, data);
    return response.data;
  },

  async getCommandes(page?: number, limit?: number): Promise<Commande[]> {
    const params: any = {};
    if (page) params.page = page;
    if (limit) params.limit = limit;
    const response = await api.get(API_ENDPOINTS.ecoshop.commandes, { params });
    return response.data;
  },

  async createCommande(data: CommandeData): Promise<Commande> {
    const response = await api.post(API_ENDPOINTS.ecoshop.createCommande, data);
    return response.data;
  },
};
