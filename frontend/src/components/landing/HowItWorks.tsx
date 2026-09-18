import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2Icon, FlagIcon, LayersIcon, MapPinIcon, TruckIcon } from 'lucide-react';
import { howItWorks } from '../../data/landing-content';

const icons = {
  flag: FlagIcon,
  pin: MapPinIcon,
  layers: LayersIcon,
  truck: TruckIcon,
  check: CheckCircle2Icon
};

export function HowItWorks() {
  return (
    <section id="fonctionnement" className="bg-white py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ocean-bright">
            Comment ça fonctionne
          </p>
          <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-navy sm:text-3xl">
            Du signalement citoyen à la zone assainie
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Cinq étapes, un seul flux de décision partagé entre les citoyens, les ONG et les services
            municipaux.
          </p>
        </div>

        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {howItWorks.map((step, i) => {
            const Icon = icons[step.icon];
            return (
              <motion.li
                key={step.n}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="relative rounded-xl bg-surface p-5 ring-1 ring-hairline">
                
                <span
                  className="absolute right-4 top-4 font-display text-2xl font-bold opacity-20"
                  style={{ color: step.color }}>
                  
                  {step.n}
                </span>
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${step.color}1f`, color: step.color }}>
                  
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-base font-semibold text-navy">{step.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-slate-600">{step.text}</p>
              </motion.li>);

          })}
        </ol>
      </div>
    </section>);

}