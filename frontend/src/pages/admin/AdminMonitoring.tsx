import React, { useEffect, useState } from 'react';
import {
  ActivityIcon,
  AlertCircleIcon,
  CheckCircle2Icon,
  ClockIcon,
  CpuIcon,
  GaugeIcon,
  ServerIcon,
  UsersIcon } from
'lucide-react';
import { Card, CardHeader } from '../../components/ui/Card';
import { KpiCard } from '../../components/cards/KpiCard';
import { ResourceChart } from '../../components/charts/ResourceChart';
import { StatusBadge } from '../../components/status/StatusBadge';
import { monitoringKpis } from '../../data/mock-statistics';
import { formatNumber } from '../../utils/format';

const services = [
{ name: 'API ECOMER', status: 'Opérationnel', latency: 45 },
{ name: 'Moteur de clustering spatial', status: 'Opérationnel', latency: 128 },
{ name: 'Service d’analyse IA', status: 'Opérationnel', latency: 312 },
{ name: 'Stockage des photos', status: 'Opérationnel', latency: 64 },
{ name: 'Notifications temps réel', status: 'Dégradé', latency: 540 }];


export function AdminMonitoringPage() {
  const [live, setLive] = useState({
    requests: monitoringKpis.requests24h,
    users: monitoringKpis.activeUsers,
    rpm: monitoringKpis.reportsPerMinute,
    response: monitoringKpis.avgResponseMs
  });

  useEffect(() => {
    const id = setInterval(() => {
      setLive((prev) => ({
        requests: prev.requests + Math.round(Math.random() * 40),
        users: Math.max(180, prev.users + Math.round((Math.random() - 0.5) * 24)),
        rpm: Math.max(0.4, Number((prev.rpm + (Math.random() - 0.5) * 0.6).toFixed(1))),
        response: Math.max(78, prev.response + Math.round((Math.random() - 0.5) * 22))
      }));
    }, 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card tone="dark" className="p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-300">
              <ServerIcon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                État du serveur
              </p>
              <p className="font-display text-lg font-bold text-white">Healthy — Opérationnel</p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            <p className="text-[11px] text-slate-400">Disponibilité {monitoringKpis.uptime} % sur 30 jours</p>
          </div>
        </Card>

        <Card tone="dark" className="p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-cyan-ecomer/15 text-cyan-ecomer">
              <GaugeIcon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Latence API</p>
              <p className="font-display text-lg font-bold text-white">{monitoringKpis.latencyMs} ms</p>
            </div>
          </div>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/5">
            <div className="h-full w-[18%] rounded-full bg-cyan-ecomer" />
          </div>
          <p className="mt-2 text-[11px] text-slate-500">Objectif : moins de 250 ms</p>
        </Card>

        <Card tone="dark" className="p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-500/15 text-amber-300">
              <AlertCircleIcon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Taux d’erreur
              </p>
              <p className="font-display text-lg font-bold text-white">
                {monitoringKpis.errorRate.toString().replace('.', ',')} %
              </p>
            </div>
          </div>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/5">
            <div className="h-full w-[4%] rounded-full bg-amber-400" />
          </div>
          <p className="mt-2 text-[11px] text-slate-500">Seuil d’alerte : 1 %</p>
        </Card>
      </div>

      <Card tone="dark">
        <CardHeader
          tone="dark"
          title="Utilisation des ressources"
          subtitle="CPU et mémoire — flux temps réel simulé"
          action={
          <span className="flex items-center gap-1.5 rounded-full bg-red-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-red-300 ring-1 ring-inset ring-red-400/20">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-400" />
              Live
            </span>
          } />
        
        <div className="p-5">
          <ResourceChart />
          <div className="mt-4 flex flex-wrap gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="h-2 w-4 rounded-sm bg-eco-orange" />
              CPU
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="h-2 w-4 rounded-sm bg-cyan-ecomer" />
              Mémoire
            </span>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard tone="dark" label="Requêtes (24 h)" value={live.requests} icon={<ActivityIcon className="h-4 w-4" />} accent="#22d3ee" index={0} />
        <KpiCard tone="dark" label="Utilisateurs actifs" value={live.users} icon={<UsersIcon className="h-4 w-4" />} accent="#10b981" index={1} />
        <KpiCard tone="dark" label="Signalements / minute" value={live.rpm} icon={<CpuIcon className="h-4 w-4" />} accent="#f97316" index={2} />
        <KpiCard tone="dark" label="Temps de réponse moyen" value={live.response} suffix="ms" icon={<ClockIcon className="h-4 w-4" />} accent="#f59e0b" index={3} />
      </div>

      <Card tone="dark">
        <CardHeader tone="dark" title="Services" subtitle="Supervision des composants de la plateforme" />
        <ul className="divide-y divide-white/5">
          {services.map((s) =>
          <li key={s.name} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
              <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
              s.status === 'Opérationnel' ?
              'bg-emerald-500/15 text-emerald-300' :
              'bg-amber-500/15 text-amber-300'}`
              }>
              
                {s.status === 'Opérationnel' ?
              <CheckCircle2Icon className="h-4 w-4" /> :

              <AlertCircleIcon className="h-4 w-4" />
              }
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold text-white">{s.name}</p>
                <p className="text-[11px] text-slate-400">Latence moyenne {formatNumber(s.latency)} ms</p>
              </div>
              <StatusBadge
              label={s.status}
              tone={s.status === 'Opérationnel' ? 'success' : 'warning'}
              dark />
            
            </li>
          )}
        </ul>
      </Card>
    </div>);

}