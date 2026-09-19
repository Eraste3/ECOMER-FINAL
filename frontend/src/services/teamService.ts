import { API_BASE_URL } from '../config/api';

export interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  role: 'agent' | 'responsable' | 'chauffeur';
  phone: string;
  email?: string;
  status: 'actif' | 'inactif' | 'en_mission';
  teamId?: string;
  assignedZone?: string;
  hireDate: string;
  totalMissions: number;
  totalTonsCollected: number;
  ecoPoints?: number;
}

export interface Team {
  id: string;
  name: string;
  leaderId: string;
  leaderName: string;
  members: string[]; // member IDs
  zone?: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface CreateTeamMember {
  firstName: string;
  lastName: string;
  role: TeamMember['role'];
  phone: string;
  email?: string;
  teamId?: string;
}

export interface CreateTeam {
  name: string;
  leaderId: string;
  members: string[];
  zone?: string;
}

class TeamService {
  async getTeamMembers(): Promise<TeamMember[]> {
    // Mock implementation
    const mockMembers: TeamMember[] = [
      {
        id: 'TM-001',
        firstName: 'Jean',
        lastName: 'Kouassi',
        role: 'responsable',
        phone: '+242055123456',
        email: 'jean.kouassi@ecomer.cg',
        status: 'actif',
        teamId: 'TEAM-001',
        assignedZone: 'Ngambio',
        hireDate: '2026-01-15',
        totalMissions: 45,
        totalTonsCollected: 127.5,
        ecoPoints: 1250
      },
      {
        id: 'TM-002',
        firstName: 'Marie',
        lastName: 'Malonga',
        role: 'responsable',
        phone: '+242055234567',
        email: 'marie.malonga@ecomer.cg',
        status: 'actif',
        teamId: 'TEAM-002',
        assignedZone: 'Littoral Sud',
        hireDate: '2026-02-01',
        totalMissions: 38,
        totalTonsCollected: 98.3,
        ecoPoints: 980
      },
      {
        id: 'TM-003',
        firstName: 'Paul',
        lastName: 'Mboussi',
        role: 'agent',
        phone: '+242055345678',
        status: 'actif',
        teamId: 'TEAM-001',
        assignedZone: 'Ngambio',
        hireDate: '2026-03-10',
        totalMissions: 32,
        totalTonsCollected: 85.2,
        ecoPoints: 850
      },
      {
        id: 'TM-004',
        firstName: 'François',
        lastName: 'Nzouzi',
        role: 'agent',
        phone: '+242055456789',
        status: 'en_mission',
        teamId: 'TEAM-001',
        assignedZone: 'Ngambio',
        hireDate: '2026-04-05',
        totalMissions: 28,
        totalTonsCollected: 72.8,
        ecoPoints: 720
      },
      {
        id: 'TM-005',
        firstName: 'Antoine',
        lastName: 'Mouanga',
        role: 'chauffeur',
        phone: '+242055567890',
        status: 'actif',
        teamId: 'TEAM-001',
        assignedZone: 'Ngambio',
        hireDate: '2026-03-15',
        totalMissions: 40,
        totalTonsCollected: 110.5,
        ecoPoints: 1100
      }
    ];

    await new Promise(resolve => setTimeout(resolve, 300));
    return mockMembers;
  }

  async getTeams(): Promise<Team[]> {
    const mockTeams: Team[] = [
      {
        id: 'TEAM-001',
        name: 'Équipe Alpha - Ngambio',
        leaderId: 'TM-001',
        leaderName: 'Jean Kouassi',
        members: ['TM-001', 'TM-003', 'TM-004', 'TM-005'],
        zone: 'Ngambio',
        status: 'active',
        createdAt: '2026-01-15T10:00:00Z'
      },
      {
        id: 'TEAM-002',
        name: 'Équipe Beta - Littoral Sud',
        leaderId: 'TM-002',
        leaderName: 'Marie Malonga',
        members: ['TM-002'],
        zone: 'Littoral Sud',
        status: 'active',
        createdAt: '2026-02-01T14:00:00Z'
      }
    ];

    await new Promise(resolve => setTimeout(resolve, 300));
    return mockTeams;
  }

  async getTeamMemberById(id: string): Promise<TeamMember> {
    const members = await this.getTeamMembers();
    const member = members.find(m => m.id === id);
    if (!member) throw new Error('Team member not found');
    return member;
  }

  async getTeamById(id: string): Promise<Team> {
    const teams = await this.getTeams();
    const team = teams.find(t => t.id === id);
    if (!team) throw new Error('Team not found');
    return team;
  }

  async createTeamMember(data: CreateTeamMember): Promise<TeamMember> {
    const newMember: TeamMember = {
      id: `TM-${Date.now().toString().slice(-3)}`,
      ...data,
      status: 'actif',
      hireDate: new Date().toISOString().split('T')[0],
      totalMissions: 0,
      totalTonsCollected: 0,
      ecoPoints: 0
    };

    await new Promise(resolve => setTimeout(resolve, 300));
    return newMember;
  }

  async createTeam(data: CreateTeam): Promise<Team> {
    const leader = await this.getTeamMemberById(data.leaderId);
    const newTeam: Team = {
      id: `TEAM-${Date.now().toString().slice(-3)}`,
      ...data,
      leaderName: `${leader.firstName} ${leader.lastName}`,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    await new Promise(resolve => setTimeout(resolve, 300));
    return newTeam;
  }

  async updateTeamMemberStatus(id: string, status: TeamMember['status']): Promise<TeamMember> {
    const member = await this.getTeamMemberById(id);
    member.status = status;
    await new Promise(resolve => setTimeout(resolve, 300));
    return member;
  }

  async assignToTeam(memberId: string, teamId: string): Promise<TeamMember> {
    const member = await this.getTeamMemberById(memberId);
    member.teamId = teamId;
    await new Promise(resolve => setTimeout(resolve, 300));
    return member;
  }

  async assignToZone(memberId: string, zone: string): Promise<TeamMember> {
    const member = await this.getTeamMemberById(memberId);
    member.assignedZone = zone;
    await new Promise(resolve => setTimeout(resolve, 300));
    return member;
  }

  async updateMissionStats(memberId: string, tonsCollected: number): Promise<TeamMember> {
    const member = await this.getTeamMemberById(memberId);
    member.totalMissions += 1;
    member.totalTonsCollected += tonsCollected;
    member.ecoPoints = (member.ecoPoints || 0) + Math.round(tonsCollected * 10);
    await new Promise(resolve => setTimeout(resolve, 300));
    return member;
  }

  async getAvailableMembers(zone?: string): Promise<TeamMember[]> {
    const members = await this.getTeamMembers();
    return members.filter(m => 
      m.status === 'actif' && 
      (zone ? m.assignedZone === zone : true)
    );
  }

  async getTeamPerformance(teamId: string): Promise<{
    totalMissions: number;
    totalTons: number;
    avgTonsPerMission: number;
    activeMembers: number;
  }> {
    const teams = await this.getTeams();
    const team = teams.find(t => t.id === teamId);
    if (!team) throw new Error('Team not found');

    const members = await this.getTeamMembers();
    const teamMembers = members.filter(m => team.members.includes(m.id));

    const totalMissions = teamMembers.reduce((sum, m) => sum + m.totalMissions, 0);
    const totalTons = teamMembers.reduce((sum, m) => sum + m.totalTonsCollected, 0);
    const activeMembers = teamMembers.filter(m => m.status === 'actif').length;

    return {
      totalMissions,
      totalTons,
      avgTonsPerMission: totalMissions > 0 ? totalTons / totalMissions : 0,
      activeMembers
    };
  }
}

export const teamService = new TeamService();
