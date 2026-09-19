import { useState, useEffect } from 'react';
import { stockageService, type StockEntry, type CreateStockEntry, type UpdateStockEntry } from '../services/stockageService';

export function useStockage() {
  const [entries, setEntries] = useState<StockEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await stockageService.getStockEntries();
      setEntries(data);
    } catch (err) {
      setError('Failed to fetch stock entries');
      console.error('Error fetching stock entries:', err);
    } finally {
      setLoading(false);
    }
  };

  const createEntry = async (data: CreateStockEntry): Promise<StockEntry> => {
    try {
      const newEntry = await stockageService.createStockEntry(data);
      setEntries(prev => [...prev, newEntry]);
      return newEntry;
    } catch (err) {
      console.error('Error creating stock entry:', err);
      throw err;
    }
  };

  const updateEntry = async (id: string, data: UpdateStockEntry): Promise<StockEntry> => {
    try {
      const updated = await stockageService.updateStockEntry(id, data);
      setEntries(prev => prev.map(e => e.id === id ? updated : e));
      return updated;
    } catch (err) {
      console.error('Error updating stock entry:', err);
      throw err;
    }
  };

  const deleteEntry = async (id: string): Promise<void> => {
    try {
      await stockageService.deleteStockEntry(id);
      setEntries(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      console.error('Error deleting stock entry:', err);
      throw err;
    }
  };

  const getEntryById = (id: string): StockEntry | undefined => {
    return entries.find(e => e.id === id);
  };

  const getStockByWasteType = async (wasteType: string): Promise<StockEntry[]> => {
    try {
      return await stockageService.getStockByWasteType(wasteType);
    } catch (err) {
      console.error('Error fetching stock by waste type:', err);
      throw err;
    }
  };

  const getTotalStockByWasteType = async (): Promise<Record<string, number>> => {
    try {
      return await stockageService.getTotalStockByWasteType();
    } catch (err) {
      console.error('Error fetching total stock by waste type:', err);
      throw err;
    }
  };

  return {
    entries,
    loading,
    error,
    fetchEntries,
    createEntry,
    updateEntry,
    deleteEntry,
    getEntryById,
    getStockByWasteType,
    getTotalStockByWasteType
  };
}
