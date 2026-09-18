import React from 'react';
import { cn } from '../../utils/format';

export interface CardProps {
  tone?: 'light' | 'dark';
  className?: string;
  children: React.ReactNode;
  as?: 'div' | 'section' | 'article';
}

export function Card({ tone = 'light', className, children, as = 'div' }: CardProps) {
  const Tag = as;
  return (
    <Tag
      className={cn(
        'rounded-xl',
        tone === 'light' ?
        'bg-white ring-1 ring-hairline shadow-card' :
        'glass-dark rounded-xl shadow-float',
        className
      )}>
      
      {children}
    </Tag>);

}

export function CardHeader({
  title,
  subtitle,
  action,
  tone = 'light',
  className






}: {title: React.ReactNode;subtitle?: React.ReactNode;action?: React.ReactNode;tone?: 'light' | 'dark';className?: string;}) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-start justify-between gap-3 border-b px-5 py-4',
        tone === 'light' ? 'border-hairline' : 'border-white/10',
        className
      )}>
      
      <div className="min-w-0">
        <h3
          className={cn(
            'font-display text-[15px] font-semibold',
            tone === 'light' ? 'text-navy' : 'text-white'
          )}>
          
          {title}
        </h3>
        {subtitle &&
        <p className={cn('mt-0.5 text-xs', tone === 'light' ? 'text-slate-500' : 'text-slate-400')}>
            {subtitle}
          </p>
        }
      </div>
      {action}
    </div>);

}