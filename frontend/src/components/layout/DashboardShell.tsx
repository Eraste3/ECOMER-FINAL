import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { BellIcon, ChevronRightIcon, LogOutIcon, MenuIcon, SearchIcon, XIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../../utils/format';
import { EcomerLogo } from '../ui/Logo';
import { NotificationPanel } from '../notifications/NotificationPanel';
import { useEcomer } from '../../contexts/EcomerContext';
import type { UserRole } from '../../types';

export interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
  end?: boolean;
}

export interface DashboardShellProps {
  navItems: NavItem[];
  role: UserRole;
  brandSubtitle: string;
  roleBadge: string;
  userName: string;
  userMeta: string;
  theme: 'dark' | 'light';
  title: string;
  breadcrumb?: string;
  headerActions?: React.ReactNode;
  children: React.ReactNode;
}

export function DashboardShell({
  navItems,
  role,
  brandSubtitle,
  roleBadge,
  userName,
  userMeta,
  theme,
  title,
  breadcrumb,
  headerActions,
  children
}: DashboardShellProps) {
  const [drawer, setDrawer] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { notificationsFor } = useEcomer();
  const unread = notificationsFor(role).filter((n) => !n.read).length;
  const location = useLocation();

  const dark = theme === 'dark';

  const sidebar =
  <div className="flex h-full flex-col bg-navy">
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-4">
        <EcomerLogo size="sm" subtitle={brandSubtitle} />
        <button
        onClick={() => setDrawer(false)}
        className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 lg:hidden"
        aria-label="Fermer le menu">
        
          <XIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="px-4 py-3">
        <span className="inline-flex items-center gap-1.5 rounded-md bg-eco-orange/15 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-eco-orange ring-1 ring-inset ring-eco-orange/30">
          {roleBadge}
        </span>
      </div>

      <nav className="ecomer-scroll flex-1 overflow-y-auto px-2 pb-4" aria-label="Navigation principale">
        <ul className="space-y-0.5">
          {navItems.map((item) =>
        <li key={item.to}>
              <NavLink
            to={item.to}
            end={item.end}
            onClick={() => setDrawer(false)}
            className={({ isActive }) =>
            cn(
              'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors',
              isActive ?
              'bg-white/10 text-white ring-1 ring-inset ring-cyan-ecomer/25' :
              'text-slate-400 hover:bg-white/5 hover:text-white'
            )
            }>
            
                <span className="shrink-0 [&>svg]:h-4 [&>svg]:w-4">{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </NavLink>
            </li>
        )}
        </ul>
      </nav>

      <div className="shrink-0 border-t border-white/10 p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ocean text-xs font-bold text-white">
            {userName.
          split(' ').
          map((p) => p[0]).
          slice(0, 2).
          join('')}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-white">{userName}</p>
            <p className="truncate text-[10px] text-slate-400">{userMeta}</p>
          </div>
        </div>
        <button className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-white">
          <LogOutIcon className="h-4 w-4" />
          Déconnexion
        </button>
      </div>
    </div>;


  return (
    <div className={cn('flex min-h-screen w-full', dark ? 'bg-abyss' : 'bg-surface')}>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 shrink-0 border-r border-white/10 lg:block">
        {sidebar}
      </aside>

      <AnimatePresence>
        {drawer &&
        <>
            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDrawer(false)}
            className="fixed inset-0 z-40 bg-abyss/70 backdrop-blur-sm lg:hidden" />
          
            <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="fixed inset-y-0 left-0 z-50 w-[280px] lg:hidden">
            
              {sidebar}
            </motion.aside>
          </>
        }
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <header
          className={cn(
            'sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 px-4 sm:px-6',
            dark ?
            'border-b border-white/10 bg-navy/80 backdrop-blur-xl' :
            'border-b border-hairline bg-white/85 backdrop-blur-xl'
          )}>
          
          <button
            onClick={() => setDrawer(true)}
            aria-label="Ouvrir le menu"
            className={cn(
              'rounded-lg p-2 lg:hidden',
              dark ? 'text-slate-300 hover:bg-white/10' : 'text-slate-600 hover:bg-slate-100'
            )}>
            
            <MenuIcon className="h-5 w-5" />
          </button>

          <div className="min-w-0 flex-1">
            {breadcrumb &&
            <p className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
                <span>{breadcrumb}</span>
                <ChevronRightIcon className="h-3 w-3" />
                <span className={dark ? 'text-slate-300' : 'text-slate-600'}>{title}</span>
              </p>
            }
            <h1
              className={cn(
                'truncate font-display text-[17px] font-semibold leading-tight',
                dark ? 'text-white' : 'text-navy'
              )}>
              
              {title}
            </h1>
          </div>

          <div className="hidden items-center md:flex">
            <label className="relative">
              <span className="sr-only">Rechercher</span>
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                placeholder="Rechercher un périmètre, une ONG…"
                className={cn(
                  'h-9 w-64 rounded-lg pl-9 pr-3 text-xs outline-none transition-colors',
                  dark ?
                  'bg-white/5 text-white ring-1 ring-inset ring-white/10 placeholder:text-slate-500 focus:ring-cyan-ecomer/40' :
                  'bg-slate-100 text-navy ring-1 ring-inset ring-transparent placeholder:text-slate-400 focus:bg-white focus:ring-ocean/30'
                )} />
              
            </label>
          </div>

          {headerActions}

          <div className="relative">
            <button
              onClick={() => setNotifOpen((v) => !v)}
              aria-label={`Notifications (${unread} non lues)`}
              className={cn(
                'relative rounded-lg p-2 transition-colors',
                dark ? 'text-slate-300 hover:bg-white/10' : 'text-slate-600 hover:bg-slate-100'
              )}>
              
              <BellIcon className="h-5 w-5" />
              {unread > 0 &&
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-eco-orange px-1 text-[10px] font-bold text-white">
                  {unread}
                </span>
              }
            </button>
            <NotificationPanel
              open={notifOpen}
              onClose={() => setNotifOpen(false)}
              role={role}
              tone={dark ? 'dark' : 'light'} />
            
          </div>

          <span
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold',
              dark ? 'bg-white/10 text-white' : 'bg-navy text-white'
            )}
            aria-hidden="true">
            
            {userName.
            split(' ').
            map((p) => p[0]).
            slice(0, 2).
            join('')}
          </span>
        </header>

        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="flex-1 px-4 py-5 sm:px-6 sm:py-6">
          
          {children}
        </motion.main>
      </div>
    </div>);

}