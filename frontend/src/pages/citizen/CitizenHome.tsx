import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRightIcon,
  CrosshairIcon,
  LayersIcon,
  ListChecksIcon,
  MapPinIcon } from
'lucide-react';
import { MapView } from '../../components/maps/MapView';
import { MapLegend } from '../../components/maps/MapLegend';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/status/StatusBadge';
import { useSignalements } from '../../hooks/useSignalements';
import { relativeTime } from '../../utils/format';
import { reportStatusMeta, wasteMeta } from '../../utils/labels';
import { CITIZEN_POSITION } from '../../data/citizen';

const filters = [
{ key: 'signalements', label: 'Signalements' },
{ key: 'resolues', label: 'Zones nettoyées' },
{ key: 'heatmap', label: 'Heatmap' }] as
const;

type FilterKey = (typeof filters)[number]['key'];

export function CitizenHome() {
  const { getAllSignalements } = useSignalements();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<FilterKey[]>(['signalements']);
  const [ecoPoints] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllSignalements();
        setReports(data);
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [getAllSignalements]);

  const toggle = (k: FilterKey) =>
    setActive((prev) => prev.includes(k) ? prev.filter((f) => f !== k) : [...prev, k]);

  const myReports = reports.slice(0, 4);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-slate-500">Chargement...</p>
      </div>
    );
  }

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
            perimeters={[]}
            reports={active.includes('signalements') ? reports : []}
            showResolved={active.includes('resolues')}
            showHeatmap={active.includes('heatmap')}
            userPosition={CITIZEN_POSITION}
            selectedPerimeterId={null}
            onSelectPerimeter={() => {}}
            tone="dark" />
          
          <MapLegend tone="dark" className="absolute bottom-3 left-3 max-w-[45%]" />
          <button
            className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-lg glass-dark text-cyan-ecomer"
            aria-label="Recentrer sur ma position">
            <CrosshairIcon className="h-4 w-4" />
          </button>
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
            {myReports.map((r) => {
              const wasteType = r.typeDechet || 'plastique';
              const status = r.statut || 'en_attente';
              return (
                <li key={r.id} className="flex items-center gap-3 rounded-lg bg-surface p-3 ring-1 ring-hairline">
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold"
                    style={{
                      backgroundColor: `${wasteMeta[wasteType as keyof typeof wasteMeta]?.color || '#3b82f6'}1f`,
                      color: wasteMeta[wasteType as keyof typeof wasteMeta]?.color || '#3b82f6'
                    }}>
                    {wasteMeta[wasteType as keyof typeof wasteMeta]?.short.slice(0, 3).toUpperCase() || 'WAS'}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold text-navy">Signalement #{r.id}</p>
                    <p className="truncate text-[11px] text-slate-500">
                      {relativeTime(r.createdAt)}
                    </p>
                  </div>
                  <StatusBadge
                    label={reportStatusMeta[status as keyof typeof reportStatusMeta]?.label || status}
                    tone={reportStatusMeta[status as keyof typeof reportStatusMeta]?.tone || 'neutral'} />
                </li>
              );
            })}
          </ul>
        </section>

        <section className="rounded-xl bg-white p-5 ring-1 ring-hairline shadow-card">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-semibold text-navy">Statistiques</h3>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-surface p-4 ring-1 ring-hairline">
              <p className="text-[10px] uppercase tracking-wide text-slate-500">Total signalements</p>
              <p className="mt-1 font-display text-2xl font-bold text-navy">{reports.length}</p>
            </div>
            <div className="rounded-lg bg-surface p-4 ring-1 ring-hairline">
              <p className="text-[10px] uppercase tracking-wide text-slate-500">EcoPoints</p>
              <p className="mt-1 font-display text-2xl font-bold text-cyan-ecomer">{ecoPoints}</p>
            </div>
          </div>
          <Link to="/citoyens/mes-signalements" className="mt-4 block">
            <Button variant="secondary" block icon={<ListChecksIcon className="h-4 w-4" />}>
              Suivre mes signalements
            </Button>
          </Link>
        </section>
      </div>
    </div>);

}