import { useState, useEffect } from 'react';
import { teamService, type TeamMember, type Team, type CreateTeamMember, type CreateTeam } from '../services/teamService';

export function useTeams() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [membersData, teamsData] = await Promise.all([
        teamService.getTeamMembers(),
        teamService.getTeams()
      ]);
      setMembers(membersData);
      setTeams(teamsData);
    } catch (err) {
      setError('Failed to fetch team data');
      console.error('Error fetching team data:', err);
    } finally {
      setLoading(false);
    }
  };

  const createMember = async (data: CreateTeamMember): Promise<TeamMember> => {
    try {
      const newMember = await teamService.createTeamMember(data);
      setMembers(prev => [...prev, newMember]);
      return newMember;
    } catch (err) {
      console.error('Error creating team member:', err);
      throw err;
    }
  };

  const createTeam = async (data: CreateTeam): Promise<Team> => {
    try {
      const newTeam = await teamService.createTeam(data);
      setTeams(prev => [...prev, newTeam]);
      return newTeam;
    } catch (err) {
      console.error('Error creating team:', err);
      throw err;
    }
  };

  const updateMemberStatus = async (id: string, status: TeamMember['status']): Promise<TeamMember> => {
    try {
      const updated = await teamService.updateTeamMemberStatus(id, status);
      setMembers(prev => prev.map(m => m.id === id ? updated : m));
      return updated;
    } catch (err) {
      console.error('Error updating member status:', err);
      throw err;
    }
  };

  const assignToTeam = async (memberId: string, teamId: string): Promise<TeamMember> => {
    try {
      const updated = await teamService.assignToTeam(memberId, teamId);
      setMembers(prev => prev.map(m => m.id === memberId ? updated : m));
      return updated;
    } catch (err) {
      console.error('Error assigning to team:', err);
      throw err;
    }
  };

  const assignToZone = async (memberId: string, zone: string): Promise<TeamMember> => {
    try {
      const updated = await teamService.assignToZone(memberId, zone);
      setMembers(prev => prev.map(m => m.id === memberId ? updated : m));
      return updated;
    } catch (err) {
      console.error('Error assigning to zone:', err);
      throw err;
    }
  };

  const updateMissionStats = async (memberId: string, tonsCollected: number): Promise<TeamMember> => {
    try {
      const updated = await teamService.updateMissionStats(memberId, tonsCollected);
      setMembers(prev => prev.map(m => m.id === memberId ? updated : m));
      return updated;
    } catch (err) {
      console.error('Error updating mission stats:', err);
      throw err;
    }
  };

  const getAvailableMembers = async (zone?: string): Promise<TeamMember[]> => {
    try {
      return await teamService.getAvailableMembers(zone);
    } catch (err) {
      console.error('Error fetching available members:', err);
      throw err;
    }
  };

  const getTeamPerformance = async (teamId: string) => {
    try {
      return await teamService.getTeamPerformance(teamId);
    } catch (err) {
      console.error('Error fetching team performance:', err);
      throw err;
    }
  };

  const getMemberById = (id: string): TeamMember | undefined => {
    return members.find(m => m.id === id);
  };

  const getTeamById = (id: string): Team | undefined => {
    return teams.find(t => t.id === id);
  };

  const getMembersByTeam = (teamId: string): TeamMember[] => {
    return members.filter(m => m.teamId === teamId);
  };

  const getMembersByZone = (zone: string): TeamMember[] => {
    return members.filter(m => m.assignedZone === zone);
  };

  return {
    members,
    teams,
    loading,
    error,
    fetchData,
    createMember,
    createTeam,
    updateMemberStatus,
    assignToTeam,
    assignToZone,
    updateMissionStats,
    getAvailableMembers,
    getTeamPerformance,
    getMemberById,
    getTeamById,
    getMembersByTeam,
    getMembersByZone
  };
}
