import { useState, useEffect } from 'react';
import {
  Building2Icon,
  CheckCircle2Icon,
  FlagIcon,
  PercentIcon,
  ShapesIcon,
  EuroIcon,
  PackageIcon,
  TruckIcon } from
'lucide-react';
import { KpiCard } from '../../components/cards/KpiCard';
import { ChartCard, RangeTabs } from '../../components/charts/ChartCard';
import { TrendChart } from '../../components/charts/TrendChart';
import { DonutChart } from '../../components/charts/DonutChart';
import { SeverityChart } from '../../components/charts/SeverityChart';
import { Card, CardHeader } from '../../components/ui/Card';
import { MapView } from '../../components/maps/MapView';
import { MapLegend } from '../../components/maps/MapLegend';
import { SeverityBadge, StatusBadge } from '../../components/status/StatusBadge';
import { useSignalements } from '../../hooks/useSignalements';
import { useEcoshop } from '../../hooks/useEcoshop';
import { relativeTime } from '../../utils/format';
import { perimeterStatusMeta, reportStatusMeta, wasteMeta } from '../../utils/labels';

const ranges = ['7J', '30J', '3M', 'Tout'];

export function AdminDashboard() {
  const { getAllSignalements } = useSignalements();
  const { getCommandes, getLots } = useEcoshop();
  const [reports, setReports] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [lots, setLots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState('30J');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reportsData, ordersData, lotsData] = await Promise.all([
          getAllSignalements(),
          getCommandes(),
          getLots()
        ]);
        setReports(reportsData);
        setOrders(ordersData);
        setLots(lotsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [getAllSignalements, getCommandes, getLots]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-slate-500">Chargement...</p>
      </div>
    );
  }

  const perimeters: any[] = [];
  const platformStats = {
    totalReports: reports.length,
    activePerimeters: 0,
    resolvedZones: reports.filter(r => r.statut === 'resolu').length,
    partnerOngs: 5,
    resolutionRate: reports.length > 0 ? Math.round((reports.filter(r => r.statut === 'resolu').length / reports.length) * 100) : 0
  };

  // Financial KPIs
  const financialStats = {
    totalRevenue: orders.filter(o => o.statut === 'livree').reduce((sum: number, o: any) => sum + (o.montant || 0), 0),
    totalTonsSold: lots.filter(l => l.statut === 'vendu').reduce((sum: number, l: any) => sum + (l.quantite || 0), 0),
    activeLots: lots.filter(l => l.statut === 'disponible').length,
    pendingOrders: orders.filter(o => o.statut === 'en_attente').length
  };

  const wasteDistribution = [
    { label: 'Plastiques', value: reports.filter(r => r.typeDechet === 'plastiques').length, color: '#3b82f6' },
    { label: 'Ménagers', value: reports.filter(r => r.typeDechet === 'menagers').length, color: '#f59e0b' },
    { label: 'Hydrocarbures', value: reports.filter(r => r.typeDechet === 'hydrocarbures').length, color: '#ef4444' },
    { label: 'Filets', value: reports.filter(r => r.typeDechet === 'filets').length, color: '#10b981' },
    { label: 'Divers', value: reports.filter(r => r.typeDechet === 'divers').length, color: '#8b5cf6' }
  ];

  const data = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    reports: Math.floor(Math.random() * 10) + 1,
    resolved: Math.floor(Math.random() * 5)
  }));

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <KpiCard tone="dark" label="Total signalements" value={platformStats.totalReports} icon={<FlagIcon className="h-4 w-4" />} accent="#22d3ee" trend={{ value: 18, label: 'ce mois' }} index={0} />
        <KpiCard tone="dark" label="Périmètres actifs" value={platformStats.activePerimeters} icon={<ShapesIcon className="h-4 w-4" />} accent="#f97316" trend={{ value: 7, label: 'ce mois' }} index={1} />
        <KpiCard tone="dark" label="Zones résolues" value={platformStats.resolvedZones} icon={<CheckCircle2Icon className="h-4 w-4" />} accent="#10b981" trend={{ value: 12, label: 'ce mois' }} index={2} />
        <KpiCard tone="dark" label="ONG partenaires" value={platformStats.partnerOngs} icon={<Building2Icon className="h-4 w-4" />} accent="#14b8a6" index={3} />
        <KpiCard tone="dark" label="Taux de résolution" value={platformStats.resolutionRate} suffix="%" icon={<PercentIcon className="h-4 w-4" />} accent="#f59e0b" trend={{ value: 3, label: 'vs juillet' }} index={4} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard tone="dark" label="Revenus totaux" value={financialStats.totalRevenue} suffix="€" icon={<EuroIcon className="h-4 w-4" />} accent="#10b981" trend={{ value: 15, label: 'ce mois' }} index={0} />
        <KpiCard tone="dark" label="Tonnes vendues" value={financialStats.totalTonsSold} suffix="t" icon={<TruckIcon className="h-4 w-4" />} accent="#3b82f6" trend={{ value: 8, label: 'ce mois' }} index={1} />
        <KpiCard tone="dark" label="Lots disponibles" value={financialStats.activeLots} icon={<PackageIcon className="h-4 w-4" />} accent="#f97316" trend={{ value: 5, label: 'nouveaux' }} index={2} />
        <KpiCard tone="dark" label="Commandes en attente" value={financialStats.pendingOrders} icon={<CheckCircle2Icon className="h-4 w-4" />} accent="#f59e0b" index={3} />
      </div>

      <ChartCard
        tone="dark"
        title="Évolution des signalements"
        subtitle="Volume de signalements et zones résolues"
        action={<RangeTabs value={range} onChange={setRange} options={ranges} tone="dark" />}>
        
        <TrendChart data={data} tone="dark" height={300} />
      </ChartCard>

      <div className="grid gap-4 xl:grid-cols-2">
        <ChartCard tone="dark" title="Répartition par type de pollution" subtitle="Ensemble de la plateforme">
          <DonutChart
            tone="dark"
            data={wasteDistribution.map((w) => ({ label: w.label, value: w.value, color: w.color }))}
            centerLabel="Signalements" />
          
        </ChartCard>
        <ChartCard tone="dark" title="Répartition par gravité" subtitle="Périmètres de pollution">
          <SeverityChart tone="dark" />
        </ChartCard>
      </div>

      <Card tone="dark" className="overflow-hidden">
        <CardHeader
          tone="dark"
          title="Carte de Pointe-Noire — heatmap des pollutions"
          subtitle="Densité de signalements et périmètres générés par clustering spatial" />
        
        <div className="relative aspect-[16/9]">
          <MapView perimeters={perimeters} reports={reports} showHeatmap tone="dark" />
          <MapLegend tone="dark" className="absolute bottom-3 left-3" />
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card tone="dark">
          <CardHeader tone="dark" title="Derniers signalements" subtitle="Flux temps réel" />
          <ul className="divide-y divide-white/5">
            {reports.slice(0, 6).map((r) => {
              const wasteType = r.typeDechet || 'plastiques';
              const status = r.statut || 'en_attente';
              return (
                <li key={r.id} className="flex items-center gap-3 px-5 py-3">
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[9px] font-bold"
                    style={{
                      backgroundColor: `${wasteMeta[wasteType as keyof typeof wasteMeta]?.color || '#3b82f6'}26`,
                      color: wasteMeta[wasteType as keyof typeof wasteMeta]?.color || '#3b82f6'
                    }}>
                    {wasteMeta[wasteType as keyof typeof wasteMeta]?.short.slice(0, 3).toUpperCase() || 'WAS'}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold text-white">
                      Signalement #{r.id} · {r.zone || 'Zone inconnue'}
                    </p>
                    <p className="truncate text-[11px] text-slate-400">
                      {r.authorName || 'Anonyme'} · {relativeTime(r.createdAt)}
                    </p>
                  </div>
                  <StatusBadge
                    label={reportStatusMeta[status as keyof typeof reportStatusMeta]?.label || status}
                    tone={reportStatusMeta[status as keyof typeof reportStatusMeta]?.tone || 'neutral'}
                    dark />
                </li>
              );
            })}
          </ul>
        </Card>

        <Card tone="dark">
          <CardHeader tone="dark" title="Périmètres récents" subtitle="Générés par le moteur spatial" />
          <ul className="divide-y divide-white/5">
            {perimeters.length === 0 ? (
              <li className="px-5 py-8 text-center text-slate-400">
                Aucun périmètre disponible
              </li>
            ) : (
              perimeters.slice(0, 6).map((p) =>
                <li key={p.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold text-white">
                      {p.id} · {p.zone}
                    </p>
                    <p className="truncate text-[11px] text-slate-400">
                      {p.reportCount} signalements · {perimeterStatusMeta[p.status as keyof typeof perimeterStatusMeta]?.label || p.status}
                    </p>
                  </div>
                  <SeverityBadge severity={p.severity} dark />
                </li>
              )
            )}
          </ul>
        </Card>
      </div>
    </div>);

}