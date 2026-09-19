import { useState, useEffect } from 'react';
import { interventionService, type Intervention, type CreateInterventionRequest, type UpdateInterventionRequest } from '../services/interventionService';

export function useInterventions() {
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInterventions();
  }, []);

  const fetchInterventions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await interventionService.getInterventions();
      setInterventions(data);
    } catch (err) {
      setError('Failed to fetch interventions');
      console.error('Error fetching interventions:', err);
    } finally {
      setLoading(false);
    }
  };

  const createIntervention = async (data: CreateInterventionRequest): Promise<Intervention> => {
    try {
      const newIntervention = await interventionService.createIntervention(data);
      setInterventions(prev => [...prev, newIntervention]);
      return newIntervention;
    } catch (err) {
      console.error('Error creating intervention:', err);
      throw err;
    }
  };

  const updateIntervention = async (id: string, data: UpdateInterventionRequest): Promise<Intervention> => {
    try {
      const updated = await interventionService.updateIntervention(id, data);
      setInterventions(prev => prev.map(i => i.id === id ? updated : i));
      return updated;
    } catch (err) {
      console.error('Error updating intervention:', err);
      throw err;
    }
  };

  const addAfterProof = async (id: string, afterPhoto: string, collectedTons: number): Promise<Intervention> => {
    try {
      const updated = await interventionService.addAfterProof(id, afterPhoto, collectedTons);
      setInterventions(prev => prev.map(i => i.id === id ? updated : i));
      return updated;
    } catch (err) {
      console.error('Error adding after proof:', err);
      throw err;
    }
  };

  const deleteIntervention = async (id: string): Promise<void> => {
    try {
      await interventionService.deleteIntervention(id);
      setInterventions(prev => prev.filter(i => i.id !== id));
    } catch (err) {
      console.error('Error deleting intervention:', err);
      throw err;
    }
  };

  const getInterventionById = (id: string): Intervention | undefined => {
    return interventions.find(i => i.id === id);
  };

  return {
    interventions,
    loading,
    error,
    fetchInterventions,
    createIntervention,
    updateIntervention,
    addAfterProof,
    deleteIntervention,
    getInterventionById
  };
}
