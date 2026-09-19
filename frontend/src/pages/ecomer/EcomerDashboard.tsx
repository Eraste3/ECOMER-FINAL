import { Link } from 'react-router-dom';
import {
  ArrowRightIcon,
  CheckCircle2Icon,
  ClipboardListIcon,
  MapIcon,
  PackageIcon,
  TruckIcon,
  UsersIcon,
  WrenchIcon } from
'lucide-react';
import { KpiCard } from '../../components/cards/KpiCard';
import { Card, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { MapView } from '../../components/maps/MapView';
import { MapLegend } from '../../components/maps/MapLegend';
import { PerimeterCard } from '../../components/cards/PerimeterCard';
import { StatusBadge } from '../../components/status/StatusBadge';
import { usePerimeters } from '../../hooks/usePerimeters';
import { useMissions } from '../../hooks/useMissions';
import { useTeams } from '../../hooks/useTeams';
import { useStockage } from '../../hooks/useStockage';
import { daysBetween, formatDate } from '../../utils/format';
import { missionStatusMeta, perimeterStatusMeta } from '../../utils/labels';

export function EcomerDashboard() {
  const { perimeters, loading: perimetersLoading } = usePerimeters();
  const { missions, loading: missionsLoading, getMissionStats } = useMissions();
  const { members, teams, loading: teamsLoading } = useTeams();
  const { entries, loading: stockLoading } = useStockage();

  const available = perimeters.filter((p: any) => p.status === 'nouveau' || p.status === 'en_validation');
  const activeMissions = missions.filter((m: any) => m.status === 'en_cours');
  const plannedMissions = missions.filter((m: any) => m.status === 'planifiee');
  const completedMissions = missions.filter((m: any) => m.status === 'terminee');
  const resolved = perimeters.filter((p: any) => p.status === 'resolu');
  const activeMembers = members.filter((m: any) => m.status === 'actif');
  const totalStockTons = entries.reduce((sum: number, e: any) => sum + e.quantityTons, 0);

  if (perimetersLoading || missionsLoading || teamsLoading || stockLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-slate-500">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <KpiCard
          label="Périmètres disponibles"
          value={available.length}
          icon={<MapIcon className="h-4 w-4" />}
          accent="#1273b8"
          trend={{ value: 12, label: 'vs mois dernier' }}
          index={0} />
        
        <KpiCard
          label="Missions en cours"
          value={activeMissions.length}
          icon={<WrenchIcon className="h-4 w-4" />}
          accent="#f97316"
          trend={{ value: 4, label: 'cette semaine' }}
          index={1} />
        
        <KpiCard
          label="Équipes actives"
          value={teams.length}
          icon={<UsersIcon className="h-4 w-4" />}
          accent="#14b8a6"
          index={2} />
        
        <KpiCard
          label="Stock disponible"
          value={totalStockTons.toFixed(1)}
          suffix="t"
          icon={<PackageIcon className="h-4 w-4" />}
          accent="#8b5cf6"
          index={3} />
        
        <KpiCard
          label="Zones résolues"
          value={resolved.length}
          icon={<CheckCircle2Icon className="h-4 w-4" />}
          accent="#10b981"
          trend={{ value: 9, label: 'taux de résolution' }}
          index={4} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader
            title="Carte des zones polluées"
            subtitle="Pointe-Noire et littoral — clustering spatial ECOMER"
            action={
            <Link to="/ECOMER/carte">
                <Button variant="secondary" size="sm" icon={<MapIcon className="h-3.5 w-3.5" />}>
                  Carte complète
                </Button>
              </Link>
            } />
          
          <div className="relative aspect-[4/3]">
            <MapView perimeters={perimeters as any} showHeatmap tone="dark" />
            <MapLegend tone="dark" className="absolute bottom-3 left-3" extras={false} />
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader
              title="Missions en cours"
              subtitle={`${activeMissions.length} opération(s) active(s)`}
              action={
              <Link
                to="/ECOMER/missions"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-ocean hover:underline">
                
                  Tout voir <ArrowRightIcon className="h-3 w-3" />
                </Link>
              } />
            
            <ul className="divide-y divide-hairline">
              {activeMissions.map((m: any) => {
                const left = daysBetween(new Date(), m.plannedDate);
                return (
                  <li key={m.id}>
                    <Link
                      to={`/ECOMER/missions/${m.id}`}
                      className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-slate-50">
                      
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-semibold text-navy">
                          {m.id} · {m.zone}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {m.teamName} · {m.members?.length || 0} agents · {m.estimatedTons} t estimées
                        </p>
                      </div>
                      <StatusBadge
                        label={missionStatusMeta[m.status as keyof typeof missionStatusMeta]?.label || m.status}
                        tone={missionStatusMeta[m.status as keyof typeof missionStatusMeta]?.tone || 'neutral'} />
                    </Link>
                  </li>);
              })}
            </ul>
          </Card>

          <Card>
            <CardHeader
              title="Missions planifiées"
              subtitle={`${plannedMissions.length} à venir`}
              action={
              <Link to="/ECOMER/missions">
                  <Button variant="accent" size="sm">
                    Planifier une mission
                  </Button>
                </Link>
              } />
            
            <ul className="divide-y divide-hairline">
              {plannedMissions.slice(0, 4).map((m: any) =>
              <li key={m.id} className="flex items-center gap-3 px-5 py-3.5">
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-semibold text-navy">
                        {m.id} · {m.zone}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {m.teamName} · {formatDate(m.plannedDate)}
                      </p>
                    </div>
                    <StatusBadge
                  label={missionStatusMeta[m.status as keyof typeof missionStatusMeta]?.label || m.status}
                  tone={missionStatusMeta[m.status as keyof typeof missionStatusMeta]?.tone || 'neutral'} />
                
                  </li>
              )}
            </ul>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader
          title="Périmètres à traiter"
          subtitle="Nouveaux clusters et zones prioritaires" />
        
        <div className="grid gap-3 p-5 sm:grid-cols-2 xl:grid-cols-3">
          {available.map((p: any) =>
          <PerimeterCard
            key={p.id}
            perimeter={p}
            action={
            <Link
              to="/ECOMER/missions"
              className="text-[11px] font-semibold text-ocean hover:underline">
              
                  Planifier une mission
                </Link>
            } />

          )}
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader title="Équipes ECOMER" subtitle={`${teams.length} équipe(s) opérationnelle(s)`} />
          <ul className="divide-y divide-hairline">
            {teams.map((t: any) =>
            <li key={t.id} className="flex items-center gap-3 px-5 py-3.5">
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-navy">
                    {t.name}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {t.leaderName} · {t.members?.length || 0} membres · {t.zone || 'Zone non assignée'}
                  </p>
                </div>
                <StatusBadge label="Active" tone="success" />
              </li>
            )}
          </ul>
        </Card>

        <Card>
          <CardHeader title="Stock de déchets" subtitle={`${totalStockTons.toFixed(1)} tonnes disponibles`} />
          <ul className="divide-y divide-hairline">
            {entries.slice(0, 5).map((e: any) =>
            <li key={e.id} className="flex items-center gap-3 px-5 py-3.5">
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-navy">
                    {e.wasteType}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {e.quantityTons.toFixed(1)} t · Qualité {e.quality} · {e.location}
                  </p>
                </div>
                <StatusBadge label="Disponible" tone="success" />
              </li>
            )}
          </ul>
        </Card>
      </div>

      <Card>
        <CardHeader title="Historique des zones résolues" subtitle={`${resolved.length} périmètres assainis`} />
        <ul className="divide-y divide-hairline">
          {resolved.map((p) =>
          <li key={p.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold text-navy">
                  {p.id} · {p.zone}
                </p>
                <p className="text-[11px] text-slate-500">
                  {p.reportCount} signalements · {p.wasteTons.toFixed(1).replace('.', ',')} t collectées
                </p>
              </div>
              <StatusBadge label={perimeterStatusMeta.resolu.label} tone="success" />
            </li>
          )}
        </ul>
      </Card>
    </div>);

}
