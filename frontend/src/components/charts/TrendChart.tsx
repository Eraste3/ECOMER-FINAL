import React from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis } from
'recharts';
import type { SeriesPoint } from '../../data/mock-statistics';
import { chartTooltipStyle } from './chartTheme';

export function TrendChart({
  data,
  tone = 'light',
  height = 260,
  showResolved = true





}: {data: SeriesPoint[];tone?: 'light' | 'dark';height?: number;showResolved?: boolean;}) {
  const axis = tone === 'light' ? '#94a3b8' : '#64748b';
  const grid = tone === 'light' ? '#e2e8f0' : 'rgba(148,197,234,0.10)';

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 6, right: 8, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.45} />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={grid} strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: axis }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd" />
          
          <YAxis tick={{ fontSize: 11, fill: axis }} axisLine={false} tickLine={false} width={44} />
          <Tooltip {...chartTooltipStyle(tone)} />
          <Area
            type="monotone"
            dataKey="signalements"
            name="Signalements"
            stroke="#22d3ee"
            strokeWidth={2.5}
            fill="url(#trendFill)" />
          
          {showResolved &&
          <Line
            type="monotone"
            dataKey="resolus"
            name="Zones résolues"
            stroke="#10b981"
            strokeWidth={2}
            dot={false} />

          }
        </AreaChart>
      </ResponsiveContainer>
    </div>);

}