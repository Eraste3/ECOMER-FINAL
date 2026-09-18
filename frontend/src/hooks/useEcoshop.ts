import { useState, useCallback } from 'react';
import { ecoshopService, LotData, CommandeData } from '../services/ecoshopService';

export function useEcoshop() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getLots = useCallback(async (page?: number, limit?: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await ecoshopService.getLots(page, limit);
      setLoading(false);
      return result;
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.detail || 'Erreur lors de la récupération des lots');
      throw err;
    }
  }, []);

  const createLot = useCallback(async (data: LotData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await ecoshopService.createLot(data);
      setLoading(false);
      return result;
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.detail || 'Erreur lors de la création du lot');
      throw err;
    }
  }, []);

  const getCommandes = useCallback(async (page?: number, limit?: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await ecoshopService.getCommandes(page, limit);
      setLoading(false);
      return result;
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.detail || 'Erreur lors de la récupération des commandes');
      throw err;
    }
  }, []);

  const createCommande = useCallback(async (data: CommandeData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await ecoshopService.createCommande(data);
      setLoading(false);
      return result;
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.detail || 'Erreur lors de la création de la commande');
      throw err;
    }
  }, []);

  return {
    getLots,
    createLot,
    getCommandes,
    createCommande,
    loading,
    error,
  };
}
