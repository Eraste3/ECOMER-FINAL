import api from './api';
import { API_ENDPOINTS } from '../config/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCitoyenData {
  nom: string;
  email: string;
  password: string;
  telephone?: string;
}

export interface RegisterRecycleurData {
  nom: string;
  email: string;
  password: string;
  entreprise: string;
  typesMateriaux: string[];
  telephone?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    nom: string;
    email: string;
    role: string;
  };
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post(API_ENDPOINTS.auth.login, credentials);
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    return response.data;
  },

  async registerCitoyen(data: RegisterCitoyenData): Promise<AuthResponse> {
    const response = await api.post(API_ENDPOINTS.auth.registerCitoyen, data);
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    return response.data;
  },

  async registerRecycleur(data: RegisterRecycleurData): Promise<AuthResponse> {
    const response = await api.post(API_ENDPOINTS.auth.registerRecycleur, data);
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  getUser(): any | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
