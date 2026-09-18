import React, { useState } from 'react';
import {
  ClockIcon,
  FlagIcon,
  PercentIcon,
  ShapesIcon,
  SprayCanIcon,
  TruckIcon,
  UsersIcon,
  WavesIcon } from
'lucide-react';
import { KpiCard } from '../../components/cards/KpiCard';
import { ChartCard, RangeTabs } from '../../components/charts/ChartCard';
import { TrendChart } from '../../components/charts/TrendChart';
import { DonutChart } from '../../components/charts/DonutChart';
import { SeverityChart } from '../../components/charts/SeverityChart';
import { ImpactChart } from '../../components/charts/ImpactChart';
import { Card, CardHeader } from '../../components/ui/Card';
import {
  platformStats,
  processingDelay,
  reportsTrend30d,
  reportsTrend3m,
  reportsTrend7d,
  reportsTrendAll,
  wasteDistribution } from
'../../data/mock-statistics';

const ranges = ['7J', '30J', '3M', 'Tout'];

export function DirEnvKpiPage() {
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
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Signalements reçus" value={platformStats.totalReports} icon={<FlagIcon className="h-4 w-4" />} accent="#22d3ee" index={0} />
        <KpiCard label="Périmètres générés" value={platformStats.activePerimeters} icon={<ShapesIcon className="h-4 w-4" />} accent="#1273b8" index={1} />
        <KpiCard label="Délai moyen de traitement" value={platformStats.avgProcessingDays} suffix="jours" icon={<ClockIcon className="h-4 w-4" />} accent="#f59e0b" index={2} />
        <KpiCard label="Taux de résolution" value={platformStats.resolutionRate} suffix="%" icon={<PercentIcon className="h-4 w-4" />} accent="#10b981" index={3} />
        <KpiCard label="Surface polluée" value={platformStats.pollutedAreaHa} suffix="ha" icon={<WavesIcon className="h-4 w-4" />} accent="#ef4444" index={4} />
        <KpiCard label="Surface nettoyée" value={platformStats.cleanedAreaHa} suffix="ha" icon={<SprayCanIcon className="h-4 w-4" />} accent="#14b8a6" index={5} />
        <KpiCard label="Interventions ONG" value={platformStats.ongInterventions} icon={<UsersIcon className="h-4 w-4" />} accent="#0e4f7d" index={6} />
        <KpiCard label="Interventions municipales" value={platformStats.municipalInterventions} icon={<TruckIcon className="h-4 w-4" />} accent="#f97316" index={7} />
      </div>

      <ChartCard
        title="Évolution des signalements"
        subtitle="Signalements reçus et zones résolues"
        action={<RangeTabs value={range} onChange={setRange} options={ranges} />}>
        
        <TrendChart data={data} height={300} />
      </ChartCard>

      <div className="grid gap-4 xl:grid-cols-2">
        <ChartCard title="Répartition par type de déchets" subtitle="Sur l’ensemble des signalements">
          <DonutChart data={wasteDistribution.map((w) => ({ label: w.label, value: w.value, color: w.color }))} centerLabel="Signalements" />
        </ChartCard>
        <ChartCard title="Répartition par gravité" subtitle="Périmètres de pollution actifs">
          <SeverityChart />
        </ChartCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <ChartCard title="Évolution des zones résolues" subtitle="Surface nettoyée et tonnage collecté">
          <ImpactChart height={280} />
        </ChartCard>
        <Card>
          <CardHeader title="Délai moyen de traitement" subtitle="Du signalement à l’autorisation (jours)" />
          <ul className="space-y-3 p-5">
            {processingDelay.map((d) =>
            <li key={d.label}>
                <div className="mb-1.5 flex items-baseline justify-between text-xs">
                  <span className="font-medium text-slate-600">{d.label}</span>
                  <span className="font-display font-bold text-navy">
                    {d.jours.toFixed(1).replace('.', ',')} j
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                  className="h-full rounded-full bg-ocean"
                  style={{ width: `${d.jours / 10 * 100}%` }} />
                
                </div>
              </li>
            )}
          </ul>
          <div className="border-t border-hairline px-5 py-3">
            <p className="text-[11px] text-slate-500">
              Objectif municipal : traitement sous 5 jours ouvrés — atteint depuis juillet 2026.
            </p>
          </div>
        </Card>
      </div>
    </div>);

}