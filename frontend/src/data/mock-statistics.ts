import type { Severity, WasteType } from '../types';

export const platformStats = {
  totalReports: 1248,
  activePerimeters: 86,
  resolvedZones: 73,
  collectedTons: 92,
  activeCitizens: 3417,
  partnerOngs: 18,
  resolutionRate: 82,
  avgProcessingDays: 4.6,
  pollutedAreaHa: 61.4,
  cleanedAreaHa: 44.8,
  ongInterventions: 128,
  municipalInterventions: 47
};

export interface SeriesPoint {
  label: string;
  signalements: number;
  perimetres: number;
  resolus: number;
}

export const reportsTrend7d: SeriesPoint[] = [
{ label: 'Lun', signalements: 28, perimetres: 3, resolus: 2 },
{ label: 'Mar', signalements: 34, perimetres: 4, resolus: 3 },
{ label: 'Mer', signalements: 41, perimetres: 5, resolus: 2 },
{ label: 'Jeu', signalements: 37, perimetres: 4, resolus: 4 },
{ label: 'Ven', signalements: 52, perimetres: 6, resolus: 3 },
{ label: 'Sam', signalements: 64, perimetres: 7, resolus: 5 },
{ label: 'Dim', signalements: 47, perimetres: 5, resolus: 4 }];


export const reportsTrend30d: SeriesPoint[] = Array.from({ length: 30 }, (_, i) => {
  const base = 26 + Math.round(18 * Math.sin(i / 3.4) + i * 0.7);
  return {
    label: `J-${29 - i}`,
    signalements: base,
    perimetres: Math.max(1, Math.round(base / 8)),
    resolus: Math.max(0, Math.round(base / 11))
  };
});

export const reportsTrend3m: SeriesPoint[] = [
{ label: 'Juin S1', signalements: 141, perimetres: 12, resolus: 6 },
{ label: 'Juin S3', signalements: 168, perimetres: 15, resolus: 9 },
{ label: 'Juil S1', signalements: 192, perimetres: 17, resolus: 11 },
{ label: 'Juil S3', signalements: 205, perimetres: 18, resolus: 14 },
{ label: 'Août S1', signalements: 246, perimetres: 21, resolus: 16 },
{ label: 'Août S3', signalements: 296, perimetres: 24, resolus: 17 }];


export const reportsTrendAll: SeriesPoint[] = [
{ label: 'Mars', signalements: 84, perimetres: 7, resolus: 3 },
{ label: 'Avril', signalements: 132, perimetres: 11, resolus: 6 },
{ label: 'Mai', signalements: 178, perimetres: 14, resolus: 9 },
{ label: 'Juin', signalements: 309, perimetres: 27, resolus: 15 },
{ label: 'Juillet', signalements: 397, perimetres: 35, resolus: 25 },
{ label: 'Août', signalements: 542, perimetres: 45, resolus: 33 }];


export const wasteDistribution: Array<{type: WasteType;label: string;value: number;color: string;}> = [
{ type: 'plastiques', label: 'Plastiques', value: 468, color: '#22d3ee' },
{ type: 'menagers', label: 'Déchets ménagers', value: 312, color: '#1273b8' },
{ type: 'hydrocarbures', label: 'Hydrocarbures', value: 164, color: '#f97316' },
{ type: 'filets', label: 'Filets de pêche', value: 132, color: '#14b8a6' },
{ type: 'divers', label: 'Déchets divers', value: 118, color: '#94a3b8' },
{ type: 'inconnue', label: 'Pollution inconnue', value: 54, color: '#64748b' }];


export const severityDistribution: Array<{severity: Severity;label: string;value: number;color: string;}> = [
{ severity: 'faible', label: 'Faible', value: 22, color: '#10b981' },
{ severity: 'modere', label: 'Modérée', value: 31, color: '#f59e0b' },
{ severity: 'eleve', label: 'Élevée', value: 24, color: '#f97316' },
{ severity: 'critique', label: 'Critique', value: 9, color: '#ef4444' }];


export const monthlyImpact = [
{ label: 'Mars', surfaceHa: 2.1, tonnes: 4.2, interventions: 5 },
{ label: 'Avril', surfaceHa: 3.4, tonnes: 7.8, interventions: 8 },
{ label: 'Mai', surfaceHa: 5.2, tonnes: 11.4, interventions: 12 },
{ label: 'Juin', surfaceHa: 7.6, tonnes: 16.1, interventions: 17 },
{ label: 'Juillet', surfaceHa: 9.8, tonnes: 22.6, interventions: 21 },
{ label: 'Août', surfaceHa: 12.4, tonnes: 29.9, interventions: 26 }];


export const processingDelay = [
{ label: 'Mars', jours: 9.2 },
{ label: 'Avril', jours: 8.1 },
{ label: 'Mai', jours: 7.4 },
{ label: 'Juin', jours: 6.2 },
{ label: 'Juillet', jours: 5.3 },
{ label: 'Août', jours: 4.6 }];


export const monitoringSeriesSeed = Array.from({ length: 24 }, (_, i) => ({
  label: `${String(i).padStart(2, '0')}h`,
  cpu: 28 + Math.round(14 * Math.sin(i / 2.2) + i % 5),
  memoire: 46 + Math.round(11 * Math.cos(i / 3.1) + i % 4)
}));

export const monitoringKpis = {
  serverState: 'Opérationnel',
  latencyMs: 45,
  errorRate: 0.12,
  requests24h: 184320,
  activeUsers: 412,
  reportsPerMinute: 3.4,
  avgResponseMs: 128,
  uptime: 99.98
};