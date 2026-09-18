import React, { useMemo, useState } from 'react';
import { AlertTriangleIcon, FilterIcon, RotateCcwIcon } from 'lucide-react';
import { Card, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { MapView } from '../../components/maps/MapView';
import { MapLegend } from '../../components/maps/MapLegend';
import { SeverityBadge, StatusBadge } from '../../components/status/StatusBadge';
import { useEcomer } from '../../contexts/EcomerContext';
import { formatArea, formatDate } from '../../utils/format';
import { perimeterStatusMeta, severityMeta, severityOrder, wasteMeta } from '../../utils/labels';
import { ZONE_NAMES } from '../../data/mock-geo';
import { mockOngs } from '../../data/mock-ongs';
import type { Perimeter, PerimeterStatus, Severity, WasteType, ZoneName } from '../../types';

const wasteKeys: WasteType[] = ['plastiques', 'menagers', 'hydrocarbures', 'filets', 'divers', 'inconnue'];
const statusKeys: PerimeterStatus[] = ['nouveau', 'en_validation', 'en_intervention', 'resolu'];

export function StrategicMapPage() {
  const { perimeters, reports } = useEcomer();

  const [severities, setSeverities] = useState<Severity[]>([...severityOrder]);
  const [waste, setWaste] = useState<WasteType | 'tous'>('tous');
  const [status, setStatus] = useState<PerimeterStatus | 'tous'>('tous');
  const [zone, setZone] = useState<ZoneName | 'tous'>('tous');
  const [ongId, setOngId] = useState<string>('tous');
  const [period, setPeriod] = useState<'30' | '90' | 'tous'>('tous');
  const [heatmap, setHeatmap] = useState(true);
  const [selected, setSelected] = useState<Perimeter | null>(null);

  const filtered = useMemo(
    () =>
    perimeters.filter((p) => {
      if (!severities.includes(p.severity)) return false;
      if (waste !== 'tous' && p.dominantWaste !== waste) return false;
      if (status !== 'tous' && p.status !== status) return false;
      if (zone !== 'tous' && p.zone !== zone) return false;
      if (ongId !== 'tous' && p.assignedOngId !== ongId) return false;
      if (period !== 'tous') {
        const days = (Date.now() - new Date(p.createdAt).getTime()) / 86400000;
        if (days > Number(period)) return false;
      }
      return true;
    }),
    [perimeters, severities, waste, status, zone, ongId, period]
  );

  const critical = [...perimeters].
  filter((p) => p.status !== 'resolu').
  sort(
    (a, b) =>
    severityOrder.indexOf(b.severity) - severityOrder.indexOf(a.severity) ||
    b.reportCount - a.reportCount
  ).
  slice(0, 5);

  const reset = () => {
    setSeverities([...severityOrder]);
    setWaste('tous');
    setStatus('tous');
    setZone('tous');
    setOngId('tous');
    setPeriod('tous');
  };

  const selectCls =
  'h-9 w-full rounded-lg border-0 bg-surface px-2.5 text-[12px] text-navy ring-1 ring-inset ring-hairline focus:ring-2 focus:ring-ocean';

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
      <div className="space-y-4">
        <Card>
          <CardHeader
            title="Filtres"
            subtitle={`${filtered.length} périmètres correspondent`}
            action={
            <Button variant="ghost" size="sm" onClick={reset} icon={<RotateCcwIcon className="h-3.5 w-3.5" />}>
                Réinitialiser
              </Button>
            } />
          
          <div className="space-y-4 p-5">
            <div>
              <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                <FilterIcon className="h-3.5 w-3.5" />
                Gravité
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {severityOrder.map((s) =>
                <button
                  key={s}
                  onClick={() =>
                  setSeverities((prev) =>
                  prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
                  )
                  }
                  aria-pressed={severities.includes(s)}
                  className="rounded-full px-2.5 py-1 text-[11px] font-semibold transition-opacity"
                  style={{
                    color: severityMeta[s].color,
                    backgroundColor: `${severityMeta[s].color}14`,
                    boxShadow: `inset 0 0 0 1px ${severityMeta[s].color}33`,
                    opacity: severities.includes(s) ? 1 : 0.35
                  }}>
                  
                    {severityMeta[s].label}
                  </button>
                )}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
              <label className="block">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                  Type de déchet
                </span>
                <select value={waste} onChange={(e) => setWaste(e.target.value as WasteType | 'tous')} className={`mt-1 ${selectCls}`}>
                  <option value="tous">Tous</option>
                  {wasteKeys.map((w) =>
                  <option key={w} value={w}>
                      {wasteMeta[w].short}
                    </option>
                  )}
                </select>
              </label>
              <label className="block">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Statut</span>
                <select value={status} onChange={(e) => setStatus(e.target.value as PerimeterStatus | 'tous')} className={`mt-1 ${selectCls}`}>
                  <option value="tous">Tous</option>
                  {statusKeys.map((s) =>
                  <option key={s} value={s}>
                      {perimeterStatusMeta[s].label}
                    </option>
                  )}
                </select>
              </label>
              <label className="block">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Zone</span>
                <select value={zone} onChange={(e) => setZone(e.target.value as ZoneName | 'tous')} className={`mt-1 ${selectCls}`}>
                  <option value="tous">Toutes</option>
                  {ZONE_NAMES.map((z) =>
                  <option key={z} value={z}>
                      {z}
                    </option>
                  )}
                </select>
              </label>
              <label className="block">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">ONG</span>
                <select value={ongId} onChange={(e) => setOngId(e.target.value)} className={`mt-1 ${selectCls}`}>
                  <option value="tous">Toutes</option>
                  {mockOngs.map((o) =>
                  <option key={o.id} value={o.id}>
                      {o.name}
                    </option>
                  )}
                </select>
              </label>
              <label className="block">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Période</span>
                <select value={period} onChange={(e) => setPeriod(e.target.value as '30' | '90' | 'tous')} className={`mt-1 ${selectCls}`}>
                  <option value="tous">Depuis le début</option>
                  <option value="30">30 derniers jours</option>
                  <option value="90">90 derniers jours</option>
                </select>
              </label>
            </div>
          </div>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader
            title="Carte stratégique"
            subtitle="Périmètres, heatmap, interventions et zones résolues"
            action={
            <Button variant="secondary" size="sm" onClick={() => setHeatmap((v) => !v)}>
                {heatmap ? 'Heatmap ON' : 'Heatmap OFF'}
              </Button>
            } />
          
          <div className="relative aspect-[4/3] xl:aspect-[16/10]">
            <MapView
              perimeters={filtered}
              reports={reports}
              showHeatmap={heatmap}
              selectedPerimeterId={selected?.id ?? null}
              onSelectPerimeter={setSelected}
              tone="dark" />
            
            <MapLegend tone="dark" className="absolute bottom-3 left-3" />
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader
            title="Zones critiques"
            subtitle="Les 5 périmètres les plus urgents"
            action={<AlertTriangleIcon className="h-4 w-4 text-eco-red" />} />
          
          <ol className="divide-y divide-hairline">
            {critical.map((p, i) =>
            <li key={p.id}>
                <button
                onClick={() => setSelected(p)}
                className="flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors hover:bg-slate-50">
                
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-50 text-[11px] font-bold text-eco-red">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold text-navy">
                      {p.zone} · {p.id}
                    </p>
                    <p className="truncate text-[11px] text-slate-500">
                      {p.reportCount} signalements · {formatArea(p.areaM2)}
                    </p>
                  </div>
                  <SeverityBadge severity={p.severity} />
                </button>
              </li>
            )}
          </ol>
        </Card>

        {selected &&
        <Card>
            <CardHeader
            title={`Périmètre ${selected.id}`}
            subtitle={selected.zone}
            action={
            <StatusBadge
              label={perimeterStatusMeta[selected.status].label}
              tone={perimeterStatusMeta[selected.status].tone} />

            } />
          
            <dl className="grid grid-cols-2 gap-px bg-hairline">
              {[
            ['Type dominant', wasteMeta[selected.dominantWaste].short],
            ['Gravité', severityMeta[selected.severity].label],
            ['Signalements', `${selected.reportCount}`],
            ['Surface', formatArea(selected.areaM2)],
            ['Créé le', formatDate(selected.createdAt)],
            [
            'ONG affectée',
            selected.assignedOngId ?
            mockOngs.find((o) => o.id === selected.assignedOngId)?.name ?? '—' :
            'Non affecté']].

            map(([k, v]) =>
            <div key={k} className="bg-white px-4 py-3">
                  <dt className="text-[10px] uppercase tracking-wide text-slate-500">{k}</dt>
                  <dd className="mt-0.5 text-[13px] font-semibold text-navy">{v}</dd>
                </div>
            )}
            </dl>
          </Card>
        }
      </div>
    </div>);

}