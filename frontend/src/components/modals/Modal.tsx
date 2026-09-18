import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { XIcon } from 'lucide-react';
import { cn } from '../../utils/format';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  tone?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizes = {
  sm: 'max-w-md',
  md: 'max-w-xl',
  lg: 'max-w-3xl',
  xl: 'max-w-5xl'
};

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  tone = 'light',
  size = 'md'
}: ModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open &&
      <div className="fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-6">
          <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-abyss/70 backdrop-blur-sm" />
        
          <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            'relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl sm:rounded-2xl',
            sizes[size],
            tone === 'light' ? 'bg-white' : 'border border-white/10 bg-navy'
          )}>
          
            <div
            className={cn(
              'flex items-start justify-between gap-4 border-b px-5 py-4',
              tone === 'light' ? 'border-hairline' : 'border-white/10'
            )}>
            
              <div>
                <h2
                className={cn(
                  'font-display text-base font-semibold',
                  tone === 'light' ? 'text-navy' : 'text-white'
                )}>
                
                  {title}
                </h2>
                {subtitle &&
              <p className={cn('mt-0.5 text-xs', tone === 'light' ? 'text-slate-500' : 'text-slate-400')}>
                    {subtitle}
                  </p>
              }
              </div>
              <button
              onClick={onClose}
              aria-label="Fermer"
              className={cn(
                'rounded-lg p-1.5 transition-colors',
                tone === 'light' ? 'text-slate-400 hover:bg-slate-100' : 'text-slate-400 hover:bg-white/10'
              )}>
              
                <XIcon className="h-4 w-4" />
              </button>
            </div>
            <div className="ecomer-scroll flex-1 overflow-y-auto px-5 py-5">{children}</div>
            {footer &&
          <div
            className={cn(
              'flex flex-wrap items-center justify-end gap-2 border-t px-5 py-4',
              tone === 'light' ? 'border-hairline bg-slate-50' : 'border-white/10 bg-white/5'
            )}>
            
                {footer}
              </div>
          }
          </motion.div>
        </div>
      }
    </AnimatePresence>);

}