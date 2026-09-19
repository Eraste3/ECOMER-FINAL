import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export interface EcoPointHistory {
  id: string;
  points: number;
  label: string;
  date: string;
}

export interface Badge {
  id: string;
  label: string;
  threshold: number;
  icon: string;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  zone: string;
  points: number;
  isCurrentUser: boolean;
}

const DEFAULT_BADGES: Badge[] = [
  { id: 'novice', label: 'Novice', threshold: 0, icon: '🌱' },
  { id: 'observer', label: 'Observateur', threshold: 50, icon: '👁️' },
  { id: 'reporter', label: 'Reporter', threshold: 150, icon: '📸' },
  { id: 'guardian', label: 'Gardien', threshold: 300, icon: '🛡️' },
  { id: 'champion', label: 'Champion', threshold: 500, icon: '🏆' },
  { id: 'legend', label: 'Légende', threshold: 1000, icon: '⭐' }
];

export function useGamification() {
  const { user } = useAuth();
  const [ecoPoints, setEcoPoints] = useState<number>(0);
  const [history, setHistory] = useState<EcoPointHistory[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage for now (replace with API call when available)
    const loadGamificationData = () => {
      try {
        const storedPoints = localStorage.getItem(`ecoPoints_${user?.id || 'guest'}`);
        const storedHistory = localStorage.getItem(`ecoHistory_${user?.id || 'guest'}`);
        const storedLeaderboard = localStorage.getItem('ecoLeaderboard');

        setEcoPoints(storedPoints ? parseInt(storedPoints, 10) : 0);
        setHistory(storedHistory ? JSON.parse(storedHistory) : []);
        setLeaderboard(storedLeaderboard ? JSON.parse(storedLeaderboard) : generateMockLeaderboard());
      } catch (error) {
        console.error('Error loading gamification data:', error);
        setEcoPoints(0);
        setHistory([]);
        setLeaderboard(generateMockLeaderboard());
      } finally {
        setLoading(false);
      }
    };

    loadGamificationData();
  }, [user]);

  const addEcoPoints = (points: number, label: string) => {
    const newPoints = ecoPoints + points;
    const newEntry: EcoPointHistory = {
      id: Date.now().toString(),
      points,
      label,
      date: new Date().toISOString()
    };

    setEcoPoints(newPoints);
    setHistory(prev => [newEntry, ...prev]);

    // Persist to localStorage
    localStorage.setItem(`ecoPoints_${user?.id || 'guest'}`, newPoints.toString());
    localStorage.setItem(`ecoHistory_${user?.id || 'guest'}`, JSON.stringify([newEntry, ...history]));
  };

  const getCurrentBadge = (): Badge => {
    return [...DEFAULT_BADGES].reverse().find(b => ecoPoints >= b.threshold) ?? DEFAULT_BADGES[0];
  };

  const getNextBadge = (): Badge | null => {
    return DEFAULT_BADGES.find(b => b.threshold > ecoPoints) ?? null;
  };

  const getProgress = (): number => {
    const current = getCurrentBadge();
    const next = getNextBadge();
    if (!next) return 100;
    return Math.round((ecoPoints - current.threshold) / (next.threshold - current.threshold) * 100);
  };

  return {
    ecoPoints,
    history,
    leaderboard,
    badges: DEFAULT_BADGES,
    loading,
    addEcoPoints,
    getCurrentBadge,
    getNextBadge,
    getProgress
  };
}

function generateMockLeaderboard(): LeaderboardEntry[] {
  return [
    { rank: 1, name: 'Marie Kouassi', zone: 'Ngambio', points: 850, isCurrentUser: false },
    { rank: 2, name: 'Jean-Pierre Mvouba', zone: 'Littoral Sud', points: 720, isCurrentUser: false },
    { rank: 3, name: 'François Ntsoumi', zone: 'Pointe-Noire', points: 680, isCurrentUser: false },
    { rank: 4, name: 'Vous', zone: 'Pointe-Noire', points: 0, isCurrentUser: true },
    { rank: 5, name: 'Céline Malonga', zone: 'Tchimbamba', points: 450, isCurrentUser: false },
    { rank: 6, name: 'Paul Mboussi', zone: 'Loango', points: 380, isCurrentUser: false },
    { rank: 7, name: 'Aline Nkouka', zone: 'Ngambio', points: 320, isCurrentUser: false },
    { rank: 8, name: 'Marc Moukoko', zone: 'Littoral Sud', points: 280, isCurrentUser: false },
    { rank: 9, name: 'Josiane Bissiela', zone: 'Pointe-Noire', points: 220, isCurrentUser: false },
    { rank: 10, name: 'Christian Makaya', zone: 'Tchimbamba', points: 180, isCurrentUser: false }
  ];
}
