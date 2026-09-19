import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { toast } from 'sonner';
import type {
  AiSettings,
  ClusteringConfig } from
'../types';

interface EcomerState {
  aiSettings: AiSettings;
  clustering: ClusteringConfig;
  toggleAi: (key: keyof AiSettings) => void;
  updateClustering: (patch: Partial<ClusteringConfig>) => void;
}

const EcomerContext = createContext<EcomerState | null>(null);

export function EcomerProvider({ children }: {children: React.ReactNode;}) {
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

  const value = useMemo<EcomerState>(
    () => ({
      aiSettings,
      clustering,
      toggleAi,
      updateClustering
    }),
    [
    aiSettings,
    clustering,
    toggleAi,
    updateClustering]
  );

  return <EcomerContext.Provider value={value}>{children}</EcomerContext.Provider>;
}

export function useEcomer(): EcomerState {
  const ctx = useContext(EcomerContext);
  if (!ctx) throw new Error('useEcomer doit être utilisé dans EcomerProvider');
  return ctx;
}