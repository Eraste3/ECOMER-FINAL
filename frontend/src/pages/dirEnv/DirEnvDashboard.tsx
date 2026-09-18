import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangleIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  InboxIcon,
  ShapesIcon,
  TruckIcon } from
'lucide-react';
import { KpiCard } from '../../components/cards/KpiCard';
import { Card, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { MapView } from '../../components/maps/MapView';
import { MapLegend } from '../../components/maps/MapLegend';
import { ChartCard } from '../../components/charts/ChartCard';
import { TrendChart } from '../../components/charts/TrendChart';
import { SeverityChart } from '../../components/charts/SeverityChart';
import { SeverityBadge, StatusBadge } from '../../components/status/StatusBadge';
import { useEcomer } from '../../contexts/EcomerContext';
import { formatArea, formatDate, relativeTime } from '../../utils/format';
import { perimeterStatusMeta, requestStatusMeta, severityOrder, wasteMeta } from '../../utils/labels';
import { reportsTrend30d } from '../../data/mock-statistics';

export function DirEnvDashboard() {
  const { perimeters, requests, interventions, reports } = useEcomer();

  const active = perimeters.filter((p) => p.status !== 'resolu');
  const critical = active.filter((p) => p.severity === 'critique');
  const pending = requests.filter((r) => r.status === 'en_attente');
  const municipal = interventions.filter((i) => i.operatorType === 'municipale');
  const resolved = perimeters.filter((p) => p.status === 'resolu');

  const priorityReports = reports.filter((r) => r.priority).slice(0, 4);

  const top = [...active].
  sort(
    (a, b) =>
    severityOrder.indexOf(b.severity) - severityOrder.indexOf(a.severity) ||
    b.reportCount - a.reportCount
  ).
  slice(0, 5);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <KpiCard label="Périmètres actifs" value={86} icon={<ShapesIcon className="h-4 w-4" />} accent="#1273b8" index={0} />
        <KpiCard label="Zones critiques" value={9} icon={<AlertTriangleIcon className="h-4 w-4" />} accent="#ef4444" index={1} />
        <KpiCard label="Demandes ONG" value={pending.length} icon={<InboxIcon className="h-4 w-4" />} accent="#f59e0b" index={2} />
        <KpiCard label="Interventions municipales" value={47} icon={<TruckIcon className="h-4 w-4" />} accent="#f97316" index={3} />
        <KpiCard label="Zones résolues" value={73} icon={<CheckCircle2Icon className="h-4 w-4" />} accent="#10b981" index={4} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader
            title="Cartographie de supervision"
            subtitle="Heatmap des périmètres actifs sur l’agglomération"
            action={
            <Link to="/dirEnv/carte">
                <Button variant="secondary" size="sm" icon={<ArrowRightIcon className="h-3.5 w-3.5" />}>
                  Carte stratégique
                </Button>
              </Link>
            } />
          
          <div className="relative aspect-[16/10]">
            <MapView perimeters={perimeters} reports={reports} showHeatmap tone="dark" />
            <MapLegend tone="dark" className="absolute bottom-3 left-3" />
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader
              title="Zones critiques"
              subtitle="5 périmètres les plus urgents"
              action={<AlertTriangleIcon className="h-4 w-4 text-eco-red" />} />
            
            <ol className="divide-y divide-hairline">
              {top.map((p, i) =>
              <li key={p.id} className="flex items-center gap-3 px-5 py-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-600">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold text-navy">
                      {p.zone} · {p.id}
                    </p>
                    <p className="truncate text-[11px] text-slate-500">
                      {p.reportCount} signalements · {formatArea(p.areaM2)} · {wasteMeta[p.dominantWaste].short}
                    </p>
                  </div>
                  <SeverityBadge severity={p.severity} />
                </li>
              )}
            </ol>
          </Card>

          <Card>
            <CardHeader
              title="Signalements ONG prioritaires"
              subtitle="Déposés par des ONG accréditées" />
            
            <ul className="divide-y divide-hairline">
              {priorityReports.map((r) =>
              <li key={r.id} className="flex items-center gap-3 px-5 py-3">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-eco-orange" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold text-navy">
                      {r.id} · {r.zone}
                    </p>
                    <p className="truncate text-[11px] text-slate-500">
                      {r.authorName} · {relativeTime(r.createdAt)}
                    </p>
                  </div>
                  <SeverityBadge severity={r.severity} />
                </li>
              )}
            </ul>
          </Card>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <ChartCard title="Évolution des signalements" subtitle="30 derniers jours">
          <TrendChart data={reportsTrend30d} />
        </ChartCard>
        <ChartCard title="Répartition par gravité" subtitle="Périmètres actifs">
          <SeverityChart />
        </ChartCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader
            title="Demandes ONG à traiter"
            subtitle={`${pending.length} demande(s) en attente`}
            action={
            <Link to="/dirEnv/demandes">
                <Button size="sm" variant="accent">
                  Guichet unique
                </Button>
              </Link>
            } />
          
          <ul className="divide-y divide-hairline">
            {pending.map((r) =>
            <li key={r.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-navy">
                    {r.ongName} · {r.perimeterId}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {r.zone} · {r.agents} agents · prévu le {formatDate(r.plannedDate)}
                  </p>
                </div>
                <StatusBadge label={requestStatusMeta[r.status].label} tone={requestStatusMeta[r.status].tone} />
              </li>
            )}
          </ul>
        </Card>

        <Card>
          <CardHeader
            title="Interventions municipales en cours"
            subtitle={`${municipal.length} ordre(s) de mission`}
            action={
            <Link to="/dirEnv/interventions">
                <Button size="sm" variant="secondary">
                  Mandater une équipe
                </Button>
              </Link>
            } />
          
          <ul className="divide-y divide-hairline">
            {municipal.map((i) =>
            <li key={i.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-navy">
                    {i.id} · {i.team}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {i.zone} · {i.perimeterId} · échéance {formatDate(i.deadline)}
                  </p>
                </div>
                <SeverityBadge severity={i.severity} />
              </li>
            )}
          </ul>
          <div className="border-t border-hairline px-5 py-3">
            <p className="text-[11px] text-slate-500">
              {resolved.length} périmètres clôturés — statut{' '}
              <span className="font-semibold text-emerald-700">
                {perimeterStatusMeta.resolu.label}
              </span>
            </p>
          </div>
        </Card>
      </div>
    </div>);

}