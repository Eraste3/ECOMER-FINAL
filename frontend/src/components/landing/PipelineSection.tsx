import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRightIcon } from 'lucide-react';
import { pipeline } from '../../data/landing-content';

export function PipelineSection() {
  return (
    <section className="relative overflow-hidden bg-navy py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-cyan-ecomer">
            La chaîne de valeur ECOMER
          </p>
          <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Un signalement ne se perd jamais : il devient une décision
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            L’élément différenciateur d’ECOMER est ce pipeline complet : chaque photo citoyenne est
            analysée, géolocalisée, regroupée en périmètre, autorisée, traitée puis prouvée.
          </p>
        </div>

        <div className="ecomer-scroll mt-10 -mx-4 overflow-x-auto px-4 pb-3">
          <ol className="flex min-w-max items-stretch gap-2">
            {pipeline.map((p, i) =>
            <React.Fragment key={p.label}>
                <motion.li
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
                className="relative w-[168px] shrink-0 rounded-xl border border-white/10 bg-white/[0.04] p-4">
                
                  <span
                  className="absolute inset-x-0 top-0 h-0.5 rounded-t-xl"
                  style={{ backgroundColor: p.color }} />
                
                  <span
                  className="font-display text-[11px] font-bold"
                  style={{ color: p.color }}>
                  
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="mt-1.5 font-display text-[13px] font-semibold leading-snug text-white">
                    {p.label}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400">{p.detail}</p>
                </motion.li>
                {i < pipeline.length - 1 &&
              <li className="flex shrink-0 items-center" aria-hidden="true">
                    <ChevronRightIcon className="h-4 w-4 text-slate-600" />
                  </li>
              }
              </React.Fragment>
            )}
          </ol>
        </div>
      </div>
    </section>);

}