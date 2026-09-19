export type Severity = 'faible' | 'modere' | 'eleve' | 'critique';

export type WasteType =
'plastiques' |
'menagers' |
'hydrocarbures' |
'filets' |
'divers' |
'inconnue';

export type ReportStatus = 'en_attente' | 'autorise' | 'en_cours' | 'resolu';

export type PerimeterStatus = 'nouveau' | 'en_validation' | 'en_intervention' | 'resolu';

export type UserRole = 'citoyen' | 'ecomer' | 'agent_ecomer' | 'responsable_ecomer' | 'admin' | 'recycleur';

export type AccountStatus = 'actif' | 'en_attente' | 'suspendu';

export type RequestStatus = 'en_attente' | 'approuvee' | 'refusee';

export type InterventionStatus = 'planifiee' | 'en_cours' | 'terminee' | 'validee';

export type ZoneName =
'Ngambio' |
'Mvou-Mvou' |
'Loandjili' |
'Tié-Tié' |
'Mongo-Mpoukou' |
'Lumumba' |
'Centre-ville' |
'Côte Sauvage' |
'Port Autonome' |
'Baie de Loango';

export interface GeoPoint {
  x: number;
  y: number;
  lat: number;
  lng: number;
}

export interface Report {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: Extract<UserRole, 'citoyen' | 'ong'>;
  zone: ZoneName;
  wasteType: WasteType;
  severity: Severity;
  status: ReportStatus;
  createdAt: string;
  description?: string;
  photoUrl?: string;
  point: GeoPoint;
  perimeterId?: string;
  priority: boolean;
  ai: {
    detectedType: WasteType;
    confidence: number;
    estimatedSeverity: Severity;
  };
}

export interface Perimeter {
  id: string;
  zone: ZoneName;
  dominantWaste: WasteType;
  severity: Severity;
  status: PerimeterStatus;
  areaM2: number;
  reportCount: number;
  createdAt: string;
  deadline?: string;
  assignedOngId?: string;
  polygon: Array<{x: number;y: number;}>;
  centroid: GeoPoint;
  wasteTons: number;
}

export interface Ong {
  id: string;
  name: string;
  manager: string;
  email: string;
  phone: string;
  zone: ZoneName;
  status: AccountStatus;
  createdAt: string;
  agents: number;
  interventionsDone: number;
  accredited: boolean;
  logoColor: string;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: AccountStatus;
  createdAt: string;
  lastActivity: string;
  zone: ZoneName;
  ecoPoints?: number;
  organisation?: string;
}

export type MaterialKey = 'sacs' | 'gants' | 'camion' | 'collecte' | 'autre';

export interface AuthorizationRequest {
  id: string;
  ongId: string;
  ongName: string;
  perimeterId: string;
  zone: ZoneName;
  wasteType: WasteType;
  severity: Severity;
  plannedDate: string;
  agents: number;
  interventionType: string;
  materials: MaterialKey[];
  note?: string;
  status: RequestStatus;
  submittedAt: string;
}

export interface Intervention {
  id: string;
  perimeterId: string;
  zone: ZoneName;
  operator: string;
  operatorType: 'ong' | 'municipale';
  team: string;
  lead: string;
  agents: number;
  materials: MaterialKey[];
  startDate: string;
  deadline: string;
  status: InterventionStatus;
  severity: Severity;
  areaM2: number;
  beforePhoto?: string;
  afterPhoto?: string;
  collectedTons?: number;
  priority: Severity;
}

export type NotificationKind =
'perimetre_critique' |
'demande_ong' |
'nouveau_signalement' |
'intervention_terminee' |
'ong_validee' |
'systeme';

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  audience: UserRole[];
}

export interface Badge {
  id: string;
  label: string;
  threshold: number;
  description: string;
}

export interface PointHistoryEntry {
  id: string;
  label: string;
  points: number;
  date: string;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
  zone: ZoneName;
  isCurrentUser?: boolean;
}

export interface AiSettings {
  classification: boolean;
  anomalies: boolean;
  severity: boolean;
  imageAnalysis: boolean;
  riskPrediction: boolean;
}

export interface ClusteringConfig {
  radiusM: number;
  maxDistanceM: number;
  minReports: number;
  timeWindowDays: number;
  severityThreshold: Severity;
}

export type WasteQuality = 'A' | 'B' | 'C';

export interface WasteLot {
  id: string;
  type: WasteType;
  quantityTons: number;
  quality: WasteQuality;
  pricePerTon: number;
  description: string;
  status: 'disponible' | 'reserve' | 'vendu';
  createdAt: string;
  images: string[];
}

export type DeliveryMethod = 'livraison_ecomer' | 'retrait_sur_place';
export type PaymentStatus = 'en_attente' | 'facture_emise' | 'paye';

export interface EcoshopOrder {
  id: string;
  lotId: string;
  recyclerId: string;
  recyclerName: string;
  amount: number;
  status: 'en_attente' | 'acceptee' | 'refusee' | 'livree' | 'annulee';
  deliveryMethod: DeliveryMethod;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}