import React, { useState } from 'react';
import {
  Building2Icon,
  CheckCircle2Icon,
  FlagIcon,
  PercentIcon,
  ShapesIcon } from
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
import { useEcomer } from '../../contexts/EcomerContext';
import { relativeTime } from '../../utils/format';
import { perimeterStatusMeta, reportStatusMeta, wasteMeta } from '../../utils/labels';
import {
  platformStats,
  reportsTrend30d,
  reportsTrend3m,
  reportsTrend7d,
  reportsTrendAll,
  wasteDistribution } from
'../../data/mock-statistics';

const ranges = ['7J', '30J', '3M', 'Tout'];

export function AdminDashboard() {
  const { perimeters, reports } = useEcomer();
  const [range, setRange] = useState('30J');

  const data =
  range === '7J' ?
  reportsTrend7d :
  range === '30J' ?
  reportsTrend30d :
  range === '3M' ?
  reportsTrend3m :
  reportsTrendAll;

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <KpiCard tone="dark" label="Total signalements" value={platformStats.totalReports} icon={<FlagIcon className="h-4 w-4" />} accent="#22d3ee" trend={{ value: 18, label: 'ce mois' }} index={0} />
        <KpiCard tone="dark" label="Périmètres actifs" value={platformStats.activePerimeters} icon={<ShapesIcon className="h-4 w-4" />} accent="#f97316" trend={{ value: 7, label: 'ce mois' }} index={1} />
        <KpiCard tone="dark" label="Zones résolues" value={platformStats.resolvedZones} icon={<CheckCircle2Icon className="h-4 w-4" />} accent="#10b981" trend={{ value: 12, label: 'ce mois' }} index={2} />
        <KpiCard tone="dark" label="ONG partenaires" value={platformStats.partnerOngs} icon={<Building2Icon className="h-4 w-4" />} accent="#14b8a6" index={3} />
        <KpiCard tone="dark" label="Taux de résolution" value={platformStats.resolutionRate} suffix="%" icon={<PercentIcon className="h-4 w-4" />} accent="#f59e0b" trend={{ value: 3, label: 'vs juillet' }} index={4} />
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
            {reports.slice(0, 6).map((r) =>
            <li key={r.id} className="flex items-center gap-3 px-5 py-3">
                <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[9px] font-bold"
                style={{
                  backgroundColor: `${wasteMeta[r.wasteType].color}26`,
                  color: wasteMeta[r.wasteType].color
                }}>
                
                  {wasteMeta[r.wasteType].short.slice(0, 3).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold text-white">
                    {r.id} · {r.zone}
                  </p>
                  <p className="truncate text-[11px] text-slate-400">
                    {r.authorName} · {relativeTime(r.createdAt)}
                  </p>
                </div>
                <StatusBadge
                label={reportStatusMeta[r.status].label}
                tone={reportStatusMeta[r.status].tone}
                dark />
              
              </li>
            )}
          </ul>
        </Card>

        <Card tone="dark">
          <CardHeader tone="dark" title="Périmètres récents" subtitle="Générés par le moteur spatial" />
          <ul className="divide-y divide-white/5">
            {perimeters.slice(0, 6).map((p) =>
            <li key={p.id} className="flex items-center gap-3 px-5 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold text-white">
                    {p.id} · {p.zone}
                  </p>
                  <p className="truncate text-[11px] text-slate-400">
                    {p.reportCount} signalements · {perimeterStatusMeta[p.status].label}
                  </p>
                </div>
                <SeverityBadge severity={p.severity} dark />
              </li>
            )}
          </ul>
        </Card>
      </div>
    </div>);

}