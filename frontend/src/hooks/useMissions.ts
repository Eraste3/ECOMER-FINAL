import { useState, useEffect } from 'react';
import { missionService, type Mission, type CreateMission, type UpdateMission } from '../services/missionService';

export function useMissions() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMissions();
  }, []);

  const fetchMissions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await missionService.getMissions();
      setMissions(data);
    } catch (err) {
      setError('Failed to fetch missions');
      console.error('Error fetching missions:', err);
    } finally {
      setLoading(false);
    }
  };

  const createMission = async (data: CreateMission): Promise<Mission> => {
    try {
      const newMission = await missionService.createMission(data);
      setMissions(prev => [...prev, newMission]);
      return newMission;
    } catch (err) {
      console.error('Error creating mission:', err);
      throw err;
    }
  };

  const updateMission = async (id: string, data: UpdateMission): Promise<Mission> => {
    try {
      const updated = await missionService.updateMission(id, data);
      setMissions(prev => prev.map(m => m.id === id ? updated : m));
      return updated;
    } catch (err) {
      console.error('Error updating mission:', err);
      throw err;
    }
  };

  const startMission = async (id: string): Promise<Mission> => {
    try {
      const updated = await missionService.startMission(id);
      setMissions(prev => prev.map(m => m.id === id ? updated : m));
      return updated;
    } catch (err) {
      console.error('Error starting mission:', err);
      throw err;
    }
  };

  const completeMission = async (id: string, afterPhoto: string, actualTons: number): Promise<Mission> => {
    try {
      const updated = await missionService.completeMission(id, afterPhoto, actualTons);
      setMissions(prev => prev.map(m => m.id === id ? updated : m));
      return updated;
    } catch (err) {
      console.error('Error completing mission:', err);
      throw err;
    }
  };

  const cancelMission = async (id: string): Promise<Mission> => {
    try {
      const updated = await missionService.cancelMission(id);
      setMissions(prev => prev.map(m => m.id === id ? updated : m));
      return updated;
    } catch (err) {
      console.error('Error cancelling mission:', err);
      throw err;
    }
  };

  const deleteMission = async (id: string): Promise<void> => {
    try {
      await missionService.deleteMission(id);
      setMissions(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      console.error('Error deleting mission:', err);
      throw err;
    }
  };

  const getMissionsByStatus = async (status: Mission['status']): Promise<Mission[]> => {
    try {
      return await missionService.getMissionsByStatus(status);
    } catch (err) {
      console.error('Error fetching missions by status:', err);
      throw err;
    }
  };

  const getMissionsByTeam = async (teamId: string): Promise<Mission[]> => {
    try {
      return await missionService.getMissionsByTeam(teamId);
    } catch (err) {
      console.error('Error fetching missions by team:', err);
      throw err;
    }
  };

  const getMissionsByZone = async (zone: string): Promise<Mission[]> => {
    try {
      return await missionService.getMissionsByZone(zone);
    } catch (err) {
      console.error('Error fetching missions by zone:', err);
      throw err;
    }
  };

  const getMissionStats = async () => {
    try {
      return await missionService.getMissionStats();
    } catch (err) {
      console.error('Error fetching mission stats:', err);
      throw err;
    }
  };

  const getMissionById = (id: string): Mission | undefined => {
    return missions.find(m => m.id === id);
  };

  return {
    missions,
    loading,
    error,
    fetchMissions,
    createMission,
    updateMission,
    startMission,
    completeMission,
    cancelMission,
    deleteMission,
    getMissionsByStatus,
    getMissionsByTeam,
    getMissionsByZone,
    getMissionStats,
    getMissionById
  };
}
