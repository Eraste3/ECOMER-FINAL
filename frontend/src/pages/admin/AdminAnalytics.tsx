import React, { useState } from 'react';
import { toast } from 'sonner';
import { FileSpreadsheetIcon, FileTextIcon } from 'lucide-react';
import { KpiCard } from '../../components/cards/KpiCard';
import { ChartCard, RangeTabs } from '../../components/charts/ChartCard';
import { TrendChart } from '../../components/charts/TrendChart';
import { DonutChart } from '../../components/charts/DonutChart';
import { SeverityChart } from '../../components/charts/SeverityChart';
import { ImpactChart } from '../../components/charts/ImpactChart';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader } from '../../components/ui/Card';

// Mock data (replaces deleted mock-statistics)
const platformStats = {
  totalReports: 1247,
  avgProcessingDays: 3.2,
  cleanedAreaHa: 18.4,
  activeCitizens: 892
};

const processingDelay = [
  { label: 'Validation signalement', jours: 0.5 },
  { label: 'Clustering', jours: 0.8 },
  { label: 'Planification mission', jours: 1.2 },
  { label: 'Exécution', jours: 2.5 }
];

const reportsTrend7d: any[] = [];
const reportsTrend30d: any[] = [];
const reportsTrend3m: any[] = [];
const reportsTrendAll: any[] = [];

const wasteDistribution = [
  { label: 'Plastiques', value: 45, color: '#3b82f6' },
  { label: 'Ménagers', value: 28, color: '#f59e0b' },
  { label: 'Filets', value: 15, color: '#10b981' },
  { label: 'Divers', value: 12, color: '#8b5cf6' }
];

const ranges = ['7J', '30J', '3M', 'Tout'];

export function AdminAnalyticsPage() {
  const [range, setRange] = useState('3M');
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-slate-400">
          Analytique consolidée de la plateforme ECOMER — mars à août 2026
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline-dark"
            size="sm"
            icon={<FileTextIcon className="h-4 w-4" />}
            onClick={() => toast.success('Export PDF généré', { description: 'analytics-ecomer.pdf' })}>
            
            Exporter PDF
          </Button>
          <Button
            variant="outline-dark"
            size="sm"
            icon={<FileSpreadsheetIcon className="h-4 w-4" />}
            onClick={() => toast.success('Export XLSX généré', { description: 'analytics-ecomer.xlsx' })}>
            
            Exporter XLSX
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard tone="dark" label="Signalements" value={platformStats.totalReports} icon={<FileTextIcon className="h-4 w-4" />} accent="#22d3ee" index={0} />
        <KpiCard tone="dark" label="Délai moyen" value={platformStats.avgProcessingDays} suffix="j" icon={<FileTextIcon className="h-4 w-4" />} accent="#f59e0b" index={1} />
        <KpiCard tone="dark" label="Surface nettoyée" value={platformStats.cleanedAreaHa} suffix="ha" icon={<FileTextIcon className="h-4 w-4" />} accent="#14b8a6" index={2} />
        <KpiCard tone="dark" label="Citoyens actifs" value={platformStats.activeCitizens} icon={<FileTextIcon className="h-4 w-4" />} accent="#10b981" index={3} />
      </div>

      <ChartCard
        tone="dark"
        title="Évolution des signalements"
        subtitle="Comparaison signalements reçus / zones résolues"
        action={<RangeTabs value={range} onChange={setRange} options={ranges} tone="dark" />}>
        
        <TrendChart data={data} tone="dark" height={300} />
      </ChartCard>

      <div className="grid gap-4 xl:grid-cols-2">
        <ChartCard tone="dark" title="Répartition par type de pollution">
          <DonutChart
            tone="dark"
            data={wasteDistribution.map((w) => ({ label: w.label, value: w.value, color: w.color }))}
            centerLabel="Signalements" />
          
        </ChartCard>
        <ChartCard tone="dark" title="Répartition par gravité">
          <SeverityChart tone="dark" />
        </ChartCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <ChartCard tone="dark" title="Impact des interventions" subtitle="Tonnage collecté et surface nettoyée">
          <ImpactChart tone="dark" height={280} />
        </ChartCard>
        <Card tone="dark">
          <CardHeader tone="dark" title="Délai moyen de traitement" subtitle="Du signalement à l’autorisation" />
          <ul className="space-y-3 p-5">
            {processingDelay.map((d) =>
            <li key={d.label}>
                <div className="mb-1.5 flex items-baseline justify-between text-xs">
                  <span className="text-slate-300">{d.label}</span>
                  <span className="font-display font-bold text-white">
                    {d.jours.toFixed(1).replace('.', ',')} j
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/5">
                  <div className="h-full rounded-full bg-cyan-ecomer" style={{ width: `${d.jours / 10 * 100}%` }} />
                </div>
              </li>
            )}
          </ul>
        </Card>
      </div>
    </div>);

}