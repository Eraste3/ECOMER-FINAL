import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { toast } from 'sonner';
import type {
  AiSettings,
  AppNotification,
  AppUser,
  AuthorizationRequest,
  ClusteringConfig,
  Intervention,
  MaterialKey,
  Ong,
  Perimeter,
  Report,
  UserRole } from
'../types';
import { mockReports } from '../data/mock-reports';
import { mockPerimeters } from '../data/mock-perimeters';
import { mockOngs } from '../data/mock-ongs';
import { mockUsers, CURRENT_CITIZEN_ID } from '../data/mock-users';
import { mockNotifications } from '../data/mock-notifications';
import { mockInterventions, mockRequests } from '../data/mock-interventions';
import { pointHistory as seedHistory } from '../data/mock-gamification';
import type { PointHistoryEntry, WasteLot, EcoshopOrder } from '../types';
import { mockWasteLots, mockEcoshopOrders } from '../data/mock-ecoshop';

export interface NewReportPayload {
  wasteType: Report['wasteType'];
  severity: Report['severity'];
  description?: string;
  photoUrl?: string;
  point: Report['point'];
  zone: Report['zone'];
  confidence: number;
}

interface EcomerState {
  reports: Report[];
  perimeters: Perimeter[];
  ongs: Ong[];
  users: AppUser[];
  requests: AuthorizationRequest[];
  interventions: Intervention[];
  notifications: AppNotification[];
  ecoPoints: number;
  history: PointHistoryEntry[];
  aiSettings: AiSettings;
  clustering: ClusteringConfig;
  currentUser: AppUser;
  wasteLots: WasteLot[];
  ecoshopOrders: EcoshopOrder[];
  addReport: (payload: NewReportPayload) => Report;
  placeOrder: (lotId: string, deliveryMethod: EcoshopOrder['deliveryMethod'], notes?: string) => void;
  updateOrderStatus: (orderId: string, status: EcoshopOrder['status'], paymentStatus?: EcoshopOrder['paymentStatus']) => void;
  addWasteLot: (lot: Omit<WasteLot, 'id' | 'createdAt' | 'status'>) => void;
  decideRequest: (id: string, decision: 'approuvee' | 'refusee') => void;
  submitRequest: (payload: Omit<AuthorizationRequest, 'id' | 'status' | 'submittedAt'>) => void;
  addAfterProof: (interventionId: string, photoUrl: string, tons: number) => void;
  resolvePerimeter: (perimeterId: string) => void;
  setOngStatus: (ongId: string, status: Ong['status']) => void;
  setUserStatus: (userId: string, status: AppUser['status']) => void;
  toggleAi: (key: keyof AiSettings) => void;
  updateClustering: (patch: Partial<ClusteringConfig>) => void;
  mandateTeam: (payload: {
    perimeterId: string;
    team: string;
    lead: string;
    date: string;
    materials: MaterialKey[];
    priority: Report['severity'];
  }) => void;
  markAllRead: (role: UserRole) => void;
  notificationsFor: (role: UserRole) => AppNotification[];
}

const EcomerContext = createContext<EcomerState | null>(null);

let reportSeq = 125;
let requestSeq = 88;
let interventionSeq = 82;
let perimeterSeq = 42;

export function EcomerProvider({ children }: {children: React.ReactNode;}) {
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [perimeters, setPerimeters] = useState<Perimeter[]>(mockPerimeters);
  const [ongs, setOngs] = useState<Ong[]>(mockOngs);
  const [users, setUsers] = useState<AppUser[]>(mockUsers);
  const [requests, setRequests] = useState<AuthorizationRequest[]>(mockRequests);
  const [interventions, setInterventions] = useState<Intervention[]>(mockInterventions);
  const [notifications, setNotifications] = useState<AppNotification[]>(mockNotifications);
  const [ecoPoints, setEcoPoints] = useState(340);
  const [history, setHistory] = useState<PointHistoryEntry[]>(seedHistory);
  const [aiSettings, setAiSettings] = useState<AiSettings>({
    classification: true,
    anomalies: true,
    severity: true,
    imageAnalysis: true,
    riskPrediction: false
  });
  const [clustering, setClustering] = useState<ClusteringConfig>({
    radiusM: 100,
    maxDistanceM: 250,
    minReports: 3,
    timeWindowDays: 14,
    severityThreshold: 'modere'
  });
  const [wasteLots, setWasteLots] = useState<WasteLot[]>(mockWasteLots);
  const [ecoshopOrders, setEcoshopOrders] = useState<EcoshopOrder[]>(mockEcoshopOrders);

  const currentUser = users.find((u) => u.id === CURRENT_CITIZEN_ID) ?? users[0];

  const pushNotification = useCallback((n: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => {
    setNotifications((prev) => [
    { ...n, id: `NTF-${Math.random().toString(36).slice(2, 7)}`, createdAt: new Date().toISOString(), read: false },
    ...prev]
    );
  }, []);

  const addReport = useCallback(
    (payload: NewReportPayload) => {
      const id = `ECM-00${reportSeq++}`;
      const near = perimeters.find(
        (p) =>
        p.zone === payload.zone &&
        Math.hypot(p.centroid.x - payload.point.x, p.centroid.y - payload.point.y) < 90
      );
      const report: Report = {
        id,
        authorId: currentUser.id,
        authorName: currentUser.name,
        authorRole: 'citoyen',
        zone: payload.zone,
        wasteType: payload.wasteType,
        severity: payload.severity,
        status: 'en_attente',
        createdAt: new Date().toISOString(),
        description: payload.description,
        photoUrl: payload.photoUrl,
        point: payload.point,
        perimeterId: near?.id,
        priority: false,
        ai: {
          detectedType: payload.wasteType,
          confidence: payload.confidence,
          estimatedSeverity: payload.severity
        }
      };
      setReports((prev) => [report, ...prev]);
      setEcoPoints((p) => p + 10);
      setHistory((prev) => [
      { id: `ph-${id}`, label: `Signalement #${id} transmis`, points: 10, date: new Date().toISOString() },
      ...prev]
      );

      if (near) {
        setPerimeters((prev) =>
        prev.map((p) => p.id === near.id ? { ...p, reportCount: p.reportCount + 1 } : p)
        );
        pushNotification({
          kind: 'nouveau_signalement',
          title: 'Nouveau signalement citoyen',
          body: `${id} rattaché au périmètre ${near.id} — ${payload.zone}.`,
          audience: ['ong', 'direnv', 'admin']
        });
      } else {
        const newId = `PER-00${perimeterSeq++}`;
        const cx = payload.point.x;
        const cy = payload.point.y;
        setPerimeters((prev) => [
        {
          id: newId,
          zone: payload.zone,
          dominantWaste: payload.wasteType,
          severity: payload.severity,
          status: 'nouveau',
          areaM2: 2400,
          reportCount: 1,
          createdAt: new Date().toISOString(),
          polygon: Array.from({ length: 9 }, (_, i) => {
            const a = i / 9 * Math.PI * 2;
            return { x: Math.round(cx + Math.cos(a) * 26), y: Math.round(cy + Math.sin(a) * 20) };
          }),
          centroid: payload.point,
          wasteTons: 0.8
        },
        ...prev]
        );
        pushNotification({
          kind: 'perimetre_critique',
          title: 'Nouveau périmètre généré',
          body: `${newId} — ${payload.zone} : créé par clustering spatial (rayon ${clustering.radiusM} m).`,
          audience: ['ong', 'direnv', 'admin']
        });
      }
      return report;
    },
    [clustering.radiusM, currentUser.id, currentUser.name, perimeters, pushNotification]
  );

  const decideRequest = useCallback(
    (id: string, decision: 'approuvee' | 'refusee') => {
      const req = requests.find((r) => r.id === id);
      setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: decision } : r));
      if (!req) return;
      if (decision === 'approuvee') {
        const deadline = new Date();
        deadline.setDate(deadline.getDate() + 30);
        const intId = `INT-00${interventionSeq++}`;
        setInterventions((prev) => [
        {
          id: intId,
          perimeterId: req.perimeterId,
          zone: req.zone,
          operator: req.ongName,
          operatorType: 'ong',
          team: `Brigade ${req.zone}`,
          lead: req.ongName,
          agents: req.agents,
          materials: req.materials,
          startDate: req.plannedDate,
          deadline: deadline.toISOString().slice(0, 10),
          status: 'en_cours',
          severity: req.severity,
          areaM2: perimeters.find((p) => p.id === req.perimeterId)?.areaM2 ?? 5000,
          priority: req.severity
        },
        ...prev]
        );
        setPerimeters((prev) =>
        prev.map((p) =>
        p.id === req.perimeterId ? { ...p, status: 'en_intervention', assignedOngId: req.ongId } : p
        )
        );
        setReports((prev) =>
        prev.map((r) => r.perimeterId === req.perimeterId ? { ...r, status: 'autorise' } : r)
        );
        toast.success('Autorisation approuvée', {
          description: `${req.ongName} — échéance de 30 jours ouverte sur ${req.perimeterId}.`
        });
      } else {
        toast.error('Demande refusée', { description: `${req.id} — ${req.ongName}.` });
      }
    },
    [perimeters, requests]
  );

  const submitRequest = useCallback<EcomerState['submitRequest']>(
    (payload) => {
      const id = `DEM-00${requestSeq++}`;
      setRequests((prev) => [
      { ...payload, id, status: 'en_attente', submittedAt: new Date().toISOString() },
      ...prev]
      );
      setPerimeters((prev) =>
      prev.map((p) => p.id === payload.perimeterId && p.status === 'nouveau' ? { ...p, status: 'en_validation' } : p)
      );
      pushNotification({
        kind: 'demande_ong',
        title: 'Une ONG demande une autorisation',
        body: `${payload.ongName} — périmètre ${payload.perimeterId} (${payload.zone}), ${payload.agents} agents.`,
        audience: ['direnv', 'admin']
      });
      toast.success('Demande soumise', { description: `${id} transmise à la Direction de l’Environnement.` });
    },
    [pushNotification]
  );

  const addAfterProof = useCallback<EcomerState['addAfterProof']>(
    (interventionId, photoUrl, tons) => {
      setInterventions((prev) =>
      prev.map((i) =>
      i.id === interventionId ? { ...i, afterPhoto: photoUrl, status: 'terminee', collectedTons: tons } : i
      )
      );
      const intv = interventions.find((i) => i.id === interventionId);
      pushNotification({
        kind: 'intervention_terminee',
        title: 'Intervention terminée',
        body: `${interventionId} — preuve « après » déposée, en attente de validation.`,
        audience: ['direnv', 'admin', 'ong']
      });
      toast.success('Preuve « après » enregistrée', {
        description: `${intv?.zone ?? ''} — le périmètre peut désormais passer à « Résolu ».`
      });
    },
    [interventions, pushNotification]
  );

  const resolvePerimeter = useCallback<EcomerState['resolvePerimeter']>(
    (perimeterId) => {
      setPerimeters((prev) => prev.map((p) => p.id === perimeterId ? { ...p, status: 'resolu' } : p));
      setInterventions((prev) =>
      prev.map((i) => i.perimeterId === perimeterId ? { ...i, status: 'validee' } : i)
      );
      setReports((prev) => prev.map((r) => r.perimeterId === perimeterId ? { ...r, status: 'resolu' } : r));
      pushNotification({
        kind: 'intervention_terminee',
        title: 'Périmètre résolu',
        body: `${perimeterId} est passé au statut « Résolu ».`,
        audience: ['citoyen', 'ong', 'direnv', 'admin']
      });
      toast.success('Périmètre résolu', { description: `${perimeterId} — zone dépolluée et validée.` });
    },
    [pushNotification]
  );

  const setOngStatus = useCallback<EcomerState['setOngStatus']>(
    (ongId, status) => {
      setOngs((prev) =>
      prev.map((o) => o.id === ongId ? { ...o, status, accredited: status === 'actif' } : o)
      );
      const ong = ongs.find((o) => o.id === ongId);
      if (status === 'actif') {
        pushNotification({
          kind: 'ong_validee',
          title: 'Compte ONG validé',
          body: `${ong?.name ?? ongId} est désormais accréditée sur ECOMER.`,
          audience: ['admin', 'ong']
        });
        toast.success('ONG approuvée', { description: `${ong?.name ?? ongId} peut intervenir sur le terrain.` });
      } else if (status === 'suspendu') {
        toast.error('ONG suspendue', { description: ong?.name ?? ongId });
      } else {
        toast('Statut mis à jour', { description: ong?.name ?? ongId });
      }
    },
    [ongs, pushNotification]
  );

  const setUserStatus = useCallback<EcomerState['setUserStatus']>((userId, status) => {
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, status } : u));
    toast(status === 'suspendu' ? 'Compte suspendu' : 'Compte réactivé', { description: userId });
  }, []);

  const toggleAi = useCallback<EcomerState['toggleAi']>((key) => {
    setAiSettings((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      toast(next[key] ? 'Fonction IA activée' : 'Fonction IA désactivée');
      return next;
    });
  }, []);

  const updateClustering = useCallback<EcomerState['updateClustering']>((patch) => {
    setClustering((prev) => ({ ...prev, ...patch }));
  }, []);

  const mandateTeam = useCallback<EcomerState['mandateTeam']>(
    (payload) => {
      const deadline = new Date(payload.date);
      deadline.setDate(deadline.getDate() + 30);
      const intId = `INT-00${interventionSeq++}`;
      const per = perimeters.find((p) => p.id === payload.perimeterId);
      setInterventions((prev) => [
      {
        id: intId,
        perimeterId: payload.perimeterId,
        zone: per?.zone ?? 'Centre-ville',
        operator: `Voirie municipale — ${payload.team}`,
        operatorType: 'municipale',
        team: payload.team,
        lead: payload.lead,
        agents: 18,
        materials: payload.materials,
        startDate: payload.date,
        deadline: deadline.toISOString().slice(0, 10),
        status: 'en_cours',
        severity: per?.severity ?? 'modere',
        areaM2: per?.areaM2 ?? 5000,
        priority: payload.priority
      },
      ...prev]
      );
      setPerimeters((prev) =>
      prev.map((p) => p.id === payload.perimeterId ? { ...p, status: 'en_intervention' } : p)
      );
      toast.success('Ordre de mission émis', {
        description: `${payload.team} mandatée sur ${payload.perimeterId} — échéance 30 jours.`
      });
    },
    [perimeters]
  );

  const markAllRead = useCallback<EcomerState['markAllRead']>((role) => {
    setNotifications((prev) => prev.map((n) => n.audience.includes(role) ? { ...n, read: true } : n));
  }, []);

  const notificationsFor = useCallback<EcomerState['notificationsFor']>(
    (role) => notifications.filter((n) => n.audience.includes(role)),
    [notifications]
  );

  const placeOrder = useCallback<EcomerState['placeOrder']>((lotId, deliveryMethod, notes) => {
    const lot = wasteLots.find((l) => l.id === lotId);
    if (!lot) return;

    const orderId = `ORD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const amount = lot.quantityTons * lot.pricePerTon;

    const newOrder: EcoshopOrder = {
      id: orderId,
      lotId,
      recyclerId: currentUser.id,
      recyclerName: currentUser.name,
      amount,
      status: 'en_attente',
      deliveryMethod,
      paymentStatus: 'en_attente',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes
    };

    setEcoshopOrders((prev) => [newOrder, ...prev]);
    setWasteLots((prev) => prev.map((l) => l.id === lotId ? { ...l, status: 'reserve' } : l));
    toast.success('Commande envoyée', { description: `Votre commande pour le lot ${lotId} est en attente de validation.` });
  }, [wasteLots, currentUser]);

  const updateOrderStatus = useCallback<EcomerState['updateOrderStatus']>((orderId, status, paymentStatus) => {
    setEcoshopOrders((prev) => prev.map((o) => {
      if (o.id === orderId) {
        const updated = { ...o, status, updatedAt: new Date().toISOString() };
        if (paymentStatus) updated.paymentStatus = paymentStatus;
        return updated;
      }
      return o;
    }));

    // If canceled, make lot available again
    if (status === 'annulee' || status === 'refusee') {
      const order = ecoshopOrders.find(o => o.id === orderId);
      if (order) {
        setWasteLots((prev) => prev.map((l) => l.id === order.lotId ? { ...l, status: 'disponible' } : l));
      }
    } else if (status === 'livree') {
      const order = ecoshopOrders.find(o => o.id === orderId);
      if (order) {
        setWasteLots((prev) => prev.map((l) => l.id === order.lotId ? { ...l, status: 'vendu' } : l));
      }
    }
    
    toast.success('Statut mis à jour', { description: `La commande ${orderId} a été mise à jour.` });
  }, [ecoshopOrders]);

  const addWasteLot = useCallback<EcomerState['addWasteLot']>((lot) => {
    const newLot: WasteLot = {
      ...lot,
      id: `LOT-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      status: 'disponible',
      createdAt: new Date().toISOString()
    };
    setWasteLots((prev) => [newLot, ...prev]);
    toast.success('Lot publié', { description: 'Le nouveau lot de déchets est maintenant visible sur la marketplace.' });
  }, []);

  const value = useMemo<EcomerState>(
    () => ({
      reports,
      perimeters,
      ongs,
      users,
      requests,
      interventions,
      notifications,
      ecoPoints,
      history,
      aiSettings,
      clustering,
      currentUser,
      wasteLots,
      ecoshopOrders,
      addReport,
      decideRequest,
      submitRequest,
      addAfterProof,
      resolvePerimeter,
      setOngStatus,
      setUserStatus,
      toggleAi,
      updateClustering,
      mandateTeam,
      markAllRead,
      notificationsFor,
      placeOrder,
      updateOrderStatus,
      addWasteLot
    }),
    [
    reports,
    perimeters,
    ongs,
    users,
    requests,
    interventions,
    notifications,
    ecoPoints,
    history,
    aiSettings,
    clustering,
    currentUser,
    wasteLots,
    ecoshopOrders,
    addReport,
    decideRequest,
    submitRequest,
    addAfterProof,
    resolvePerimeter,
    setOngStatus,
    setUserStatus,
    toggleAi,
    updateClustering,
    mandateTeam,
    markAllRead,
    notificationsFor,
    placeOrder,
    updateOrderStatus,
    addWasteLot]

  );

  return <EcomerContext.Provider value={value}>{children}</EcomerContext.Provider>;
}

export function useEcomer(): EcomerState {
  const ctx = useContext(EcomerContext);
  if (!ctx) throw new Error('useEcomer doit être utilisé dans EcomerProvider');
  return ctx;
}