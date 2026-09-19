import { API_BASE_URL } from '../config/api';

export interface StockEntry {
  id: string;
  collecteOperationId: string;
  wasteType: string;
  quantityTons: number;
  quality: 'faible' | 'moyenne' | 'haute';
  location: string;
  storageDate: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateStockEntry {
  collecteOperationId: string;
  wasteType: string;
  quantityTons: number;
  quality: StockEntry['quality'];
  location: string;
  notes?: string;
}

export interface UpdateStockEntry {
  quantityTons?: number;
  quality?: StockEntry['quality'];
  location?: string;
  notes?: string;
}

class StockageService {
  async getStockEntries(): Promise<StockEntry[]> {
    // Mock implementation
    const mockEntries: StockEntry[] = [
      {
        id: 'STK-001',
        collecteOperationId: 'COL-001',
        wasteType: 'plastiques',
        quantityTons: 2.5,
        quality: 'haute',
        location: 'Entrepôt Pointe-Noire - Zone A',
        storageDate: '2026-09-10',
        notes: 'Plastiques PET triés et lavés',
        createdAt: '2026-09-10T18:00:00Z'
      },
      {
        id: 'STK-002',
        collecteOperationId: 'COL-003',
        wasteType: 'menagers',
        quantityTons: 1.8,
        quality: 'moyenne',
        location: 'Entrepôt Pointe-Noire - Zone B',
        storageDate: '2026-09-02',
        createdAt: '2026-09-02T17:30:00Z'
      },
      {
        id: 'STK-003',
        collecteOperationId: 'COL-002',
        wasteType: 'filets',
        quantityTons: 0.8,
        quality: 'haute',
        location: 'Entrepôt Pointe-Noire - Zone A',
        storageDate: '2026-09-15',
        notes: 'Filets de pêche recyclables',
        createdAt: '2026-09-15T16:00:00Z'
      }
    ];

    await new Promise(resolve => setTimeout(resolve, 300));
    return mockEntries;
  }

  async getStockEntryById(id: string): Promise<StockEntry> {
    const entries = await this.getStockEntries();
    const entry = entries.find(e => e.id === id);
    if (!entry) throw new Error('Stock entry not found');
    return entry;
  }

  async createStockEntry(data: CreateStockEntry): Promise<StockEntry> {
    const newEntry: StockEntry = {
      id: `STK-${Date.now().toString().slice(-3)}`,
      ...data,
      storageDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };

    await new Promise(resolve => setTimeout(resolve, 300));
    return newEntry;
  }

  async updateStockEntry(id: string, data: UpdateStockEntry): Promise<StockEntry> {
    const entries = await this.getStockEntries();
    const index = entries.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Stock entry not found');

    const updated = { ...entries[index], ...data, updatedAt: new Date().toISOString() };
    await new Promise(resolve => setTimeout(resolve, 300));
    return updated;
  }

  async deleteStockEntry(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  async getStockByWasteType(wasteType: string): Promise<StockEntry[]> {
    const entries = await this.getStockEntries();
    return entries.filter(e => e.wasteType === wasteType);
  }

  async getTotalStockByWasteType(): Promise<Record<string, number>> {
    const entries = await this.getStockEntries();
    const totals: Record<string, number> = {};
    
    entries.forEach(entry => {
      if (!totals[entry.wasteType]) {
        totals[entry.wasteType] = 0;
      }
      totals[entry.wasteType] += entry.quantityTons;
    });

    return totals;
  }
}

export const stockageService = new StockageService();
