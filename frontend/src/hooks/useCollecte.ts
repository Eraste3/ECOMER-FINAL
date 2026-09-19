import { useState, useEffect } from 'react';
import { collecteService, type CollecteOperation, type CreateCollecteOperation, type UpdateCollecteOperation } from '../services/collecteService';

export function useCollecte() {
  const [operations, setOperations] = useState<CollecteOperation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOperations();
  }, []);

  const fetchOperations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await collecteService.getCollecteOperations();
      setOperations(data);
    } catch (err) {
      setError('Failed to fetch collecte operations');
      console.error('Error fetching collecte operations:', err);
    } finally {
      setLoading(false);
    }
  };

  const createOperation = async (data: CreateCollecteOperation): Promise<CollecteOperation> => {
    try {
      const newOperation = await collecteService.createCollecteOperation(data);
      setOperations(prev => [...prev, newOperation]);
      return newOperation;
    } catch (err) {
      console.error('Error creating collecte operation:', err);
      throw err;
    }
  };

  const updateOperation = async (id: string, data: UpdateCollecteOperation): Promise<CollecteOperation> => {
    try {
      const updated = await collecteService.updateCollecteOperation(id, data);
      setOperations(prev => prev.map(o => o.id === id ? updated : o));
      return updated;
    } catch (err) {
      console.error('Error updating collecte operation:', err);
      throw err;
    }
  };

  const startOperation = async (id: string): Promise<CollecteOperation> => {
    try {
      const updated = await collecteService.startOperation(id);
      setOperations(prev => prev.map(o => o.id === id ? updated : o));
      return updated;
    } catch (err) {
      console.error('Error starting operation:', err);
      throw err;
    }
  };

  const completeOperation = async (id: string, afterPhoto: string, collectedTons: number): Promise<CollecteOperation> => {
    try {
      const updated = await collecteService.completeOperation(id, afterPhoto, collectedTons);
      setOperations(prev => prev.map(o => o.id === id ? updated : o));
      return updated;
    } catch (err) {
      console.error('Error completing operation:', err);
      throw err;
    }
  };

  const cancelOperation = async (id: string): Promise<CollecteOperation> => {
    try {
      const updated = await collecteService.cancelOperation(id);
      setOperations(prev => prev.map(o => o.id === id ? updated : o));
      return updated;
    } catch (err) {
      console.error('Error cancelling operation:', err);
      throw err;
    }
  };

  const deleteOperation = async (id: string): Promise<void> => {
    try {
      await collecteService.deleteCollecteOperation(id);
      setOperations(prev => prev.filter(o => o.id !== id));
    } catch (err) {
      console.error('Error deleting collecte operation:', err);
      throw err;
    }
  };

  const getOperationById = (id: string): CollecteOperation | undefined => {
    return operations.find(o => o.id === id);
  };

  return {
    operations,
    loading,
    error,
    fetchOperations,
    createOperation,
    updateOperation,
    startOperation,
    completeOperation,
    cancelOperation,
    deleteOperation,
    getOperationById
  };
}
