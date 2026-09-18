import React from 'react';
import { InboxIcon } from 'lucide-react';
import { cn } from '../../utils/format';

export function EmptyState({
  title,
  message,
  icon,
  action,
  tone = 'light'






}: {title: string;message: string;icon?: React.ReactNode;action?: React.ReactNode;tone?: 'light' | 'dark';}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <span
        className={cn(
          'mb-4 flex h-12 w-12 items-center justify-center rounded-xl',
          tone === 'light' ? 'bg-slate-100 text-slate-400' : 'bg-white/5 text-slate-400'
        )}>
        
        {icon ?? <InboxIcon className="h-6 w-6" />}
      </span>
      <p className={cn('font-display text-sm font-semibold', tone === 'light' ? 'text-navy' : 'text-white')}>
        {title}
      </p>
      <p className={cn('mt-1 max-w-sm text-xs', tone === 'light' ? 'text-slate-500' : 'text-slate-400')}>
        {message}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>);

}

export function LoadingState({
  rows = 4,
  tone = 'light'



}: {rows?: number;tone?: 'light' | 'dark';}) {
  return (
    <div className="space-y-3 p-5" aria-busy="true" aria-live="polite">
      {Array.from({ length: rows }).map((_, i) =>
      <div key={i} className="flex items-center gap-3">
          <div className={cn('h-9 w-9 rounded-lg', tone === 'light' ? 'skeleton' : 'bg-white/5')} />
          <div className="flex-1 space-y-2">
            <div
            className={cn('h-3 rounded', tone === 'light' ? 'skeleton' : 'bg-white/5')}
            style={{ width: `${60 + i % 3 * 12}%` }} />
          
            <div className={cn('h-2.5 w-1/3 rounded', tone === 'light' ? 'skeleton' : 'bg-white/5')} />
          </div>
        </div>
      )}
    </div>);

}