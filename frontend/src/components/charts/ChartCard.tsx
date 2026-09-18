import React from 'react';
import { cn } from '../../utils/format';
import { Card, CardHeader } from '../ui/Card';

export function ChartCard({
  title,
  subtitle,
  action,
  tone = 'light',
  className,
  bodyClassName,
  children








}: {title: React.ReactNode;subtitle?: React.ReactNode;action?: React.ReactNode;tone?: 'light' | 'dark';className?: string;bodyClassName?: string;children: React.ReactNode;}) {
  return (
    <Card tone={tone} className={cn('flex flex-col', className)}>
      <CardHeader title={title} subtitle={subtitle} action={action} tone={tone} />
      <div className={cn('flex-1 p-4 sm:p-5', bodyClassName)}>{children}</div>
    </Card>);

}

export function RangeTabs({
  value,
  onChange,
  options,
  tone = 'light'





}: {value: string;onChange: (v: string) => void;options: string[];tone?: 'light' | 'dark';}) {
  return (
    <div
      role="tablist"
      aria-label="Période"
      className={cn(
        'inline-flex rounded-lg p-0.5',
        tone === 'light' ? 'bg-slate-100' : 'bg-white/5 ring-1 ring-inset ring-white/10'
      )}>
      
      {options.map((o) =>
      <button
        key={o}
        role="tab"
        aria-selected={value === o}
        onClick={() => onChange(o)}
        className={cn(
          'rounded-[6px] px-2.5 py-1 text-[11px] font-semibold transition-colors',
          value === o ?
          tone === 'light' ?
          'bg-white text-navy shadow-sm' :
          'bg-eco-orange text-white' :
          tone === 'light' ?
          'text-slate-500 hover:text-navy' :
          'text-slate-400 hover:text-white'
        )}>
        
          {o}
        </button>
      )}
    </div>);

}