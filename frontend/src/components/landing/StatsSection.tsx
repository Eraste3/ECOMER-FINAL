import React from 'react';
import { motion } from 'framer-motion';
import { FlagIcon, RecycleIcon, ShapesIcon, SparklesIcon } from 'lucide-react';
import { AnimatedCounter } from '../ui/AnimatedCounter';
import { platformStats } from '../../data/mock-statistics';

const stats = [
{
  label: 'Signalements reçus',
  value: platformStats.totalReports,
  icon: FlagIcon,
  color: '#22d3ee',
  suffix: ''
},
{
  label: 'Périmètres actifs',
  value: platformStats.activePerimeters,
  icon: ShapesIcon,
  color: '#f97316',
  suffix: ''
},
{
  label: 'Zones résolues',
  value: platformStats.resolvedZones,
  icon: SparklesIcon,
  color: '#10b981',
  suffix: ''
},
{
  label: 'Déchets collectés',
  value: platformStats.collectedTons,
  icon: RecycleIcon,
  color: '#1273b8',
  suffix: 'tonnes'
}];


export function StatsSection() {
  return (
    <section className="border-y border-hairline bg-white py-12">
      <div className="mx-auto grid w-full max-w-7xl gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        {stats.map((s, i) =>
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.4, delay: i * 0.07 }}
          className="flex items-center gap-4 rounded-xl bg-surface p-5 ring-1 ring-hairline">
          
            <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${s.color}1f`, color: s.color }}>
            
              <s.icon className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-2xl font-bold text-navy">
                <AnimatedCounter value={s.value} />
                {s.suffix && <span className="ml-1 text-sm font-semibold text-slate-400">{s.suffix}</span>}
              </p>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{s.label}</p>
            </div>
          </motion.div>
        )}
      </div>
    </section>);

}