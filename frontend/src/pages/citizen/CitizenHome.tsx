import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRightIcon,
  CrosshairIcon,
  LayersIcon,
  ListChecksIcon,
  MapPinIcon,
  SparklesIcon } from
'lucide-react';
import { MapView } from '../../components/maps/MapView';
import { MapLegend } from '../../components/maps/MapLegend';
import { Button } from '../../components/ui/Button';
import { SeverityBadge, StatusBadge } from '../../components/status/StatusBadge';
import { useEcomer } from '../../contexts/EcomerContext';
import { formatArea, relativeTime } from '../../utils/format';
import { reportStatusMeta, wasteMeta } from '../../utils/labels';
import { CITIZEN_POSITION } from '../../data/citizen';
import type { Perimeter } from '../../types';

const filters = [
{ key: 'perimetres', label: 'Périmètres' },
{ key: 'signalements', label: 'Signalements' },
{ key: 'resolues', label: 'Zones nettoyées' },
{ key: 'heatmap', label: 'Heatmap' }] as
const;

type FilterKey = (typeof filters)[number]['key'];

export function CitizenHome() {
  const { perimeters, reports, ecoPoints } = useEcomer();
  const [active, setActive] = useState<FilterKey[]>(['perimetres', 'signalements', 'resolues']);
  const [selected, setSelected] = useState<Perimeter | null>(null);

  const toggle = (k: FilterKey) =>
  setActive((prev) => prev.includes(k) ? prev.filter((f) => f !== k) : [...prev, k]);

  const myReports = reports.filter((r) => r.authorRole === 'citoyen').slice(0, 4);

  const nearby = useMemo(
    () =>
    [...perimeters].
    filter((p) => p.status !== 'resolu').
    sort(
      (a, b) =>
      Math.hypot(a.centroid.x - CITIZEN_POSITION.x, a.centroid.y - CITIZEN_POSITION.y) -
      Math.hypot(b.centroid.x - CITIZEN_POSITION.x, b.centroid.y - CITIZEN_POSITION.y)
    ).
    slice(0, 4),
    [perimeters]
  );

  return (
    <div className="space-y-4 sm:space-y-5">
      <section className="bg-navy px-4 py-5 sm:rounded-xl sm:px-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-cyan-ecomer">
              Bonjour Divine 👋
            </p>
            <h2 className="mt-1 font-display text-xl font-bold text-white">
              Que se passe-t-il autour de vous ?
            </h2>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
              <MapPinIcon className="h-3.5 w-3.5" />
              Ngambio, Pointe-Noire · position détectée
            </p>
          </div>
          <div className="flex gap-2">
            <div className="rounded-lg bg-white/5 px-4 py-2.5 ring-1 ring-inset ring-white/10">
              <p className="text-[10px] uppercase tracking-wider text-slate-400">EcoPoints</p>
              <p className="font-display text-lg font-bold text-cyan-ecomer">{ecoPoints}</p>
            </div>
            <div className="rounded-lg bg-white/5 px-4 py-2.5 ring-1 ring-inset ring-white/10">
              <p className="text-[10px] uppercase tracking-wider text-slate-400">Mes signalements</p>
              <p className="font-display text-lg font-bold text-white">
                {reports.filter((r) => r.authorId === 'USR-1042').length}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-navy sm:rounded-xl">
        <div className="flex items-center gap-2 overflow-x-auto border-b border-white/10 px-3 py-2.5">
          {filters.map((f) =>
          <button
            key={f.key}
            onClick={() => toggle(f.key)}
            aria-pressed={active.includes(f.key)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors ${
            active.includes(f.key) ?
            'bg-cyan-ecomer/15 text-cyan-ecomer ring-1 ring-inset ring-cyan-ecomer/30' :
            'bg-white/5 text-slate-400 ring-1 ring-inset ring-white/10'}`
            }>
            
              {f.label}
            </button>
          )}
          <span className="ml-auto hidden shrink-0 items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500 sm:flex">
            <LayersIcon className="h-3.5 w-3.5" />
            Clustering spatial actif
          </span>
        </div>

        <div className="relative aspect-[4/5] sm:aspect-[16/9]">
          <MapView
            perimeters={active.includes('perimetres') ? perimeters : []}
            reports={active.includes('signalements') ? reports : []}
            showResolved={active.includes('resolues')}
            showHeatmap={active.includes('heatmap')}
            userPosition={CITIZEN_POSITION}
            selectedPerimeterId={selected?.id ?? null}
            onSelectPerimeter={setSelected}
            tone="dark" />
          
          <MapLegend tone="dark" className="absolute bottom-3 left-3 max-w-[45%]" />
          <button
            className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-lg glass-dark text-cyan-ecomer"
            aria-label="Recentrer sur ma position">
            
            <CrosshairIcon className="h-4 w-4" />
          </button>

          {selected &&
          <div className="absolute inset-x-3 bottom-3 rounded-xl glass-dark p-4 sm:left-auto sm:right-3 sm:w-72">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-display text-sm font-bold text-white">{selected.id}</p>
                  <p className="text-[11px] text-slate-400">{selected.zone}</p>
                </div>
                <SeverityBadge severity={selected.severity} dark />
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <dt className="text-slate-500">Signalements</dt>
                  <dd className="font-semibold text-white">{selected.reportCount}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Surface</dt>
                  <dd className="font-semibold text-white">{formatArea(selected.areaM2)}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Type dominant</dt>
                  <dd className="font-semibold text-white">{wasteMeta[selected.dominantWaste].short}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Créé</dt>
                  <dd className="font-semibold text-white">{relativeTime(selected.createdAt)}</dd>
                </div>
              </dl>
            </div>
          }
        </div>
      </section>

      <div className="grid gap-4 px-4 sm:px-0 lg:grid-cols-2">
        <section className="rounded-xl bg-white p-5 ring-1 ring-hairline shadow-card">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-semibold text-navy">Signalements récents</h3>
            <Link
              to="/citoyens/mes-signalements"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-ocean hover:underline">
              
              Tout voir
              <ArrowRightIcon className="h-3 w-3" />
            </Link>
          </div>
          <ul className="mt-4 space-y-2">
            {myReports.map((r) =>
            <li key={r.id} className="flex items-center gap-3 rounded-lg bg-surface p-3 ring-1 ring-hairline">
                <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold"
                style={{
                  backgroundColor: `${wasteMeta[r.wasteType].color}1f`,
                  color: wasteMeta[r.wasteType].color
                }}>
                
                  {wasteMeta[r.wasteType].short.slice(0, 3).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold text-navy">{r.id}</p>
                  <p className="truncate text-[11px] text-slate-500">
                    {r.zone} · {relativeTime(r.createdAt)}
                  </p>
                </div>
                <StatusBadge
                label={reportStatusMeta[r.status].label}
                tone={reportStatusMeta[r.status].tone} />
              
              </li>
            )}
          </ul>
        </section>

        <section className="rounded-xl bg-white p-5 ring-1 ring-hairline shadow-card">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-semibold text-navy">Périmètres proches de vous</h3>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
              <SparklesIcon className="h-3.5 w-3.5" />
              IA
            </span>
          </div>
          <ul className="mt-4 space-y-2">
            {nearby.map((p) =>
            <li key={p.id} className="flex items-center gap-3 rounded-lg bg-surface p-3 ring-1 ring-hairline">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold text-navy">
                    {p.zone} · {p.id}
                  </p>
                  <p className="truncate text-[11px] text-slate-500">
                    {p.reportCount} signalements · {formatArea(p.areaM2)}
                  </p>
                </div>
                <SeverityBadge severity={p.severity} />
              </li>
            )}
          </ul>
          <Link to="/citoyens/mes-signalements" className="mt-4 block">
            <Button variant="secondary" block icon={<ListChecksIcon className="h-4 w-4" />}>
              Suivre mes signalements
            </Button>
          </Link>
        </section>
      </div>
    </div>);

}