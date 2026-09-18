import React from 'react';
import { WavesIcon } from 'lucide-react';
import { Card, CardHeader } from '../../components/ui/Card';
import { DataTable, type Column } from '../../components/tables/DataTable';
import { SeverityBadge } from '../../components/status/StatusBadge';
import { MapView } from '../../components/maps/MapView';
import { MapLegend } from '../../components/maps/MapLegend';
import { useEcomer } from '../../contexts/EcomerContext';
import { ZONE_SHAPES } from '../../data/mock-geo';
import { formatArea } from '../../utils/format';
import { severityMeta, severityOrder, wasteMeta } from '../../utils/labels';
import type { Severity, ZoneName } from '../../types';

interface ZoneRow {
  id: string;
  zone: ZoneName;
  coastal: boolean;
  reports: number;
  perimeters: number;
  resolved: number;
  areaM2: number;
  severity: Severity;
  dominant: string;
}

export function AdminZonesPage() {
  const { perimeters, reports } = useEcomer();

  const rows: ZoneRow[] = ZONE_SHAPES.map((z) => {
    const zonePerimeters = perimeters.filter((p) => p.zone === z.name);
    const zoneReports = reports.filter((r) => r.zone === z.name);
    const worst = zonePerimeters.reduce<Severity>((acc, p) => {
      return severityOrder.indexOf(p.severity) > severityOrder.indexOf(acc) ? p.severity : acc;
    }, 'faible');
    const counts = zoneReports.reduce<Record<string, number>>((acc, r) => {
      acc[r.wasteType] = (acc[r.wasteType] ?? 0) + 1;
      return acc;
    }, {});
    const dominant = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
    return {
      id: z.name,
      zone: z.name,
      coastal: z.coastal,
      reports: zoneReports.length,
      perimeters: zonePerimeters.length,
      resolved: zonePerimeters.filter((p) => p.status === 'resolu').length,
      areaM2: zonePerimeters.reduce((s, p) => s + p.areaM2, 0),
      severity: worst,
      dominant: dominant ? wasteMeta[dominant as keyof typeof wasteMeta].short : '—'
    };
  });

  const columns: Array<Column<ZoneRow>> = [
  {
    key: 'zone',
    header: 'Zone',
    render: (z) =>
    <div className="flex items-center gap-2">
          <span className="font-semibold text-white">{z.zone}</span>
          {z.coastal &&
      <span className="inline-flex items-center gap-1 rounded-full bg-cyan-ecomer/10 px-2 py-0.5 text-[10px] font-bold text-cyan-ecomer">
              <WavesIcon className="h-3 w-3" />
              Côtière
            </span>
      }
        </div>

  },
  { key: 'reports', header: 'Signalements', render: (z) => z.reports },
  { key: 'per', header: 'Périmètres', render: (z) => z.perimeters, hideOn: 'sm' },
  { key: 'resolved', header: 'Résolus', render: (z) => z.resolved, hideOn: 'md' },
  { key: 'area', header: 'Surface polluée', render: (z) => formatArea(z.areaM2), hideOn: 'md' },
  { key: 'dominant', header: 'Type dominant', render: (z) => z.dominant, hideOn: 'lg' },
  { key: 'sev', header: 'Gravité max', render: (z) => <SeverityBadge severity={z.severity} dark /> }];


  return (
    <div className="space-y-4">
      <Card tone="dark" className="overflow-hidden">
        <CardHeader
          tone="dark"
          title="Zones & pollution — agglomération de Pointe-Noire"
          subtitle="Quartiers, littoral, lagune et cours d’eau surveillés" />
        
        <div className="relative aspect-[16/9]">
          <MapView perimeters={perimeters} reports={reports} showHeatmap tone="dark" />
          <MapLegend tone="dark" className="absolute bottom-3 left-3" />
        </div>
      </Card>

      <Card tone="dark">
        <CardHeader tone="dark" title="Synthèse par zone" subtitle={`${rows.length} zones administratives`} />
        <DataTable columns={columns} rows={rows} tone="dark" />
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {severityOrder.map((s) =>
        <div key={s} className="glass-dark rounded-xl p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: severityMeta[s].color }}>
              Zones — gravité {severityMeta[s].label}
            </p>
            <p className="mt-1 font-display text-2xl font-bold text-white">
              {rows.filter((r) => r.severity === s).length}
            </p>
          </div>
        )}
      </div>
    </div>);

}