import React from 'react';
import { cn } from '../../utils/format';

type Variant = 'primary' | 'accent' | 'secondary' | 'ghost' | 'danger' | 'success' | 'outline-dark';
type Size = 'sm' | 'md' | 'lg';

const variants: Record<Variant, string> = {
  primary: 'bg-ocean text-white hover:bg-ocean-bright focus-visible:outline-ocean',
  accent: 'bg-eco-orange text-white hover:bg-orange-600 focus-visible:outline-eco-orange',
  secondary: 'bg-white text-navy ring-1 ring-inset ring-hairline hover:bg-slate-50',
  ghost: 'text-slate-600 hover:bg-slate-100',
  danger: 'bg-eco-red text-white hover:bg-red-600',
  success: 'bg-eco-green text-white hover:bg-emerald-600',
  'outline-dark': 'text-white/90 ring-1 ring-inset ring-white/20 hover:bg-white/10'
};

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-[15px] gap-2.5'
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: React.ReactNode;
  block?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  block,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-semibold transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        sizes[size],
        block && 'w-full',
        className
      )}
      {...rest}>
      
      {icon}
      {children}
    </button>);

}