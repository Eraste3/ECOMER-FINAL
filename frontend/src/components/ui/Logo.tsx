import React from 'react';
import { cn } from '../../utils/format';

export function EcomerLogo({
  size = 'md',
  tone = 'dark',
  subtitle




}: {size?: 'sm' | 'md' | 'lg';tone?: 'light' | 'dark';subtitle?: string;}) {
  const box = size === 'sm' ? 'h-8 w-8' : size === 'lg' ? 'h-12 w-12' : 'h-10 w-10';
  const text = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-lg';
  return (
    <span className="flex items-center gap-2.5">
      <span
        className={cn(
          'relative flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-navy ring-1 ring-inset ring-cyan-ecomer/30',
          box
        )}
        aria-hidden="true">
        
        <svg viewBox="0 0 40 40" className="h-full w-full">
          <rect width="40" height="40" fill="#071b2e" />
          <path d="M0 26c6-5 10 3 16-1s12 3 18-2v17H0z" fill="#0e4f7d" />
          <path d="M0 31c6-5 10 3 16-1s12 3 18-2v12H0z" fill="#22d3ee" opacity="0.85" />
          <circle cx="20" cy="14" r="6.5" fill="none" stroke="#22d3ee" strokeWidth="2" />
          <circle cx="20" cy="14" r="2" fill="#f97316" />
        </svg>
      </span>
      <span className="min-w-0">
        <span
          className={cn(
            'block font-display font-bold leading-none tracking-tight',
            text,
            tone === 'dark' ? 'text-white' : 'text-navy'
          )}>
          
          ECOMER
        </span>
        <span
          className={cn(
            'block truncate text-[10px] font-medium uppercase tracking-[0.14em]',
            tone === 'dark' ? 'text-cyan-ecomer/70' : 'text-ocean/70'
          )}>
          
          {subtitle ?? 'Pointe-Noire'}
        </span>
      </span>
    </span>);

}