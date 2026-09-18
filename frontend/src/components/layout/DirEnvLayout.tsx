import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { GaugeIcon, InboxIcon, LayoutDashboardIcon, MapIcon, TruckIcon } from 'lucide-react';
import { DashboardShell, type NavItem } from './DashboardShell';

const navItems: NavItem[] = [
{ to: '/dirEnv', label: 'Supervision', icon: <LayoutDashboardIcon />, end: true },
{ to: '/dirEnv/demandes', label: 'Guichet unique', icon: <InboxIcon /> },
{ to: '/dirEnv/carte', label: 'Carte stratégique', icon: <MapIcon /> },
{ to: '/dirEnv/interventions', label: 'Interventions municipales', icon: <TruckIcon /> },
{ to: '/dirEnv/kpi', label: 'Indicateurs', icon: <GaugeIcon /> }];


const titles: Record<string, string> = {
  '/dirEnv': 'Supervision environnementale',
  '/dirEnv/demandes': 'Demandes à traiter',
  '/dirEnv/carte': 'Carte stratégique de Pointe-Noire',
  '/dirEnv/interventions': 'Interventions municipales',
  '/dirEnv/kpi': 'Indicateurs de performance'
};

export function DirEnvLayout() {
  const { pathname } = useLocation();
  return (
    <DashboardShell
      navItems={navItems}
      role="direnv"
      brandSubtitle="Direction Env."
      roleBadge="Direction Environnement"
      userName="Alphonse Ngoma"
      userMeta="Mairie de Pointe-Noire"
      theme="light"
      title={titles[pathname] ?? 'Direction de l’Environnement'}
      breadcrumb="Direction de l’Environnement">
      
      <Outlet />
    </DashboardShell>);

}