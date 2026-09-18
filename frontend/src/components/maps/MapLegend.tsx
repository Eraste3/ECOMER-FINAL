import React from 'react';
import { cn } from '../../utils/format';
import { severityMeta, severityOrder } from '../../utils/labels';

export function MapLegend({
  tone = 'dark',
  className,
  extras = true




}: {tone?: 'light' | 'dark';className?: string;extras?: boolean;}) {
  return (
    <div
      className={cn(
        'rounded-lg px-3 py-2.5 text-[11px]',
        tone === 'dark' ?
        'glass-dark text-slate-300' :
        'bg-white/90 ring-1 ring-hairline text-slate-600 backdrop-blur',
        className
      )}>
      
      <p
        className={cn(
          'mb-2 text-[10px] font-bold uppercase tracking-wider',
          tone === 'dark' ? 'text-white/70' : 'text-navy'
        )}>
        
        Légende
      </p>
      <ul className="space-y-1.5">
        {severityOrder.map((s) =>
        <li key={s} className="flex items-center gap-2">
            <span
            className="h-2.5 w-4 rounded-sm"
            style={{ backgroundColor: `${severityMeta[s].color}59`, boxShadow: `inset 0 0 0 1.5px ${severityMeta[s].color}` }} />
          
            {severityMeta[s].label}
          </li>
        )}
        {extras &&
        <>
            <li className="flex items-center gap-2">
              <span className="h-2.5 w-4 rounded-sm border border-dashed border-emerald-500 bg-emerald-500/20" />
              Zone résolue
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cyan-ecomer" />
              Signalement citoyen
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full ring-1 ring-eco-orange" />
              Signalement ONG prioritaire
            </li>
          </>
        }
      </ul>
    </div>);

}