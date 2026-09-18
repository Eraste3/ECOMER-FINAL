import React from 'react';
import { motion } from 'framer-motion';
import { AwardIcon, MedalIcon, TrophyIcon } from 'lucide-react';
import { gamificationBadges } from '../../data/landing-content';
import { leaderboard } from '../../data/mock-gamification';

export function GamificationSection() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ocean-bright">
            Engagement citoyen
          </p>
          <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-navy sm:text-3xl">
            Chaque signalement compte, et se récompense
          </h2>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          <div className="rounded-xl bg-navy p-6 text-white">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-cyan-ecomer/15 text-cyan-ecomer">
              <AwardIcon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-display text-lg font-semibold">EcoPoints</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-slate-300">
              +10 points par signalement transmis, +25 à la validation et +50 lorsque le périmètre est
              résolu grâce à votre contribution.
            </p>
            <div className="mt-5 rounded-lg bg-white/5 p-4 ring-1 ring-inset ring-white/10">
              <p className="text-[10px] uppercase tracking-wider text-slate-400">Votre solde</p>
              <p className="font-display text-3xl font-bold text-cyan-ecomer">340 pts</p>
            </div>
          </div>

          <div className="rounded-xl bg-surface p-6 ring-1 ring-hairline">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
              <MedalIcon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-display text-lg font-semibold text-navy">Badges</h3>
            <ul className="mt-4 space-y-2">
              {gamificationBadges.map((b, i) =>
              <motion.li
                key={b.label}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
                className="flex items-center gap-3 rounded-lg bg-white px-3 py-2.5 ring-1 ring-hairline">
                
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ocean/10 text-[11px] font-bold text-ocean">
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] font-semibold text-navy">{b.label}</span>
                    <span className="block text-[11px] text-slate-500">{b.desc}</span>
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">{b.points}</span>
                </motion.li>
              )}
            </ul>
          </div>

          <div className="rounded-xl bg-surface p-6 ring-1 ring-hairline">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
              <TrophyIcon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-display text-lg font-semibold text-navy">Classement citoyen</h3>
            <ol className="mt-4 space-y-2">
              {leaderboard.slice(0, 5).map((e) =>
              <li
                key={e.rank}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 ring-1 ${
                e.isCurrentUser ? 'bg-ocean/5 ring-ocean/30' : 'bg-white ring-hairline'}`
                }>
                
                  <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold ${
                  e.rank === 1 ?
                  'bg-amber-400 text-white' :
                  e.rank === 2 ?
                  'bg-slate-300 text-white' :
                  e.rank === 3 ?
                  'bg-amber-700 text-white' :
                  'bg-slate-100 text-slate-500'}`
                  }>
                  
                    {e.rank}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-semibold text-navy">{e.name}</span>
                    <span className="block text-[11px] text-slate-500">{e.zone}</span>
                  </span>
                  <span className="text-[13px] font-bold text-ocean">{e.points} pts</span>
                </li>
              )}
            </ol>
          </div>
        </div>
      </div>
    </section>);

}