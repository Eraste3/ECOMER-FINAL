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
import { useMissions } from '../../hooks/useMissions';
import { useStockage } from '../../hooks/useStockage';
import { formatArea, formatDate } from '../../utils/format';
import { missionStatusMeta, wasteMeta } from '../../utils/labels';

const reportsTrend3m: any[] = [];

export function EcomerReportsPage() {
  const { missions, loading: missionsLoading } = useMissions();
  const { entries, loading: stockLoading } = useStockage();
  const done = missions.filter((m: any) => m.status === 'terminee');
  const surface = done.reduce((s: number, m: any) => s + (m.areaM2 || 0), 0);
  const tons = done.reduce((s: number, m: any) => s + (m.actualTons || 0), 0);
  const rate = Math.round(done.length / Math.max(1, missions.length) * 100);

  if (missionsLoading || stockLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-slate-500">Chargement...</p>
      </div>
    );
  }

  // Calculate waste distribution from real data
  const wasteDistributionData = [
    { type: 'plastiques', value: done.filter((m: any) => m.wasteTypes?.includes('plastiques')).length, color: '#3b82f6' },
    { type: 'menagers', value: done.filter((m: any) => m.wasteTypes?.includes('menagers')).length, color: '#f59e0b' },
    { type: 'filets', value: done.filter((m: any) => m.wasteTypes?.includes('filets')).length, color: '#10b981' },
    { type: 'divers', value: done.filter((m: any) => m.wasteTypes?.includes('divers')).length, color: '#8b5cf6' }
  ];

  const columns: Array<Column<any>> = [
  { key: 'id', header: 'Mission', render: (m) => m.id },
  { key: 'zone', header: 'Zone', render: (m) => m.zone },
  { key: 'per', header: 'Périmètre', render: (m) => m.perimeterId, hideOn: 'sm' },
  { key: 'area', header: 'Surface nettoyée', render: (m) => formatArea(m.areaM2 || 0), hideOn: 'md' },
  {
    key: 'tons',
    header: 'Déchets',
    render: (m) => m.actualTons ? `${m.actualTons.toFixed(1).replace('.', ',')} t` : '—'
  },
  { key: 'date', header: 'Date', render: (m) => formatDate(m.startDate), hideOn: 'lg' },
  {
    key: 'status',
    header: 'Statut',
    render: (m) =>
    <StatusBadge
      label={missionStatusMeta[m.status as keyof typeof missionStatusMeta]?.label || m.status}
      tone={missionStatusMeta[m.status as keyof typeof missionStatusMeta]?.tone || 'neutral'} />
  }];


  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-bold text-navy">Rapports d’impact ECOMER</h2>
          <p className="text-xs text-slate-500">ECOMER — période mars à août 2026</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            icon={<FileTextIcon className="h-4 w-4" />}
            onClick={() => toast.success('Export PDF généré', { description: 'rapport-impact-ecomer.pdf' })}>
            
            Exporter PDF
          </Button>
          <Button
            variant="secondary"
            icon={<FileSpreadsheetIcon className="h-4 w-4" />}
            onClick={() => toast.success('Export XLSX généré', { description: 'rapport-impact-ecomer.xlsx' })}>
            
            Exporter XLSX
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Missions réalisées"
          value={done.length}
          icon={<FileTextIcon className="h-4 w-4" />}
          accent="#1273b8"
          index={0} />
        
        <KpiCard
          label="Surface nettoyée"
          value={Number((surface / 10000).toFixed(1))}
          suffix="ha"
          icon={<FileSpreadsheetIcon className="h-4 w-4" />}
          accent="#14b8a6"
          index={1} />
        
        <KpiCard
          label="Déchets collectés"
          value={Number(tons.toFixed(1))}
          suffix="t"
          icon={<FileTextIcon className="h-4 w-4" />}
          accent="#f97316"
          index={2} />
        
        <KpiCard
          label="Taux de réussite"
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
        <ChartCard title="Répartition par type de déchets" subtitle="Basé sur les missions terminées">
          <DonutChart
            tone="light"
            data={wasteDistributionData.map((w) => ({ label: wasteMeta[w.type as keyof typeof wasteMeta]?.label || w.type, value: w.value, color: w.color }))}
            centerLabel="Missions" />
          
        </ChartCard>
      </div>

      <ChartCard title="Signalements couverts" subtitle="Périodes bimensuelles">
        <TrendChart data={reportsTrend3m} />
      </ChartCard>

      <Card>
        <CardHeader title="Détail des missions" subtitle="Base du rapport exporté" />
        <DataTable columns={columns} rows={missions} />
      </Card>

      <div className="rounded-xl bg-white p-5 ring-1 ring-hairline shadow-card">
        <h3 className="font-display text-sm font-semibold text-navy">Synthèse par type dominant</h3>
        <ul className="mt-4 grid gap-2 sm:grid-cols-3">
          {wasteDistributionData.slice(0, 3).map((w: any) =>
          <li key={w.type} className="rounded-lg bg-surface p-4 ring-1 ring-hairline">
              <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: w.color }}>
                {wasteMeta[w.type as keyof typeof wasteMeta]?.short || w.type}
              </p>
              <p className="mt-1 font-display text-xl font-bold text-navy">{w.value}</p>
              <p className="text-[11px] text-slate-500">missions terminées</p>
            </li>
          )}
        </ul>
      </div>
    </div>);

}
