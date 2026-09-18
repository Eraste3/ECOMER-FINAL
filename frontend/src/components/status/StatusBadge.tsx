import React from 'react';
import { cn } from '../../utils/format';
import { severityMeta, toneClasses, toneClassesDark, type Tone } from '../../utils/labels';
import type { Severity } from '../../types';

export function StatusBadge({
  label,
  tone = 'neutral',
  dark,
  className,
  icon






}: {label: string;tone?: Tone;dark?: boolean;className?: string;icon?: React.ReactNode;}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset',
        dark ? toneClassesDark[tone] : toneClasses[tone],
        className
      )}>
      
      {icon}
      {label}
    </span>);

}

export function SeverityBadge({
  severity,
  dark,
  className




}: {severity: Severity;dark?: boolean;className?: string;}) {
  const meta = severityMeta[severity];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset',
        className
      )}
      style={{
        color: dark ? meta.color : undefined,
        backgroundColor: dark ? `${meta.color}1a` : `${meta.color}14`,
        borderColor: 'transparent',
        boxShadow: `inset 0 0 0 1px ${meta.color}33`
      }}>
      
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: meta.color }} />
      <span style={{ color: dark ? meta.color : meta.color }}>{meta.label}</span>
    </span>);

}