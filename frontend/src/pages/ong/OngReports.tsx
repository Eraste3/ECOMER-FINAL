import React from 'react';
import { toast } from 'sonner';
import { FileSpreadsheetIcon, FileTextIcon } from 'lucide-react';
import { KpiCard } from '../../components/cards/KpiCard';
import { ChartCard } from '../../components/charts/ChartCard';
import { ImpactChart } from '../../components/charts/ImpactChart';
import { DonutChart } from '../../components/charts/DonutChart';
import { TrendChart } from '../../components/charts/TrendChart';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader } from '../../components/ui/Card';
import { DataTable, type Column } from '../../components/tables/DataTable';
import { StatusBadge } from '../../components/status/StatusBadge';
import { useEcomer } from '../../contexts/EcomerContext';
import { formatArea, formatDate } from '../../utils/format';
import { interventionStatusMeta, wasteMeta } from '../../utils/labels';
import { reportsTrend3m, wasteDistribution } from '../../data/mock-statistics';
import type { Intervention } from '../../types';

export function OngReportsPage() {
  const { interventions } = useEcomer();
  const mine = interventions.filter((i) => i.operatorType === 'ong');
  const done = mine.filter((i) => i.status === 'terminee' || i.status === 'validee');
  const surface = done.reduce((s, i) => s + i.areaM2, 0);
  const tons = done.reduce((s, i) => s + (i.collectedTons ?? 0), 0);
  const rate = Math.round(done.length / Math.max(1, mine.length) * 100);

  const columns: Array<Column<Intervention>> = [
  { key: 'id', header: 'Intervention', render: (i) => i.id },
  { key: 'zone', header: 'Zone', render: (i) => i.zone },
  { key: 'per', header: 'Périmètre', render: (i) => i.perimeterId, hideOn: 'sm' },
  { key: 'area', header: 'Surface nettoyée', render: (i) => formatArea(i.areaM2), hideOn: 'md' },
  {
    key: 'tons',
    header: 'Déchets',
    render: (i) => i.collectedTons ? `${i.collectedTons.toFixed(1).replace('.', ',')} t` : '—'
  },
  { key: 'date', header: 'Date', render: (i) => formatDate(i.startDate), hideOn: 'lg' },
  {
    key: 'status',
    header: 'Statut',
    render: (i) =>
    <StatusBadge
      label={interventionStatusMeta[i.status].label}
      tone={interventionStatusMeta[i.status].tone} />


  }];


  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-bold text-navy">Rapports d’impact</h2>
          <p className="text-xs text-slate-500">Océan Propre Congo — période mars à août 2026</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            icon={<FileTextIcon className="h-4 w-4" />}
            onClick={() => toast.success('Export PDF généré', { description: 'rapport-impact-ong.pdf' })}>
            
            Exporter PDF
          </Button>
          <Button
            variant="secondary"
            icon={<FileSpreadsheetIcon className="h-4 w-4" />}
            onClick={() => toast.success('Export XLSX généré', { description: 'rapport-impact-ong.xlsx' })}>
            
            Exporter XLSX
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Interventions réalisées"
          value={done.length + 25}
          icon={<FileTextIcon className="h-4 w-4" />}
          accent="#1273b8"
          index={0} />
        
        <KpiCard
          label="Surface nettoyée"
          value={Number(((surface + 184000) / 10000).toFixed(1))}
          suffix="ha"
          icon={<FileSpreadsheetIcon className="h-4 w-4" />}
          accent="#14b8a6"
          index={1} />
        
        <KpiCard
          label="Déchets collectés"
          value={Number((tons + 38.4).toFixed(1))}
          suffix="t"
          icon={<FileTextIcon className="h-4 w-4" />}
          accent="#f97316"
          index={2} />
        
        <KpiCard
          label="Taux de résolution"
          value={rate}
          suffix="%"
          icon={<FileTextIcon className="h-4 w-4" />}
          accent="#10b981"
          index={3} />
        
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <ChartCard title="Évolution mensuelle" subtitle="Tonnes collectées et surface nettoyée">
          <ImpactChart />
        </ChartCard>
        <ChartCard title="Répartition par type de déchets" subtitle="Signalements traités dans nos zones">
          <DonutChart data={wasteDistribution.map((w) => ({ label: w.label, value: w.value, color: w.color }))} centerLabel="Signalements" />
        </ChartCard>
      </div>

      <ChartCard title="Signalements couverts" subtitle="Périodes bimensuelles">
        <TrendChart data={reportsTrend3m} />
      </ChartCard>

      <Card>
        <CardHeader title="Détail des interventions" subtitle="Base du rapport exporté" />
        <DataTable columns={columns} rows={mine} />
      </Card>

      <div className="rounded-xl bg-white p-5 ring-1 ring-hairline shadow-card">
        <h3 className="font-display text-sm font-semibold text-navy">Synthèse par type dominant</h3>
        <ul className="mt-4 grid gap-2 sm:grid-cols-3">
          {wasteDistribution.slice(0, 3).map((w) =>
          <li key={w.type} className="rounded-lg bg-surface p-4 ring-1 ring-hairline">
              <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: w.color }}>
                {wasteMeta[w.type].short}
              </p>
              <p className="mt-1 font-display text-xl font-bold text-navy">{w.value}</p>
              <p className="text-[11px] text-slate-500">signalements traités</p>
            </li>
          )}
        </ul>
      </div>
    </div>);

}