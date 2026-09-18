import { useState, useCallback } from 'react';
import { authService, LoginCredentials, RegisterCitoyenData, RegisterRecycleurData } from '../services/authService';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authService.login(credentials);
      setLoading(false);
      return result;
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.detail || 'Erreur de connexion');
      throw err;
    }
  }, []);

  const registerCitoyen = useCallback(async (data: RegisterCitoyenData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authService.registerCitoyen(data);
      setLoading(false);
      return result;
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.detail || 'Erreur d\'inscription');
      throw err;
    }
  }, []);

  const registerRecycleur = useCallback(async (data: RegisterRecycleurData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authService.registerRecycleur(data);
      setLoading(false);
      return result;
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.detail || 'Erreur d\'inscription');
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
  }, []);

  return {
    login,
    registerCitoyen,
    registerRecycleur,
    logout,
    loading,
    error,
    isAuthenticated: authService.isAuthenticated(),
    user: authService.getUser(),
  };
}
