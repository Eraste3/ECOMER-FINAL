export interface LeaderboardEntry {
  rank: number;
  name: string;
  zone: string;
  points: number;
  isCurrentUser?: boolean;
}

export const leaderboard: LeaderboardEntry[] = [
  { rank: 1, name: 'Marie Kouassi', zone: 'Ngambio', points: 850, isCurrentUser: false },
  { rank: 2, name: 'Jean-Pierre Mvouba', zone: 'Tié-Tié', points: 720, isCurrentUser: false },
  { rank: 3, name: 'François Ntsoumi', zone: 'Centre-ville', points: 680, isCurrentUser: false },
  { rank: 4, name: 'Vous', zone: 'Loandjili', points: 340, isCurrentUser: true },
  { rank: 5, name: 'Céline Malonga', zone: 'Mvou-Mvou', points: 450, isCurrentUser: false },
  { rank: 6, name: 'Paul Mboussi', zone: 'Baie de Loango', points: 380, isCurrentUser: false },
  { rank: 7, name: 'Aline Nkouka', zone: 'Ngambio', points: 320, isCurrentUser: false },
  { rank: 8, name: 'Marc Moukoko', zone: 'Lumumba', points: 280, isCurrentUser: false },
  { rank: 9, name: 'Josiane Bissiela', zone: 'Mongo-Mpoukou', points: 220, isCurrentUser: false },
  { rank: 10, name: 'Christian Makaya', zone: 'Côte Sauvage', points: 180, isCurrentUser: false }
];