import { API_BASE_URL } from '../config/api';
import { stockageService } from './stockageService';
import { ecoshopService } from './ecoshopService';

export interface Mission {
  id: string;
  perimeterId: string;
  zone: string;
  title: string;
  description: string;
  priority: 'basse' | 'moyenne' | 'haute' | 'critique';
  status: 'planifiee' | 'en_cours' | 'terminee' | 'annulee';
  plannedDate: string;
  startDate?: string;
  endDate?: string;
  teamId: string;
  teamName: string;
  leaderId: string;
  leaderName: string;
  members: string[]; // member IDs
  materials: string[];
  estimatedTons: number;
  actualTons?: number;
  beforePhoto?: string;
  afterPhoto?: string;
  citizenCallId?: string; // if citizen call is associated
  wasteTypes: string[];
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateMission {
  perimeterId: string;
  zone: string;
  title: string;
  description: string;
  priority: Mission['priority'];
  plannedDate: string;
  teamId: string;
  materials: string[];
  estimatedTons: number;
  wasteTypes: string[];
  citizenCallId?: string;
  notes?: string;
}

export interface UpdateMission {
  status?: Mission['status'];
  startDate?: string;
  endDate?: string;
  afterPhoto?: string;
  actualTons?: number;
  notes?: string;
}

class MissionService {
  async getMissions(): Promise<Mission[]> {
    // Mock implementation
    const mockMissions: Mission[] = [
      {
        id: 'MIS-001',
        perimeterId: 'PER-001',
        zone: 'Ngambio',
        title: 'Nettoyage plage Ngambio',
        description: 'Collecte des déchets plastiques sur la plage de Ngambio',
        priority: 'haute',
        status: 'en_cours',
        plannedDate: '2026-09-20',
        startDate: '2026-09-20T08:00:00Z',
        teamId: 'TEAM-001',
        teamName: 'Équipe Alpha - Ngambio',
        leaderId: 'TM-001',
        leaderName: 'Jean Kouassi',
        members: ['TM-001', 'TM-003', 'TM-004', 'TM-005'],
        materials: ['sacs', 'gants', 'camion'],
        estimatedTons: 3.5,
        wasteTypes: ['plastiques', 'menagers'],
        beforePhoto: '/091ac480-3406-4ca0-af91-85559655c127.jpg',
        createdAt: '2026-09-18T10:00:00Z'
      },
      {
        id: 'MIS-002',
        perimeterId: 'PER-002',
        zone: 'Littoral Sud',
        title: 'Collecte filets de pêche',
        description: 'Retrait des filets de pêche abandonnés',
        priority: 'critique',
        status: 'planifiee',
        plannedDate: '2026-09-25',
        teamId: 'TEAM-002',
        teamName: 'Équipe Beta - Littoral Sud',
        leaderId: 'TM-002',
        leaderName: 'Marie Malonga',
        members: ['TM-002'],
        materials: ['sacs', 'gants', 'ciseaux'],
        estimatedTons: 2.0,
        wasteTypes: ['filets'],
        createdAt: '2026-09-19T14:00:00Z'
      },
      {
        id: 'MIS-003',
        perimeterId: 'PER-003',
        zone: 'Tchimbamba',
        title: 'Curage canal Tchimbamba',
        description: 'Nettoyage du canal avec participation citoyenne',
        priority: 'moyenne',
        status: 'terminee',
        plannedDate: '2026-09-15',
        startDate: '2026-09-15T09:00:00Z',
        endDate: '2026-09-15T13:00:00Z',
        teamId: 'TEAM-001',
        teamName: 'Équipe Alpha - Ngambio',
        leaderId: 'TM-001',
        leaderName: 'Jean Kouassi',
        members: ['TM-001', 'TM-003', 'TM-005'],
        materials: ['sacs', 'gants', 'pelles'],
        estimatedTons: 2.5,
        actualTons: 2.8,
        wasteTypes: ['menagers'],
        beforePhoto: '/091ac480-3406-4ca0-af91-85559655c127.jpg',
        afterPhoto: '/091ac480-3406-4ca0-af91-85559655c127.jpg',
        citizenCallId: 'CALL-001',
        createdAt: '2026-09-10T09:00:00Z'
      }
    ];

    await new Promise(resolve => setTimeout(resolve, 300));
    return mockMissions;
  }

  async getMissionById(id: string): Promise<Mission> {
    const missions = await this.getMissions();
    const mission = missions.find(m => m.id === id);
    if (!mission) throw new Error('Mission not found');
    return mission;
  }

  async createMission(data: CreateMission): Promise<Mission> {
    // In a real implementation, we would fetch team details here
    // For now, we'll use placeholder values
    const newMission: Mission = {
      id: `MIS-${Date.now().toString().slice(-3)}`,
      ...data,
      status: 'planifiee',
      teamName: 'Équipe à définir',
      leaderId: 'TM-000',
      leaderName: 'Responsable à définir',
      members: [],
      beforePhoto: undefined,
      afterPhoto: undefined,
      actualTons: undefined,
      createdAt: new Date().toISOString()
    };

    await new Promise(resolve => setTimeout(resolve, 300));
    return newMission;
  }

  async updateMission(id: string, data: UpdateMission): Promise<Mission> {
    const missions = await this.getMissions();
    const index = missions.findIndex(m => m.id === id);
    if (index === -1) throw new Error('Mission not found');

    const updated = { ...missions[index], ...data, updatedAt: new Date().toISOString() };
    await new Promise(resolve => setTimeout(resolve, 300));
    return updated;
  }

  async startMission(id: string): Promise<Mission> {
    return this.updateMission(id, { status: 'en_cours', startDate: new Date().toISOString() });
  }

  async completeMission(id: string, afterPhoto: string, actualTons: number): Promise<Mission> {
    const mission = await this.updateMission(id, {
      status: 'terminee',
      afterPhoto,
      actualTons,
      endDate: new Date().toISOString()
    });

    // Automatic workflow: create stock entry and ECOSHOP lot
    try {
      // Create stock entry
      const stockEntry = await stockageService.createStockEntry({
        collecteOperationId: id,
        wasteType: mission.wasteTypes[0] || 'plastiques',
        quantityTons: actualTons,
        quality: 'moyenne',
        location: 'Entrepôt Pointe-Noire - Zone A',
        notes: `Mission ${id} - ${mission.zone}`
      });

      // Create ECOSHOP lot (using correct LotData interface)
      const lot = await ecoshopService.createLot({
        categorie: mission.wasteTypes[0] || 'plastiques',
        quantiteKg: actualTons * 1000, // Convert tons to kg
        qualite: 'trie',
        prixUnitaire: 150 // FCFA/kg
      });

      console.log(`Workflow automatique: Mission ${id} → Stock ${stockEntry.id} → Lot ${lot.id}`);
    } catch (error) {
      console.error('Erreur lors du workflow automatique:', error);
      // Continue even if workflow fails - mission is still completed
    }

    return mission;
  }

  async cancelMission(id: string): Promise<Mission> {
    return this.updateMission(id, { status: 'annulee' });
  }

  async deleteMission(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  async getMissionsByStatus(status: Mission['status']): Promise<Mission[]> {
    const missions = await this.getMissions();
    return missions.filter(m => m.status === status);
  }

  async getMissionsByTeam(teamId: string): Promise<Mission[]> {
    const missions = await this.getMissions();
    return missions.filter(m => m.teamId === teamId);
  }

  async getMissionsByZone(zone: string): Promise<Mission[]> {
    const missions = await this.getMissions();
    return missions.filter(m => m.zone === zone);
  }

  async getMissionStats(): Promise<{
    total: number;
    planifiee: number;
    en_cours: number;
    terminee: number;
    totalTonsCollected: number;
    avgTonsPerMission: number;
  }> {
    const missions = await this.getMissions();
    const completed = missions.filter(m => m.status === 'terminee' && m.actualTons);
    const totalTonsCollected = completed.reduce((sum, m) => sum + (m.actualTons || 0), 0);

    return {
      total: missions.length,
      planifiee: missions.filter(m => m.status === 'planifiee').length,
      en_cours: missions.filter(m => m.status === 'en_cours').length,
      terminee: missions.filter(m => m.status === 'terminee').length,
      totalTonsCollected,
      avgTonsPerMission: completed.length > 0 ? totalTonsCollected / completed.length : 0
    };
  }
}

export const missionService = new MissionService();
