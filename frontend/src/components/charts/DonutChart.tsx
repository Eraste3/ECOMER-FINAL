import React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { cn, formatNumber } from '../../utils/format';
import { chartTooltipStyle } from './chartTheme';

export interface DonutSlice {
  label: string;
  value: number;
  color: string;
}

export function DonutChart({
  data,
  tone = 'light',
  centerLabel,
  height = 230





}: {data: DonutSlice[];tone?: 'light' | 'dark';centerLabel?: string;height?: number;}) {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="relative w-full sm:w-1/2" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              innerRadius="62%"
              outerRadius="92%"
              paddingAngle={2}
              stroke="none">
              
              {data.map((d) =>
              <Cell key={d.label} fill={d.color} />
              )}
            </Pie>
            <Tooltip {...chartTooltipStyle(tone)} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={cn(
              'font-display text-xl font-bold',
              tone === 'light' ? 'text-navy' : 'text-white'
            )}>
            
            {formatNumber(total)}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            {centerLabel ?? 'Total'}
          </span>
        </div>
      </div>
      <ul className="flex-1 space-y-2">
        {data.map((d) =>
        <li key={d.label} className="flex items-center gap-2.5 text-xs">
            <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ backgroundColor: d.color }} />
            <span className={cn('flex-1 truncate', tone === 'light' ? 'text-slate-600' : 'text-slate-300')}>
              {d.label}
            </span>
            <span className={cn('font-semibold tabular-nums', tone === 'light' ? 'text-navy' : 'text-white')}>
              {formatNumber(d.value)}
            </span>
            <span className="w-10 text-right tabular-nums text-slate-400">
              {Math.round(d.value / total * 100)}%
            </span>
          </li>
        )}
      </ul>
    </div>);

}