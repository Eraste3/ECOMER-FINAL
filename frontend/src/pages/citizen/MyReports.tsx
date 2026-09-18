import React, { useState } from 'react';
import { CheckIcon, ChevronDownIcon, MapPinIcon, ShapesIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { StatusBadge, SeverityBadge } from '../../components/status/StatusBadge';
import { EmptyState } from '../../components/ui/States';
import { useEcomer } from '../../contexts/EcomerContext';
import { cn, formatArea, formatDateTime } from '../../utils/format';
import { perimeterStatusMeta, reportStatusMeta, wasteMeta } from '../../utils/labels';
import type { ReportStatus } from '../../types';

const timeline: ReportStatus[] = ['en_attente', 'autorise', 'en_cours', 'resolu'];

export function MyReportsPage() {
  const { reports, perimeters, currentUser } = useEcomer();
  const mine = reports.filter((r) => r.authorId === currentUser.id);
  const [open, setOpen] = useState<string | null>(mine[0]?.id ?? null);
  const [filter, setFilter] = useState<'tous' | ReportStatus>('tous');

  const shown = filter === 'tous' ? mine : mine.filter((r) => r.status === filter);

  return (
    <div className="space-y-4 px-4 py-5 sm:px-0">
      <div>
        <h2 className="font-display text-lg font-bold text-navy">Mes signalements</h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Suivez l’avancement de chaque signalement et du périmètre auquel il appartient.
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {(['tous', ...timeline] as const).map((f) =>
        <button
          key={f}
          onClick={() => setFilter(f)}
          className={cn(
            'shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors',
            filter === f ?
            'bg-ocean text-white' :
            'bg-white text-slate-500 ring-1 ring-inset ring-hairline hover:text-navy'
          )}>
          
            {f === 'tous' ? 'Tous' : reportStatusMeta[f].label}
          </button>
        )}
      </div>

      {shown.length === 0 ?
      <div className="rounded-xl bg-white ring-1 ring-hairline">
          <EmptyState
          title="Aucun signalement"
          message="Vos signalements apparaîtront ici dès votre premier envoi."
          icon={<MapPinIcon className="h-6 w-6" />} />
        
        </div> :

      <ul className="space-y-3">
          {shown.map((r) => {
          const perimeter = perimeters.find((p) => p.id === r.perimeterId);
          const currentIndex = timeline.indexOf(r.status);
          const expanded = open === r.id;
          return (
            <li key={r.id} className="overflow-hidden rounded-xl bg-white ring-1 ring-hairline shadow-card">
                <button
                onClick={() => setOpen(expanded ? null : r.id)}
                aria-expanded={expanded}
                className="flex w-full items-center gap-3 p-4 text-left">
                
                  {r.photoUrl ?
                <img src={r.photoUrl} alt="" className="h-12 w-12 shrink-0 rounded-lg object-cover" /> :

                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold"
                  style={{
                    backgroundColor: `${wasteMeta[r.wasteType].color}1f`,
                    color: wasteMeta[r.wasteType].color
                  }}>
                  
                      {wasteMeta[r.wasteType].short.slice(0, 3).toUpperCase()}
                    </span>
                }
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-sm font-bold text-navy">Signalement #{r.id}</p>
                    <p className="truncate text-[11px] text-slate-500">
                      Pointe-Noire — {r.zone} · {wasteMeta[r.wasteType].label}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <StatusBadge
                    label={reportStatusMeta[r.status].label}
                    tone={reportStatusMeta[r.status].tone} />
                  
                    <ChevronDownIcon
                    className={cn('h-4 w-4 text-slate-400 transition-transform', expanded && 'rotate-180')} />
                  
                  </div>
                </button>

                {expanded &&
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="overflow-hidden border-t border-hairline">
                
                    <div className="space-y-5 p-4">
                      <ol className="space-y-0">
                        {timeline.map((s, i) => {
                      const done = i <= currentIndex;
                      return (
                        <li key={s} className="flex gap-3">
                              <div className="flex flex-col items-center">
                                <span
                              className={cn(
                                'flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold',
                                done ? 'bg-eco-green text-white' : 'bg-slate-200 text-slate-500'
                              )}>
                              
                                  {done ? <CheckIcon className="h-3 w-3" strokeWidth={3} /> : i + 1}
                                </span>
                                {i < timeline.length - 1 &&
                            <span
                              className={cn(
                                'my-0.5 w-0.5 flex-1',
                                i < currentIndex ? 'bg-eco-green' : 'bg-slate-200'
                              )} />

                            }
                              </div>
                              <div className="pb-4">
                                <p
                              className={cn(
                                'text-[13px] font-semibold',
                                done ? 'text-navy' : 'text-slate-400'
                              )}>
                              
                                  {reportStatusMeta[s].label}
                                </p>
                                <p className="text-[11px] text-slate-500">
                                  {s === 'en_attente' ?
                              `Reçu le ${formatDateTime(r.createdAt)}` :
                              s === 'autorise' ?
                              'Autorisation délivrée par la Direction de l’Environnement' :
                              s === 'en_cours' ?
                              'Intervention en cours sur le périmètre' :
                              'Zone dépolluée et validée'}
                                </p>
                              </div>
                            </li>);

                    })}
                      </ol>

                      <dl className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
                        <div className="rounded-lg bg-surface p-3 ring-1 ring-hairline">
                          <dt className="text-[10px] uppercase tracking-wide text-slate-500">Type</dt>
                          <dd className="mt-0.5 font-semibold text-navy">{wasteMeta[r.wasteType].short}</dd>
                        </div>
                        <div className="rounded-lg bg-surface p-3 ring-1 ring-hairline">
                          <dt className="text-[10px] uppercase tracking-wide text-slate-500">Gravité</dt>
                          <dd className="mt-1">
                            <SeverityBadge severity={r.severity} />
                          </dd>
                        </div>
                        <div className="rounded-lg bg-surface p-3 ring-1 ring-hairline">
                          <dt className="text-[10px] uppercase tracking-wide text-slate-500">Confiance IA</dt>
                          <dd className="mt-0.5 font-semibold text-navy">{r.ai.confidence} %</dd>
                        </div>
                        <div className="rounded-lg bg-surface p-3 ring-1 ring-hairline">
                          <dt className="text-[10px] uppercase tracking-wide text-slate-500">Reçu le</dt>
                          <dd className="mt-0.5 font-semibold text-navy">{formatDateTime(r.createdAt)}</dd>
                        </div>
                      </dl>

                      {perimeter &&
                  <div className="rounded-xl bg-navy p-4">
                          <div className="flex items-center gap-2">
                            <ShapesIcon className="h-4 w-4 text-cyan-ecomer" />
                            <p className="text-[13px] font-semibold text-white">
                              Périmètre {perimeter.id}
                            </p>
                            <StatusBadge
                        label={perimeterStatusMeta[perimeter.status].label}
                        tone={perimeterStatusMeta[perimeter.status].tone}
                        dark
                        className="ml-auto" />
                      
                          </div>
                          <p className="mt-2 text-[11px] text-slate-400">
                            Votre signalement a été regroupé avec {perimeter.reportCount - 1} autres
                            signalements dans un périmètre de {formatArea(perimeter.areaM2)} à {perimeter.zone}.
                          </p>
                        </div>
                  }
                    </div>
                  </motion.div>
              }
              </li>);

        })}
        </ul>
      }
    </div>);

}