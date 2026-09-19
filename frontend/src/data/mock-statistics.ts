export interface SeriesPoint {
  label: string;
  signalements: number;
  resolus: number;
}

export const platformStats = {
  totalReports: 12847,
  activePerimeters: 86,
  resolvedZones: 532,
  collectedTons: 1840,
  activeCitizens: 3420,
  partnerOngs: 27,
  avgProcessingDays: 2.8,
  resolutionRate: 78,
  pollutedAreaHa: 96.4,
  cleanedAreaHa: 58.2,
  ongInterventions: 214,
  municipalInterventions: 463
};

export const processingDelay = [
  { label: 'Signalement → Validation', jours: 1.2 },
  { label: 'Validation → Périmètre', jours: 2.4 },
  { label: 'Périmètre → Autorisation', jours: 1.8 },
  { label: 'Autorisation → Intervention', jours: 0.9 },
  { label: 'Intervention → Clôture', jours: 1.6 }
];

export const reportsTrend7d: SeriesPoint[] = [
  { label: 'Lun', signalements: 42, resolus: 18 },
  { label: 'Mar', signalements: 55, resolus: 22 },
  { label: 'Mer', signalements: 38, resolus: 25 },
  { label: 'Jeu', signalements: 61, resolus: 20 },
  { label: 'Ven', signalements: 74, resolus: 31 },
  { label: 'Sam', signalements: 49, resolus: 26 },
  { label: 'Dim', signalements: 33, resolus: 14 }
];

export const reportsTrend30d: SeriesPoint[] = [
  { label: 'S1', signalements: 310, resolus: 142 },
  { label: 'S2', signalements: 385, resolus: 168 },
  { label: 'S3', signalements: 342, resolus: 180 },
  { label: 'S4', signalements: 420, resolus: 214 }
];

export const reportsTrend3m: SeriesPoint[] = [
  { label: 'Juillet', signalements: 1180, resolus: 720 },
  { label: 'Août', signalements: 1320, resolus: 810 },
  { label: 'Septembre', signalements: 1120, resolus: 860 }
];

export const reportsTrendAll: SeriesPoint[] = [
  { label: 'Jan', signalements: 620, resolus: 240 },
  { label: 'Fév', signalements: 710, resolus: 290 },
  { label: 'Mar', signalements: 840, resolus: 360 },
  { label: 'Avr', signalements: 960, resolus: 430 },
  { label: 'Mai', signalements: 1050, resolus: 520 },
  { label: 'Juin', signalements: 1240, resolus: 640 },
  { label: 'Juil', signalements: 1280, resolus: 720 },
  { label: 'Août', signalements: 980, resolus: 810 }
];

export const wasteDistribution = [
  { label: 'Plastique', value: 3420, color: '#22d3ee' },
  { label: 'Ménagers', value: 2610, color: '#1273b8' },
  { label: 'Verre', value: 1240, color: '#10b981' },
  { label: 'Métal', value: 980, color: '#f97316' },
  { label: 'Organiques', value: 2110, color: '#14b8a6' },
  { label: 'Autres', value: 640, color: '#94a3b8' }
];

export const severityDistribution = [
  { severity: 'critique', label: 'Critique', value: 14, color: '#ef4444' },
  { severity: 'majeure', label: 'Majeure', value: 28, color: '#f97316' },
  { severity: 'moderee', label: 'Modérée', value: 33, color: '#f59e0b' },
  { severity: 'faible', label: 'Faible', value: 25, color: '#10b981' }
];

export const monthlyImpact = [
  { label: 'Jan', tonnes: 120, surfaceHa: 9.4 },
  { label: 'Fév', tonnes: 145, surfaceHa: 11.2 },
  { label: 'Mar', tonnes: 168, surfaceHa: 13.6 },
  { label: 'Avr', tonnes: 210, surfaceHa: 16.8 },
  { label: 'Mai', tonnes: 245, surfaceHa: 19.4 },
  { label: 'Juin', tonnes: 292, surfaceHa: 23.1 },
  { label: 'Juil', tonnes: 330, surfaceHa: 26.5 },
  { label: 'Août', tonnes: 285, surfaceHa: 24.8 }
];

export const monitoringSeriesSeed = [
  { label: '14:30', cpu: 22, memoire: 41 },
  { label: '14:32', cpu: 34, memoire: 44 },
  { label: '14:34', cpu: 41, memoire: 47 },
  { label: '14:36', cpu: 38, memoire: 46 },
  { label: '14:38', cpu: 52, memoire: 49 },
  { label: '14:40', cpu: 47, memoire: 48 },
  { label: '14:42', cpu: 61, memoire: 51 },
  { label: '14:44', cpu: 58, memoire: 50 },
  { label: '14:46', cpu: 66, memoire: 54 },
  { label: '14:48', cpu: 72, memoire: 57 },
  { label: '14:50', cpu: 68, memoire: 55 },
  { label: '14:52', cpu: 79, memoire: 60 },
  { label: '14:54', cpu: 74, memoire: 58 },
  { label: '14:56', cpu: 82, memoire: 63 },
  { label: '14:58', cpu: 77, memoire: 61 },
  { label: '15:00', cpu: 85, memoire: 66 },
  { label: '15:02', cpu: 80, memoire: 64 },
  { label: '15:04', cpu: 88, memoire: 68 }
];

export const monitoringKpis = {
  requests24h: 1843260,
  activeUsers: 7432,
  reportsPerMinute: 12.4,
  avgResponseMs: 184,
  uptime: 99.98,
  latencyMs: 184,
  errorRate: 0.4
};
