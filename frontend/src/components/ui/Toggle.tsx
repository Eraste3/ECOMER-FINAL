import React from 'react';
import { cn } from '../../utils/format';

export function Toggle({
  checked,
  onChange,
  label,
  description,
  tone = 'light'






}: {checked: boolean;onChange: () => void;label: string;description?: string;tone?: 'light' | 'dark';}) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 rounded-lg px-3 py-3 transition-colors',
        tone === 'light' ? 'hover:bg-slate-50' : 'hover:bg-white/5'
      )}>
      
      <div className="min-w-0">
        <p className={cn('text-sm font-medium', tone === 'light' ? 'text-navy' : 'text-white')}>{label}</p>
        {description &&
        <p className={cn('mt-0.5 text-xs', tone === 'light' ? 'text-slate-500' : 'text-slate-400')}>
            {description}
          </p>
        }
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span
          className={cn(
            'w-8 text-[10px] font-bold uppercase tracking-wide',
            checked ? 'text-eco-green' : tone === 'light' ? 'text-slate-400' : 'text-slate-500'
          )}>
          
          {checked ? 'ON' : 'OFF'}
        </span>
        <button
          role="switch"
          aria-checked={checked}
          aria-label={label}
          onClick={onChange}
          className={cn(
            'relative h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-eco-orange',
            checked ? 'bg-eco-orange' : tone === 'light' ? 'bg-slate-300' : 'bg-white/15'
          )}>
          
          <span
            className={cn(
              'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
              checked ? 'translate-x-[22px]' : 'translate-x-0.5'
            )} />
          
        </button>
      </div>
    </div>);

}