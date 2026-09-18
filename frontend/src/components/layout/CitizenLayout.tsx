import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AwardIcon, BellIcon, ListChecksIcon, MapIcon, PlusIcon, UserIcon } from 'lucide-react';
import { cn } from '../../utils/format';
import { EcomerLogo } from '../ui/Logo';
import { NotificationPanel } from '../notifications/NotificationPanel';
import { useEcomer } from '../../contexts/EcomerContext';

const tabs = [
{ to: '/citoyens', label: 'Carte', icon: MapIcon, end: true },
{ to: '/citoyens/mes-signalements', label: 'Signalements', icon: ListChecksIcon },
{ to: '/citoyens/ecopoints', label: 'EcoPoints', icon: AwardIcon }];


export function CitizenLayout() {
  const [notifOpen, setNotifOpen] = useState(false);
  const { notificationsFor, ecoPoints, currentUser } = useEcomer();
  const unread = notificationsFor('citoyen').filter((n) => !n.read).length;
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const onReportFlow = pathname === '/citoyens/signaler';

  return (
    <div className="flex min-h-screen w-full flex-col bg-surface">
      <header className="sticky top-0 z-30 border-b border-hairline bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-3 px-4">
          <button onClick={() => navigate('/citoyens')} className="shrink-0" aria-label="Accueil citoyen">
            <EcomerLogo size="sm" tone="light" subtitle="Espace citoyen" />
          </button>

          <nav className="ml-6 hidden items-center gap-1 md:flex" aria-label="Navigation citoyenne">
            {tabs.map((t) =>
            <NavLink
              key={t.to}
              to={t.to}
              end={t.end}
              className={({ isActive }) =>
              cn(
                'rounded-lg px-3 py-2 text-[13px] font-semibold transition-colors',
                isActive ? 'bg-ocean/10 text-ocean' : 'text-slate-500 hover:text-navy'
              )
              }>
              
                {t.label}
              </NavLink>
            )}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <span className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 ring-1 ring-inset ring-emerald-200 sm:flex">
              <AwardIcon className="h-3.5 w-3.5" />
              {ecoPoints} EcoPoints
            </span>
            <div className="relative">
              <button
                onClick={() => setNotifOpen((v) => !v)}
                aria-label={`Notifications (${unread} non lues)`}
                className="relative rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100">
                
                <BellIcon className="h-5 w-5" />
                {unread > 0 &&
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-eco-orange px-1 text-[10px] font-bold text-white">
                    {unread}
                  </span>
                }
              </button>
              <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} role="citoyen" />
            </div>
            <button
              className="flex items-center gap-2 rounded-full bg-navy py-1 pl-1 pr-3 text-white"
              aria-label="Profil">
              
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ocean text-[10px] font-bold">
                {currentUser.name.
                split(' ').
                map((p) => p[0]).
                join('')}
              </span>
              <span className="hidden text-xs font-semibold sm:inline">{currentUser.name.split(' ')[0]}</span>
              <UserIcon className="h-3.5 w-3.5 sm:hidden" />
            </button>
          </div>
        </div>
      </header>

      <motion.main
        key={pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="mx-auto w-full max-w-6xl flex-1 px-0 pb-24 sm:px-4 sm:py-5 md:pb-8">
        
        <Outlet />
      </motion.main>

      {/* Bouton flottant principal */}
      {!onReportFlow &&
      <button
        onClick={() => navigate('/citoyens/signaler')}
        className="fixed bottom-24 right-4 z-30 flex items-center gap-2 rounded-full bg-eco-orange px-5 py-4 font-display text-sm font-bold text-white shadow-float transition-transform hover:scale-105 active:scale-95 md:bottom-8 md:right-8">
        
          <PlusIcon className="h-5 w-5" strokeWidth={3} />
          Signaler
        </button>
      }

      {/* Bottom navigation mobile */}
      <nav
        className="fixed inset-x-0 bottom-0 z-30 border-t border-hairline bg-white/95 backdrop-blur-xl md:hidden"
        aria-label="Navigation mobile">
        
        <ul className="flex items-stretch">
          {tabs.map((t) =>
          <li key={t.to} className="flex-1">
              <NavLink
              to={t.to}
              end={t.end}
              className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-1 py-3 text-[10px] font-semibold transition-colors',
                isActive ? 'text-ocean' : 'text-slate-400'
              )
              }>
              
                <t.icon className="h-5 w-5" />
                {t.label}
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
    </div>);

}