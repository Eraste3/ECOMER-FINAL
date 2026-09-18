import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/format';
import { severityDistribution } from '../../data/mock-statistics';

export function SeverityChart({ tone = 'light' }: {tone?: 'light' | 'dark';}) {
  const max = Math.max(...severityDistribution.map((s) => s.value));
  return (
    <ul className="space-y-4">
      {severityDistribution.map((s, i) =>
      <li key={s.severity}>
          <div className="mb-1.5 flex items-baseline justify-between text-xs">
            <span className={cn('font-medium', tone === 'light' ? 'text-slate-600' : 'text-slate-300')}>
              {s.label}
            </span>
            <span
            className={cn(
              'font-display font-bold tabular-nums',
              tone === 'light' ? 'text-navy' : 'text-white'
            )}>
            
              {s.value}
              <span className="ml-1 text-[10px] font-semibold text-slate-400">périmètres</span>
            </span>
          </div>
          <div className={cn('h-2.5 w-full overflow-hidden rounded-full', tone === 'light' ? 'bg-slate-100' : 'bg-white/5')}>
            <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${s.value / max * 100}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{ backgroundColor: s.color }} />
          
          </div>
        </li>
      )}
    </ul>);

}