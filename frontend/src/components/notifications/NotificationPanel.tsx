import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangleIcon,
  Building2Icon,
  CheckCircle2Icon,
  CpuIcon,
  InboxIcon,
  MapPinIcon } from
'lucide-react';
import { cn, relativeTime } from '../../utils/format';
import { notificationMeta, toneClasses, toneClassesDark } from '../../utils/labels';
import { useEcomer } from '../../contexts/EcomerContext';
import type { UserRole } from '../../types';

const icons: Record<string, React.ReactNode> = {
  alert: <AlertTriangleIcon className="h-4 w-4" />,
  inbox: <InboxIcon className="h-4 w-4" />,
  pin: <MapPinIcon className="h-4 w-4" />,
  check: <CheckCircle2Icon className="h-4 w-4" />,
  building: <Building2Icon className="h-4 w-4" />,
  cpu: <CpuIcon className="h-4 w-4" />
};

export function NotificationPanel({
  open,
  onClose,
  role,
  tone = 'light'





}: {open: boolean;onClose: () => void;role: UserRole;tone?: 'light' | 'dark';}) {
  const { notificationsFor, markAllRead } = useEcomer();
  const items = notificationsFor(role);

  return (
    <AnimatePresence>
      {open &&
      <>
          <div className="fixed inset-0 z-40" onClick={onClose} aria-hidden="true" />
          <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ duration: 0.18 }}
          role="dialog"
          aria-label="Notifications"
          className={cn(
            'absolute right-0 top-12 z-50 w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-xl shadow-float',
            tone === 'light' ? 'bg-white ring-1 ring-hairline' : 'border border-white/10 bg-navy'
          )}>
          
            <div
            className={cn(
              'flex items-center justify-between border-b px-4 py-3',
              tone === 'light' ? 'border-hairline' : 'border-white/10'
            )}>
            
              <p
              className={cn(
                'font-display text-sm font-semibold',
                tone === 'light' ? 'text-navy' : 'text-white'
              )}>
              
                Notifications
              </p>
              <button
              onClick={() => markAllRead(role)}
              className="text-[11px] font-semibold text-ocean-bright hover:underline">
              
                Tout marquer comme lu
              </button>
            </div>
            <ul className="ecomer-scroll max-h-[60vh] divide-y overflow-y-auto">
              {items.map((n) => {
              const meta = notificationMeta[n.kind];
              return (
                <li
                  key={n.id}
                  className={cn(
                    'flex gap-3 px-4 py-3',
                    tone === 'light' ? 'divide-hairline' : 'divide-white/5',
                    !n.read && (tone === 'light' ? 'bg-sky-50/40' : 'bg-white/[0.03]')
                  )}>
                  
                    <span
                    className={cn(
                      'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ring-1 ring-inset',
                      tone === 'light' ? toneClasses[meta.tone] : toneClassesDark[meta.tone]
                    )}>
                    
                      {icons[meta.icon]}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p
                      className={cn(
                        'text-[13px] font-semibold',
                        tone === 'light' ? 'text-navy' : 'text-white'
                      )}>
                      
                        {n.title}
                      </p>
                      <p className={cn('mt-0.5 text-xs', tone === 'light' ? 'text-slate-600' : 'text-slate-400')}>
                        {n.body}
                      </p>
                      <p className="mt-1 text-[10px] uppercase tracking-wide text-slate-400">
                        {relativeTime(n.createdAt)}
                      </p>
                    </div>
                    {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-eco-orange" />}
                  </li>);

            })}
            </ul>
          </motion.div>
        </>
      }
    </AnimatePresence>);

}