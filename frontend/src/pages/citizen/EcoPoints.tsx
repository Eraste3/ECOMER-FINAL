import React from 'react';
import { motion } from 'framer-motion';
import { AwardIcon, MedalIcon, TrophyIcon } from 'lucide-react';
import { useEcomer } from '../../contexts/EcomerContext';
import { badges, leaderboard } from '../../data/mock-gamification';
import { formatDate } from '../../utils/format';

export function EcoPointsPage() {
  const { ecoPoints, history } = useEcomer();

  const currentBadge = [...badges].reverse().find((b) => ecoPoints >= b.threshold) ?? badges[0];
  const nextBadge = badges.find((b) => b.threshold > ecoPoints);
  const progress = nextBadge ?
  Math.round(
    (ecoPoints - currentBadge.threshold) / (nextBadge.threshold - currentBadge.threshold) * 100
  ) :
  100;

  return (
    <div className="space-y-4 px-4 py-5 sm:px-0">
      <div>
        <h2 className="font-display text-lg font-bold text-navy">Mes EcoPoints</h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Vos contributions à la protection des eaux de Pointe-Noire.
        </p>
      </div>

      <section className="overflow-hidden rounded-xl bg-navy p-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Solde EcoPoints
            </p>
            <p className="mt-1 font-display text-4xl font-bold text-cyan-ecomer">{ecoPoints}</p>
            <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-amber-400/15 px-3 py-1 text-[11px] font-bold text-amber-300 ring-1 ring-inset ring-amber-400/30">
              <MedalIcon className="h-3.5 w-3.5" />
              Badge actuel : {currentBadge.label}
            </p>
          </div>
          <div className="w-full max-w-sm">
            <div className="flex items-baseline justify-between text-[11px] text-slate-400">
              <span>{currentBadge.label}</span>
              <span>{nextBadge ? nextBadge.label : 'Niveau maximal'}</span>
            </div>
            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
                className="h-full rounded-full bg-cyan-ecomer" />
              
            </div>
            <p className="mt-2 text-[11px] text-slate-400">
              {nextBadge ?
              `Encore ${nextBadge.threshold - ecoPoints} points pour débloquer « ${nextBadge.label} ».` :
              'Vous avez atteint le badge le plus élevé.'}
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-xl bg-white p-5 ring-1 ring-hairline shadow-card lg:col-span-2">
          <h3 className="flex items-center gap-2 font-display text-sm font-semibold text-navy">
            <AwardIcon className="h-4 w-4 text-ocean" />
            Historique des points
          </h3>
          <ul className="mt-4 divide-y divide-hairline">
            {history.map((h) =>
            <li key={h.id} className="flex items-center gap-3 py-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-[11px] font-bold text-emerald-700">
                  +{h.points}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-navy">{h.label}</p>
                  <p className="text-[11px] text-slate-500">{formatDate(h.date)}</p>
                </div>
              </li>
            )}
          </ul>
        </section>

        <section className="space-y-4">
          <div className="rounded-xl bg-white p-5 ring-1 ring-hairline shadow-card">
            <h3 className="flex items-center gap-2 font-display text-sm font-semibold text-navy">
              <TrophyIcon className="h-4 w-4 text-amber-500" />
              Classement citoyen
            </h3>
            <ol className="mt-4 space-y-2">
              {leaderboard.map((e) =>
              <li
                key={e.rank}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 ring-1 ${
                e.isCurrentUser ? 'bg-ocean/5 ring-ocean/30' : 'bg-surface ring-hairline'}`
                }>
                
                  <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold ${
                  e.rank === 1 ?
                  'bg-amber-400 text-white' :
                  e.rank === 2 ?
                  'bg-slate-300 text-white' :
                  e.rank === 3 ?
                  'bg-amber-700 text-white' :
                  'bg-white text-slate-500 ring-1 ring-hairline'}`
                  }>
                  
                    {e.rank}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-semibold text-navy">
                      {e.name}
                      {e.isCurrentUser && <span className="ml-1.5 text-[10px] text-ocean">(vous)</span>}
                    </span>
                    <span className="block text-[11px] text-slate-500">{e.zone}</span>
                  </span>
                  <span className="text-[13px] font-bold text-ocean">{e.points} pts</span>
                </li>
              )}
            </ol>
          </div>

          <div className="rounded-xl bg-white p-5 ring-1 ring-hairline shadow-card">
            <h3 className="font-display text-sm font-semibold text-navy">Mes badges</h3>
            <ul className="mt-4 grid grid-cols-2 gap-2">
              {badges.map((b) => {
                const unlocked = ecoPoints >= b.threshold;
                return (
                  <li
                    key={b.id}
                    className={`rounded-lg p-3 text-center ring-1 ${
                    unlocked ? 'bg-amber-50 ring-amber-200' : 'bg-surface ring-hairline opacity-60'}`
                    }>
                    
                    <MedalIcon
                      className={`mx-auto h-6 w-6 ${unlocked ? 'text-amber-500' : 'text-slate-300'}`} />
                    
                    <p className="mt-1.5 text-[11px] font-bold text-navy">{b.label}</p>
                    <p className="text-[10px] text-slate-500">{b.threshold} pts</p>
                  </li>);

              })}
            </ul>
          </div>
        </section>
      </div>
    </div>);

}