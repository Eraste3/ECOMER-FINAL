import type {
  AccountStatus,
  InterventionStatus,
  MaterialKey,
  NotificationKind,
  PerimeterStatus,
  ReportStatus,
  RequestStatus,
  Severity,
  UserRole,
  WasteType } from
'../types';

interface Meta {
  label: string;
  color: string;
  bg: string;
  text: string;
  ring: string;
  dot: string;
}

export const severityMeta: Record<Severity, Meta> = {
  faible: {
    label: 'Faible',
    color: '#10b981',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    ring: 'ring-emerald-200',
    dot: 'bg-emerald-500'
  },
  modere: {
    label: 'Modéré',
    color: '#f59e0b',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    ring: 'ring-amber-200',
    dot: 'bg-amber-500'
  },
  eleve: {
    label: 'Élevé',
    color: '#f97316',
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    ring: 'ring-orange-200',
    dot: 'bg-orange-500'
  },
  critique: {
    label: 'Critique',
    color: '#ef4444',
    bg: 'bg-red-50',
    text: 'text-red-700',
    ring: 'ring-red-200',
    dot: 'bg-red-500'
  }
};

export const severityOrder: Severity[] = ['faible', 'modere', 'eleve', 'critique'];

export const wasteMeta: Record<WasteType, {label: string;short: string;color: string;icon: string;}> = {
  plastiques: { label: 'Déchets plastiques', short: 'Plastiques', color: '#22d3ee', icon: 'bottle' },
  menagers: { label: 'Déchets ménagers', short: 'Ménagers', color: '#1273b8', icon: 'trash' },
  hydrocarbures: { label: 'Hydrocarbures / huile', short: 'Hydrocarbures', color: '#f97316', icon: 'droplet' },
  filets: { label: 'Filets & équipements de pêche', short: 'Filets', color: '#14b8a6', icon: 'net' },
  divers: { label: 'Déchets divers', short: 'Divers', color: '#94a3b8', icon: 'boxes' },
  inconnue: { label: 'Pollution inconnue', short: 'Inconnue', color: '#64748b', icon: 'help' }
};

export const reportStatusMeta: Record<ReportStatus, {label: string;tone: Tone;}> = {
  en_attente: { label: 'En attente', tone: 'neutral' },
  autorise: { label: 'Autorisé', tone: 'info' },
  en_cours: { label: 'En cours', tone: 'warning' },
  resolu: { label: 'Résolu', tone: 'success' }
};

export const perimeterStatusMeta: Record<PerimeterStatus, {label: string;tone: Tone;}> = {
  nouveau: { label: 'Nouveau', tone: 'info' },
  en_validation: { label: 'En validation', tone: 'neutral' },
  en_intervention: { label: 'En intervention', tone: 'warning' },
  resolu: { label: 'Résolu', tone: 'success' }
};

export const requestStatusMeta: Record<RequestStatus, {label: string;tone: Tone;}> = {
  en_attente: { label: 'En attente de validation', tone: 'neutral' },
  approuvee: { label: 'Approuvée', tone: 'success' },
  refusee: { label: 'Refusée', tone: 'danger' }
};

export const interventionStatusMeta: Record<InterventionStatus, {label: string;tone: Tone;}> = {
  planifiee: { label: 'Planifiée', tone: 'info' },
  en_cours: { label: 'En cours', tone: 'warning' },
  terminee: { label: 'Terminée', tone: 'info' },
  validee: { label: 'Validée', tone: 'success' }
};

export const accountStatusMeta: Record<AccountStatus, {label: string;tone: Tone;}> = {
  actif: { label: 'Actif', tone: 'success' },
  en_attente: { label: 'En attente', tone: 'warning' },
  suspendu: { label: 'Suspendu', tone: 'danger' }
};

export const roleMeta: Record<UserRole, {label: string;tone: Tone;}> = {
  citoyen: { label: 'Citoyen', tone: 'info' },
  ong: { label: 'ONG', tone: 'teal' },
  direnv: { label: 'Direction Env.', tone: 'purple' },
  agent: { label: 'Agent municipal', tone: 'neutral' },
  admin: { label: 'Administrateur', tone: 'danger' }
};

export const materialMeta: Record<MaterialKey, string> = {
  sacs: 'Sacs',
  gants: 'Gants',
  camion: 'Camion',
  collecte: 'Matériel de collecte',
  autre: 'Autre'
};

export const notificationMeta: Record<NotificationKind, {tone: Tone;icon: string;}> = {
  perimetre_critique: { tone: 'danger', icon: 'alert' },
  demande_ong: { tone: 'warning', icon: 'inbox' },
  nouveau_signalement: { tone: 'info', icon: 'pin' },
  intervention_terminee: { tone: 'success', icon: 'check' },
  ong_validee: { tone: 'teal', icon: 'building' },
  systeme: { tone: 'neutral', icon: 'cpu' }
};

export type Tone = 'neutral' | 'info' | 'success' | 'warning' | 'danger' | 'teal' | 'purple';

export const toneClasses: Record<Tone, string> = {
  neutral: 'bg-slate-100 text-slate-700 ring-slate-200',
  info: 'bg-sky-50 text-sky-700 ring-sky-200',
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  warning: 'bg-amber-50 text-amber-700 ring-amber-200',
  danger: 'bg-red-50 text-red-700 ring-red-200',
  teal: 'bg-teal-50 text-teal-700 ring-teal-200',
  purple: 'bg-indigo-50 text-indigo-700 ring-indigo-200'
};

export const toneClassesDark: Record<Tone, string> = {
  neutral: 'bg-white/5 text-slate-300 ring-white/10',
  info: 'bg-sky-500/10 text-sky-300 ring-sky-400/20',
  success: 'bg-emerald-500/10 text-emerald-300 ring-emerald-400/20',
  warning: 'bg-amber-500/10 text-amber-300 ring-amber-400/20',
  danger: 'bg-red-500/10 text-red-300 ring-red-400/20',
  teal: 'bg-teal-500/10 text-teal-300 ring-teal-400/20',
  purple: 'bg-indigo-500/10 text-indigo-300 ring-indigo-400/20'
};