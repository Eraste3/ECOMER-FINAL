export interface MunicipalTeam {
  id: string;
  name: string;
  lead: string;
  agents: number;
}

export const municipalTeams: MunicipalTeam[] = [
  { id: 'MUN-01', name: 'Voirie Ngambio', lead: 'Albert Mabiala', agents: 12 },
  { id: 'MUN-02', name: 'Voirie Mvou-Mvou', lead: 'Clarisse Okemba', agents: 10 },
  { id: 'MUN-03', name: 'Voirie Centre-ville', lead: 'Dieudonné Ngoma', agents: 15 },
  { id: 'MUN-04', name: 'Voirie Tié-Tié', lead: 'Rachelle Bantsimba', agents: 9 },
  { id: 'MUN-05', name: 'Voirie Loandjili', lead: 'Simon Loussala', agents: 11 },
  { id: 'MUN-06', name: 'Voirie Côte Sauvage', lead: 'Marthe Ibouanga', agents: 8 }
];