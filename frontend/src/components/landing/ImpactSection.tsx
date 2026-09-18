import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedCounter } from '../ui/AnimatedCounter';
import { ImpactChart } from '../charts/ImpactChart';
import { platformStats } from '../../data/mock-statistics';
import { MEDIA } from '../../data/media';

const impact = [
{ label: 'Zones nettoyées', value: platformStats.resolvedZones, unit: '' },
{ label: 'Citoyens actifs', value: platformStats.activeCitizens, unit: '' },
{ label: 'ONG partenaires', value: platformStats.partnerOngs, unit: '' },
{ label: 'Déchets collectés', value: platformStats.collectedTons, unit: 't' }];


export function ImpactSection() {
  return (
    <section id="impact" className="bg-surface py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ocean-bright">Impact mesuré</p>
          <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-navy sm:text-3xl">
            Des résultats visibles sur le terrain
          </h2>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <div className="grid grid-cols-2 gap-4">
            {impact.map((s, i) =>
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="rounded-xl bg-white p-5 ring-1 ring-hairline shadow-card">
              
                <p className="font-display text-3xl font-bold text-ocean">
                  <AnimatedCounter value={s.value} />
                  {s.unit && <span className="text-lg text-slate-400">{s.unit}</span>}
                </p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  {s.label}
                </p>
              </motion.div>
            )}
            <div className="col-span-2 overflow-hidden rounded-xl ring-1 ring-hairline">
              <div className="grid grid-cols-2">
                <figure className="relative">
                  <img src={MEDIA.beforePlastic} alt="Littoral pollué avant intervention" className="h-40 w-full object-cover" />
                  <figcaption className="absolute left-2 top-2 rounded bg-abyss/80 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                    Avant
                  </figcaption>
                </figure>
                <figure className="relative">
                  <img src={MEDIA.afterClean} alt="Littoral assaini après intervention" className="h-40 w-full object-cover" />
                  <figcaption className="absolute left-2 top-2 rounded bg-eco-green/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                    Après
                  </figcaption>
                </figure>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-5 ring-1 ring-hairline shadow-card">
            <h3 className="font-display text-base font-semibold text-navy">Évolution mensuelle</h3>
            <p className="mt-1 text-xs text-slate-500">Tonnes collectées et surface nettoyée (hectares)</p>
            <div className="mt-4">
              <ImpactChart height={300} />
            </div>
          </div>
        </div>
      </div>
    </section>);

}