import React, { useState } from 'react';
import { LayoutListIcon, MapIcon } from 'lucide-react';
import { Card, CardHeader } from '../../components/ui/Card';
import { DataTable, type Column } from '../../components/tables/DataTable';
import { SeverityBadge, StatusBadge } from '../../components/status/StatusBadge';
import { MapView } from '../../components/maps/MapView';
import { MapLegend } from '../../components/maps/MapLegend';
import { PerimeterCard } from '../../components/cards/PerimeterCard';
import { useEcomer } from '../../contexts/EcomerContext';
import { formatArea, formatDate } from '../../utils/format';
import { perimeterStatusMeta } from '../../utils/labels';
import { mockOngs } from '../../data/mock-ongs';
import type { Perimeter } from '../../types';

export function AdminPerimetersPage() {
  const { perimeters } = useEcomer();
  const [view, setView] = useState<'liste' | 'carte'>('liste');
  const [selected, setSelected] = useState<Perimeter | null>(perimeters[0] ?? null);

  const columns: Array<Column<Perimeter>> = [
  { key: 'id', header: 'ID périmètre', render: (p) => <span className="font-semibold text-white">{p.id}</span> },
  { key: 'zone', header: 'Zone', render: (p) => p.zone },
  { key: 'count', header: 'Signalements', render: (p) => p.reportCount, hideOn: 'sm' },
  { key: 'area', header: 'Surface', render: (p) => formatArea(p.areaM2), hideOn: 'md' },
  { key: 'sev', header: 'Gravité', render: (p) => <SeverityBadge severity={p.severity} dark /> },
  {
    key: 'status',
    header: 'Statut',
    render: (p) =>
    <StatusBadge label={perimeterStatusMeta[p.status].label} tone={perimeterStatusMeta[p.status].tone} dark />

  },
  { key: 'date', header: 'Date', render: (p) => formatDate(p.createdAt), hideOn: 'lg' },
  {
    key: 'ong',
    header: 'ONG affectée',
    hideOn: 'lg',
    render: (p) =>
    p.assignedOngId ? mockOngs.find((o) => o.id === p.assignedOngId)?.name ?? '—' :
    <span className="text-slate-500">Non affecté</span>

  }];


  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
        ['Total périmètres', perimeters.length],
        ['En intervention', perimeters.filter((p) => p.status === 'en_intervention').length],
        ['En validation', perimeters.filter((p) => p.status === 'en_validation').length],
        ['Résolus', perimeters.filter((p) => p.status === 'resolu').length]].
        map(([k, v]) =>
        <div key={k as string} className="glass-dark rounded-xl p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{k}</p>
            <p className="mt-1 font-display text-2xl font-bold text-white">{v}</p>
          </div>
        )}
      </div>

      <Card tone="dark">
        <CardHeader
          tone="dark"
          title="Clusters générés par le moteur spatial"
          subtitle="Chaque périmètre regroupe des signalements proches dans le temps et l’espace"
          action={
          <div className="inline-flex rounded-lg bg-white/5 p-0.5 ring-1 ring-inset ring-white/10">
              {(['liste', 'carte'] as const).map((v) =>
            <button
              key={v}
              onClick={() => setView(v)}
              className={`inline-flex items-center gap-1.5 rounded-[6px] px-2.5 py-1 text-[11px] font-semibold transition-colors ${
              view === v ? 'bg-eco-orange text-white' : 'text-slate-400 hover:text-white'}`
              }>
              
                  {v === 'liste' ? <LayoutListIcon className="h-3.5 w-3.5" /> : <MapIcon className="h-3.5 w-3.5" />}
                  {v === 'liste' ? 'Liste' : 'Carte'}
                </button>
            )}
            </div>
          } />
        

        {view === 'liste' ?
        <DataTable columns={columns} rows={perimeters} tone="dark" onRowClick={setSelected} /> :

        <div className="grid gap-4 p-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
            <div className="relative overflow-hidden rounded-xl border border-white/10 bg-abyss">
              <div className="relative aspect-[16/11]">
                <MapView
                perimeters={perimeters}
                selectedPerimeterId={selected?.id ?? null}
                onSelectPerimeter={setSelected}
                showHeatmap
                tone="dark" />
              
                <MapLegend tone="dark" className="absolute bottom-3 left-3" />
              </div>
            </div>
            <ul className="ecomer-scroll max-h-[520px] space-y-2 overflow-y-auto">
              {perimeters.map((p) =>
            <li key={p.id}>
                  <PerimeterCard
                perimeter={p}
                tone="dark"
                active={selected?.id === p.id}
                onClick={() => setSelected(p)} />
              
                </li>
            )}
            </ul>
          </div>
        }
      </Card>
    </div>);

}