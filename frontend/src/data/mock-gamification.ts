import type { Badge, LeaderboardEntry, PointHistoryEntry } from '../types';

export const badges: Badge[] = [
{ id: 'b1', label: 'Éclaireur', threshold: 0, description: 'Premier signalement transmis' },
{ id: 'b2', label: 'Sentinelle', threshold: 100, description: '10 signalements validés' },
{ id: 'b3', label: 'Éco-villageois', threshold: 300, description: 'Contributeur régulier de votre quartier' },
{ id: 'b4', label: 'Gardien des eaux', threshold: 600, description: '5 périmètres résolus grâce à vous' },
{ id: 'b5', label: 'Ambassadeur ECOMER', threshold: 1000, description: 'Référence citoyenne de Pointe-Noire' }];


export const pointHistory: PointHistoryEntry[] = [
{ id: 'ph1', label: 'Signalement #ECM-00124 transmis', points: 10, date: '2026-08-31T17:20:00Z' },
{ id: 'ph2', label: 'Signalement validé par la Direction', points: 25, date: '2026-08-29T09:10:00Z' },
{ id: 'ph3', label: 'Périmètre PER-0041 résolu', points: 50, date: '2026-08-26T14:00:00Z' },
{ id: 'ph4', label: 'Photo exploitée par l’analyse IA', points: 15, date: '2026-08-22T08:35:00Z' },
{ id: 'ph5', label: 'Participation opération Côte Sauvage', points: 40, date: '2026-08-17T07:00:00Z' },
{ id: 'ph6', label: 'Signalement #ECM-00098 transmis', points: 10, date: '2026-08-12T16:45:00Z' }];


export const leaderboard: LeaderboardEntry[] = [
{ rank: 1, name: 'Jean Tchibinda', points: 820, zone: 'Tié-Tié' },
{ rank: 2, name: 'Grâce Mabiala', points: 740, zone: 'Ngambio' },
{ rank: 3, name: 'Patrick Loemba', points: 690, zone: 'Port Autonome' },
{ rank: 4, name: 'Bénédicte Loubaki', points: 410, zone: 'Loandjili' },
{ rank: 5, name: 'Divine Makosso', points: 340, zone: 'Ngambio', isCurrentUser: true },
{ rank: 6, name: 'Sarah Nzaba', points: 190, zone: 'Centre-ville' },
{ rank: 7, name: 'Rodrigue Samba', points: 150, zone: 'Mvou-Mvou' }];