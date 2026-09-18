import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import {
  BarChart3Icon,
  ClipboardCheckIcon,
  LayoutDashboardIcon,
  MapIcon,
  WrenchIcon } from
'lucide-react';
import { DashboardShell, type NavItem } from './DashboardShell';

const navItems: NavItem[] = [
{ to: '/ONG', label: 'Tableau de bord', icon: <LayoutDashboardIcon />, end: true },
{ to: '/ONG/carte', label: 'Carte des périmètres', icon: <MapIcon /> },
{ to: '/ONG/autorisations', label: 'Demandes d’autorisation', icon: <ClipboardCheckIcon /> },
{ to: '/ONG/interventions', label: 'Interventions', icon: <WrenchIcon /> },
{ to: '/ONG/rapports', label: 'Rapports d’impact', icon: <BarChart3Icon /> }];


const titles: Record<string, string> = {
  '/ONG': 'Tableau de bord terrain',
  '/ONG/carte': 'Carte des périmètres de pollution',
  '/ONG/autorisations': 'Demandes d’autorisation',
  '/ONG/interventions': 'Interventions',
  '/ONG/rapports': 'Rapports d’impact'
};

export function OngLayout() {
  const { pathname } = useLocation();
  const title =
  titles[pathname] ?? (pathname.startsWith('/ONG/interventions/') ? 'Détail de l’intervention' : 'Espace ONG');

  return (
    <DashboardShell
      navItems={navItems}
      role="ong"
      brandSubtitle="Espace ONG"
      roleBadge="ONG accréditée"
      userName="Grâce Mabiala"
      userMeta="Océan Propre Congo"
      theme="light"
      title={title}
      breadcrumb="Espace ONG">
      
      <Outlet />
    </DashboardShell>);

}