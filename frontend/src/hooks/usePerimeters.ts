import { useState, useEffect } from 'react';
import { perimeterService, type Perimeter, type CreatePerimeterRequest, type UpdatePerimeterRequest } from '../services/perimeterService';

export function usePerimeters() {
  const [perimeters, setPerimeters] = useState<Perimeter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPerimeters();
  }, []);

  const fetchPerimeters = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await perimeterService.getPerimeters();
      setPerimeters(data);
    } catch (err) {
      setError('Failed to fetch perimeters');
      console.error('Error fetching perimeters:', err);
    } finally {
      setLoading(false);
    }
  };

  const createPerimeter = async (data: CreatePerimeterRequest): Promise<Perimeter> => {
    try {
      const newPerimeter = await perimeterService.createPerimeter(data);
      setPerimeters(prev => [...prev, newPerimeter]);
      return newPerimeter;
    } catch (err) {
      console.error('Error creating perimeter:', err);
      throw err;
    }
  };

  const updatePerimeter = async (id: string, data: UpdatePerimeterRequest): Promise<Perimeter> => {
    try {
      const updated = await perimeterService.updatePerimeter(id, data);
      setPerimeters(prev => prev.map(p => p.id === id ? updated : p));
      return updated;
    } catch (err) {
      console.error('Error updating perimeter:', err);
      throw err;
    }
  };

  const resolvePerimeter = async (id: string, collectedTons: number): Promise<Perimeter> => {
    try {
      const resolved = await perimeterService.resolvePerimeter(id, collectedTons);
      setPerimeters(prev => prev.map(p => p.id === id ? resolved : p));
      return resolved;
    } catch (err) {
      console.error('Error resolving perimeter:', err);
      throw err;
    }
  };

  const deletePerimeter = async (id: string): Promise<void> => {
    try {
      await perimeterService.deletePerimeter(id);
      setPerimeters(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error deleting perimeter:', err);
      throw err;
    }
  };

  const getPerimeterById = (id: string): Perimeter | undefined => {
    return perimeters.find(p => p.id === id);
  };

  return {
    perimeters,
    loading,
    error,
    fetchPerimeters,
    createPerimeter,
    updatePerimeter,
    resolvePerimeter,
    deletePerimeter,
    getPerimeterById
  };
}
