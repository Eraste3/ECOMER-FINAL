import { Outlet, useLocation } from 'react-router-dom';
import {
  BarChart3Icon,
  LayoutDashboardIcon,
  MapIcon,
  ShoppingCartIcon,
  StoreIcon,
  WrenchIcon
} from 'lucide-react';
import { DashboardShell, type NavItem } from './DashboardShell';

const navItems: NavItem[] = [
  { to: '/recycleur', label: 'Tableau de bord', icon: <LayoutDashboardIcon />, end: true },
  { to: '/recycleur/carte', label: 'Carte & Traçabilité', icon: <MapIcon /> },
  { to: '/recycleur/interventions', label: 'Historique collectes', icon: <WrenchIcon /> },
  { to: '/recycleur/marketplace', label: 'Marketplace ECOSHOP', icon: <StoreIcon /> },
  { to: '/recycleur/commandes', label: 'Rapports de transactions', icon: <BarChart3Icon /> },
];

const titles: Record<string, string> = {
  '/recycleur': 'Tableau de bord Recycleur',
  '/recycleur/carte': 'Carte & Traçabilité des déchets',
  '/recycleur/interventions': 'Historique des collectes',
  '/recycleur/marketplace': 'Marketplace ECOSHOP',
  '/recycleur/commandes': 'Rapports de transactions',
};

export function RecycleurLayout() {
  const { pathname } = useLocation();
  const title =
    titles[pathname] ?? (pathname.startsWith('/recycleur/marketplace/lot/') ? 'Détails du lot' : 'Espace Recycleur');

  return (
    <DashboardShell
      navItems={navItems}
      role="ong"
      brandSubtitle="Espace Recycleur"
      roleBadge="Partenaire Recycleur"
      userName="EcoPlast Congo"
      userMeta="Entreprise de Recyclage"
      theme="light"
      title={title}
      breadcrumb="Espace Recycleur">

      <Outlet />
    </DashboardShell>
  );
}
