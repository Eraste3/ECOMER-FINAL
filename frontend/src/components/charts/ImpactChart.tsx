import React from 'react';
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis } from
'recharts';
import { monthlyImpact } from '../../data/mock-statistics';
import { chartTooltipStyle } from './chartTheme';

export function ImpactChart({
  tone = 'light',
  height = 260



}: {tone?: 'light' | 'dark';height?: number;}) {
  const axis = tone === 'light' ? '#94a3b8' : '#64748b';
  const grid = tone === 'light' ? '#e2e8f0' : 'rgba(148,197,234,0.10)';
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={monthlyImpact} margin={{ top: 6, right: 8, left: -18, bottom: 0 }}>
          <CartesianGrid stroke={grid} strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: axis }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: axis }} axisLine={false} tickLine={false} width={44} />
          <Tooltip {...chartTooltipStyle(tone)} />
          <Bar dataKey="tonnes" name="Tonnes collectées" fill="#1273b8" radius={[4, 4, 0, 0]} barSize={18} />
          <Line
            type="monotone"
            dataKey="surfaceHa"
            name="Surface nettoyée (ha)"
            stroke="#10b981"
            strokeWidth={2.5}
            dot={{ r: 3 }} />
          
        </ComposedChart>
      </ResponsiveContainer>
    </div>);

}