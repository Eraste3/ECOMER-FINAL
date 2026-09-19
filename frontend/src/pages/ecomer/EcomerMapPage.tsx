import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FilterIcon, WrenchIcon } from 'lucide-react';
import { Card, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { MapView } from '../../components/maps/MapView';
import { MapLegend } from '../../components/maps/MapLegend';
import { SeverityBadge, StatusBadge } from '../../components/status/StatusBadge';
import { PerimeterCard } from '../../components/cards/PerimeterCard';
import { usePerimeters } from '../../hooks/usePerimeters';
import { formatArea, formatDate } from '../../utils/format';
import { perimeterStatusMeta, severityMeta, severityOrder, wasteMeta } from '../../utils/labels';
import { formatCoord } from '../../data/mock-geo';
import type { Severity } from '../../types';

export function EcomerMapPage() {
  const { perimeters, loading } = usePerimeters();
  const [severities, setSeverities] = useState<Severity[]>([...severityOrder]);
  const [selected, setSelected] = useState<any>(perimeters[0] ?? null);
  const [heatmap, setHeatmap] = useState(true);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-slate-500">Chargement...</p>
      </div>
    );
  }

  const filtered = perimeters.filter((p: any) => severities.includes(p.severity));

  const toggle = (s: Severity) =>
  setSeverities((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
      <Card className="overflow-hidden">
        <CardHeader
          title="Carte des zones polluées"
          subtitle={`${filtered.length} périmètres affichés`}
          action={
          <div className="flex flex-wrap items-center gap-1.5">
              <span className="mr-1 flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                <FilterIcon className="h-3.5 w-3.5" />
                Gravité
              </span>
              {severityOrder.map((s) =>
            <button
              key={s}
              onClick={() => toggle(s)}
              aria-pressed={severities.includes(s)}
              className="rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset transition-opacity"
              style={{
                color: severityMeta[s].color,
                backgroundColor: `${severityMeta[s].color}14`,
                boxShadow: `inset 0 0 0 1px ${severityMeta[s].color}33`,
                opacity: severities.includes(s) ? 1 : 0.35
              }}>
              
                  {severityMeta[s].label}
                </button>
            )}
              <Button variant="secondary" size="sm" onClick={() => setHeatmap((v) => !v)}>
                {heatmap ? 'Heatmap ON' : 'Heatmap OFF'}
              </Button>
            </div>
          } />
        
        <div className="relative aspect-[16/10]">
          <MapView
            perimeters={filtered as any}
            showHeatmap={heatmap}
            selectedPerimeterId={selected?.id ?? null}
            onSelectPerimeter={setSelected}
            tone="dark" />
          
          <MapLegend tone="dark" className="absolute bottom-3 left-3" extras={false} />
        </div>
      </Card>

      <div className="space-y-4">
        {selected &&
        <Card>
            <CardHeader
            title={`Périmètre ${selected.id}`}
            subtitle={`${selected.zone} · Pointe-Noire`}
            action={<SeverityBadge severity={selected.severity} />} />
          
            <dl className="grid grid-cols-2 gap-px bg-hairline">
              {[
            ['Zone', selected.zone],
            ['Type de déchets', wasteMeta[selected.dominantWaste as keyof typeof wasteMeta]?.label || selected.dominantWaste],
            ['Surface estimée', formatArea(selected.areaM2)],
            ['Signalements', `${selected.reportCount}`],
            ['Date de création', formatDate(selected.createdAt)],
            ['Déchets estimés', `${selected.wasteTons.toFixed(1).replace('.', ',')} t`],
            ['Latitude', formatCoord(selected.centroid.lat, 'lat')],
            ['Longitude', formatCoord(selected.centroid.lng, 'lng')]].
            map(([k, v]) =>
            <div key={k} className="bg-white px-4 py-3">
                  <dt className="text-[10px] uppercase tracking-wide text-slate-500">{k}</dt>
                  <dd className="mt-0.5 text-[13px] font-semibold text-navy">{v}</dd>
                </div>
            )}
            </dl>
            <div className="flex items-center justify-between gap-3 border-t border-hairline p-4">
              <StatusBadge
              label={perimeterStatusMeta[selected.status as keyof typeof perimeterStatusMeta]?.label || selected.status}
              tone={perimeterStatusMeta[selected.status as keyof typeof perimeterStatusMeta]?.tone || 'neutral'} />
            
              <Link to="/ECOMER/missions">
                <Button size="sm" icon={<WrenchIcon className="h-3.5 w-3.5" />}>
                  Planifier une mission
                </Button>
              </Link>
            </div>
          </Card>
        }

        <Card>
          <CardHeader title="Liste des périmètres" subtitle="Triés par gravité" />
          <ul className="ecomer-scroll max-h-[420px] space-y-2 overflow-y-auto p-3">
            {[...filtered].
            sort(
              (a, b) => severityOrder.indexOf(b.severity) - severityOrder.indexOf(a.severity)
            ).
            map((p) =>
            <li key={p.id}>
                  <PerimeterCard
                perimeter={p as any}
                active={selected?.id === p.id}
                onClick={() => setSelected(p)} />
              
                </li>
            )}
          </ul>
        </Card>
      </div>
    </div>);

}
