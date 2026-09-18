import { useState, useCallback } from 'react';
import { signalementService, SignalementData } from '../services/signalementService';

export function useSignalements() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSignalement = useCallback(async (data: SignalementData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await signalementService.create(data);
      setLoading(false);
      return result;
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.detail || 'Erreur lors de la création du signalement');
      throw err;
    }
  }, []);

  const getMyReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await signalementService.getMyReports();
      setLoading(false);
      return result;
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.detail || 'Erreur lors de la récupération des signalements');
      throw err;
    }
  }, []);

  const getAllSignalements = useCallback(async (page?: number, limit?: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await signalementService.getAll(page, limit);
      setLoading(false);
      return result;
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.detail || 'Erreur lors de la récupération des signalements');
      throw err;
    }
  }, []);

  const validateSignalement = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await signalementService.validate(id);
      setLoading(false);
      return result;
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.detail || 'Erreur lors de la validation du signalement');
      throw err;
    }
  }, []);

  return {
    createSignalement,
    getMyReports,
    getAllSignalements,
    validateSignalement,
    loading,
    error,
  };
}
