import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRightIcon,
  CheckCircle2Icon,
  ClipboardListIcon,
  MapIcon,
  ShapesIcon,
  WrenchIcon } from
'lucide-react';
import { KpiCard } from '../../components/cards/KpiCard';
import { Card, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { MapView } from '../../components/maps/MapView';
import { MapLegend } from '../../components/maps/MapLegend';
import { PerimeterCard } from '../../components/cards/PerimeterCard';
import { StatusBadge } from '../../components/status/StatusBadge';
import { useEcomer } from '../../contexts/EcomerContext';
import { CURRENT_ONG_ID } from '../../data/mock-ongs';
import { daysBetween, formatDate } from '../../utils/format';
import { interventionStatusMeta, requestStatusMeta } from '../../utils/labels';

export function OngDashboard() {
  const { perimeters, interventions, requests } = useEcomer();

  const available = perimeters.filter((p) => p.status === 'nouveau' || p.status === 'en_validation');
  const mine = interventions.filter((i) => i.operatorType === 'ong' && i.status === 'en_cours');
  const pending = requests.filter((r) => r.ongId === CURRENT_ONG_ID && r.status === 'en_attente');
  const resolved = perimeters.filter((p) => p.status === 'resolu');

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Périmètres disponibles"
          value={24}
          icon={<ShapesIcon className="h-4 w-4" />}
          accent="#1273b8"
          trend={{ value: 12, label: 'vs mois dernier' }}
          index={0} />
        
        <KpiCard
          label="Interventions en cours"
          value={8}
          icon={<WrenchIcon className="h-4 w-4" />}
          accent="#f97316"
          trend={{ value: 4, label: 'cette semaine' }}
          index={1} />
        
        <KpiCard
          label="Demandes en attente"
          value={3}
          icon={<ClipboardListIcon className="h-4 w-4" />}
          accent="#f59e0b"
          index={2} />
        
        <KpiCard
          label="Zones résolues"
          value={17}
          icon={<CheckCircle2Icon className="h-4 w-4" />}
          accent="#10b981"
          trend={{ value: 9, label: 'taux de résolution' }}
          index={3} />
        
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader
            title="Périmètres de ma zone"
            subtitle="Ngambio et littoral sud — clustering spatial ECOMER"
            action={
            <Link to="/ONG/carte">
                <Button variant="secondary" size="sm" icon={<MapIcon className="h-3.5 w-3.5" />}>
                  Carte complète
                </Button>
              </Link>
            } />
          
          <div className="relative aspect-[16/10]">
            <MapView perimeters={perimeters} showHeatmap tone="dark" />
            <MapLegend tone="dark" className="absolute bottom-3 left-3" extras={false} />
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader
              title="Interventions en cours"
              subtitle={`${mine.length} chantier(s) actif(s)`}
              action={
              <Link
                to="/ONG/interventions"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-ocean hover:underline">
                
                  Tout voir <ArrowRightIcon className="h-3 w-3" />
                </Link>
              } />
            
            <ul className="divide-y divide-hairline">
              {mine.map((i) => {
                const left = daysBetween(new Date(), i.deadline);
                return (
                  <li key={i.id}>
                    <Link
                      to={`/ONG/interventions/${i.id}`}
                      className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-slate-50">
                      
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-semibold text-navy">
                          {i.id} · {i.zone}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {i.team} · {i.agents} agents · échéance {formatDate(i.deadline)}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                        left <= 7 ?
                        'bg-red-50 text-eco-red' :
                        left <= 15 ?
                        'bg-amber-50 text-amber-700' :
                        'bg-emerald-50 text-emerald-700'}`
                        }>
                        
                        {left} j restants
                      </span>
                    </Link>
                  </li>);

              })}
            </ul>
          </Card>

          <Card>
            <CardHeader
              title="Mes demandes d’autorisation"
              subtitle={`${pending.length} en attente de validation`}
              action={
              <Link to="/ONG/autorisations">
                  <Button variant="accent" size="sm">
                    Nouvelle demande
                  </Button>
                </Link>
              } />
            
            <ul className="divide-y divide-hairline">
              {requests.
              filter((r) => r.ongId === CURRENT_ONG_ID).
              slice(0, 4).
              map((r) =>
              <li key={r.id} className="flex items-center gap-3 px-5 py-3.5">
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-semibold text-navy">
                        {r.id} · {r.perimeterId}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {r.zone} · {r.agents} agents · {formatDate(r.plannedDate)}
                      </p>
                    </div>
                    <StatusBadge
                  label={requestStatusMeta[r.status].label}
                  tone={requestStatusMeta[r.status].tone} />
                
                  </li>
              )}
            </ul>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader
          title="Périmètres à prendre en charge"
          subtitle="Nouveaux clusters et périmètres en attente d’autorisation" />
        
        <div className="grid gap-3 p-5 sm:grid-cols-2 xl:grid-cols-3">
          {available.map((p) =>
          <PerimeterCard
            key={p.id}
            perimeter={p}
            action={
            <Link
              to="/ONG/autorisations"
              className="text-[11px] font-semibold text-ocean hover:underline">
              
                  Demander l’autorisation
                </Link>
            } />

          )}
        </div>
      </Card>

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
              <StatusBadge label={interventionStatusMeta.validee.label} tone="success" />
            </li>
          )}
        </ul>
      </Card>
    </div>);

}