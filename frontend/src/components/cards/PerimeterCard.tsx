import React from 'react';
import { CalendarIcon, FlagIcon, RulerIcon } from 'lucide-react';
import { SeverityBadge, StatusBadge } from '../status/StatusBadge';
import { cn, formatArea, formatDate } from '../../utils/format';
import { perimeterStatusMeta, wasteMeta } from '../../utils/labels';
import type { Perimeter } from '../../types';

export function PerimeterCard({
  perimeter,
  tone = 'light',
  active,
  onClick,
  action






}: {perimeter: Perimeter;tone?: 'light' | 'dark';active?: boolean;onClick?: () => void;action?: React.ReactNode;}) {
  const dark = tone === 'dark';
  return (
    <article
      onClick={onClick}
      className={cn(
        'rounded-xl p-4 transition-colors',
        dark ?
        active ?
        'bg-white/10 ring-1 ring-inset ring-cyan-ecomer/40' :
        'bg-white/5 ring-1 ring-inset ring-white/10 hover:bg-white/10' :
        active ?
        'bg-ocean/5 ring-2 ring-ocean' :
        'bg-white ring-1 ring-hairline hover:ring-ocean/40',
        onClick && 'cursor-pointer'
      )}>
      
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className={cn('font-display text-sm font-bold', dark ? 'text-white' : 'text-navy')}>
            {perimeter.id}
          </p>
          <p className={cn('text-[11px]', dark ? 'text-slate-400' : 'text-slate-500')}>
            {perimeter.zone} · {wasteMeta[perimeter.dominantWaste].short}
          </p>
        </div>
        <SeverityBadge severity={perimeter.severity} dark={dark} />
      </div>

      <dl className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
        <div>
          <dt className={cn('flex items-center gap-1', dark ? 'text-slate-500' : 'text-slate-400')}>
            <FlagIcon className="h-3 w-3" />
            Signalements
          </dt>
          <dd className={cn('mt-0.5 font-bold', dark ? 'text-white' : 'text-navy')}>
            {perimeter.reportCount}
          </dd>
        </div>
        <div>
          <dt className={cn('flex items-center gap-1', dark ? 'text-slate-500' : 'text-slate-400')}>
            <RulerIcon className="h-3 w-3" />
            Surface
          </dt>
          <dd className={cn('mt-0.5 font-bold', dark ? 'text-white' : 'text-navy')}>
            {formatArea(perimeter.areaM2)}
          </dd>
        </div>
        <div>
          <dt className={cn('flex items-center gap-1', dark ? 'text-slate-500' : 'text-slate-400')}>
            <CalendarIcon className="h-3 w-3" />
            Créé le
          </dt>
          <dd className={cn('mt-0.5 font-bold', dark ? 'text-white' : 'text-navy')}>
            {formatDate(perimeter.createdAt)}
          </dd>
        </div>
      </dl>

      <div className="mt-3 flex items-center justify-between gap-2">
        <StatusBadge
          label={perimeterStatusMeta[perimeter.status].label}
          tone={perimeterStatusMeta[perimeter.status].tone}
          dark={dark} />
        
        {action}
      </div>
    </article>);

}