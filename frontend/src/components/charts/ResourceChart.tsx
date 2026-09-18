import React, { useEffect, useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { monitoringSeriesSeed } from '../../data/mock-statistics';
import { chartTooltipStyle } from './chartTheme';

interface Sample {
  label: string;
  cpu: number;
  memoire: number;
}

/** Graphique « temps réel » simulé côté frontend (aucune API). */
export function ResourceChart({ height = 240 }: {height?: number;}) {
  const [data, setData] = useState<Sample[]>(monitoringSeriesSeed.slice(-18));

  useEffect(() => {
    const id = setInterval(() => {
      setData((prev) => {
        const last = prev[prev.length - 1];
        const next: Sample = {
          label: new Date().toLocaleTimeString('fr-FR', { minute: '2-digit', second: '2-digit' }),
          cpu: Math.min(94, Math.max(14, last.cpu + Math.round((Math.random() - 0.5) * 14))),
          memoire: Math.min(92, Math.max(30, last.memoire + Math.round((Math.random() - 0.5) * 9)))
        };
        return [...prev.slice(1), next];
      });
    }, 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 6, right: 8, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id="cpuFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f97316" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#f97316" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="memFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(148,197,234,0.10)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd" />
          
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
            width={40}
            unit="%" />
          
          <Tooltip {...chartTooltipStyle('dark')} />
          <Area
            type="monotone"
            dataKey="cpu"
            name="CPU"
            stroke="#f97316"
            strokeWidth={2}
            fill="url(#cpuFill)"
            isAnimationActive={false} />
          
          <Area
            type="monotone"
            dataKey="memoire"
            name="Mémoire"
            stroke="#22d3ee"
            strokeWidth={2}
            fill="url(#memFill)"
            isAnimationActive={false} />
          
        </AreaChart>
      </ResponsiveContainer>
    </div>);

}