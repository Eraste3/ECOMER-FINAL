import React from 'react';
import { motion } from 'framer-motion';
import { TrendingDownIcon, TrendingUpIcon } from 'lucide-react';
import { cn } from '../../utils/format';
import { AnimatedCounter } from '../ui/AnimatedCounter';

export interface KpiCardProps {
  label: string;
  value: number | string;
  suffix?: string;
  icon: React.ReactNode;
  accent?: string;
  trend?: {value: number;label: string;};
  tone?: 'light' | 'dark';
  index?: number;
  onClick?: () => void;
}

export function KpiCard({
  label,
  value,
  suffix,
  icon,
  accent = '#1273b8',
  trend,
  tone = 'light',
  index = 0,
  onClick
}: KpiCardProps) {
  const numeric = typeof value === 'number';
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      onClick={onClick}
      className={cn(
        'relative overflow-hidden rounded-xl p-4 sm:p-5',
        tone === 'light' ? 'bg-white ring-1 ring-hairline shadow-card' : 'glass-dark',
        onClick && 'cursor-pointer transition-transform hover:-translate-y-0.5'
      )}>
      
      <span
        className="absolute inset-x-0 top-0 h-0.5"
        style={{ backgroundColor: accent }}
        aria-hidden="true" />
      
      <div className="flex items-start justify-between gap-3">
        <p
          className={cn(
            'text-[11px] font-semibold uppercase tracking-wider',
            tone === 'light' ? 'text-slate-500' : 'text-slate-400'
          )}>
          
          {label}
        </p>
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${accent}1f`, color: accent }}
          aria-hidden="true">
          
          {icon}
        </span>
      </div>
      <p
        className={cn(
          'mt-3 font-display text-2xl font-bold tabular-nums sm:text-[28px]',
          tone === 'light' ? 'text-navy' : 'text-white'
        )}>
        
        {numeric ? <AnimatedCounter value={value as number} /> : value}
        {suffix && <span className="ml-1 text-base font-semibold text-slate-400">{suffix}</span>}
      </p>
      {trend &&
      <p className="mt-2 flex items-center gap-1.5 text-xs">
          <span
          className={cn(
            'inline-flex items-center gap-0.5 font-semibold',
            trend.value >= 0 ? 'text-eco-green' : 'text-eco-red'
          )}>
          
            {trend.value >= 0 ?
          <TrendingUpIcon className="h-3.5 w-3.5" /> :

          <TrendingDownIcon className="h-3.5 w-3.5" />
          }
            {trend.value >= 0 ? '+' : ''}
            {trend.value}%
          </span>
          <span className={tone === 'light' ? 'text-slate-400' : 'text-slate-500'}>{trend.label}</span>
        </p>
      }
    </motion.div>);

}