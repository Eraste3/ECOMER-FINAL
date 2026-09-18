
import { Outlet, useLocation } from 'react-router-dom';
import {
  StoreIcon,
  ShoppingCartIcon
} from
  'lucide-react';
import { DashboardShell, type NavItem } from './DashboardShell';

const navItems: NavItem[] = [
  { to: '/ecoshop', label: 'Marketplace', icon: <StoreIcon />, end: true },
  { to: '/ecoshop/commandes', label: 'Mes commandes', icon: <ShoppingCartIcon /> }
];

const titles: Record<string, string> = {
  '/ecoshop': 'Marketplace ECOSHOP',
  '/ecoshop/commandes': 'Mes commandes et offres'
};

export function EcoshopLayout() {
  const { pathname } = useLocation();
  const title =
    titles[pathname] ?? (pathname.startsWith('/ecoshop/lot/') ? 'Détails du lot' : 'Espace ECOSHOP');

  return (
    <DashboardShell
      navItems={navItems}
      role="citoyen" // using citoyen role for layout styling/permissions for now
      brandSubtitle="ECOSHOP B2B"
      roleBadge="Partenaire Recycleur"
      userName="Entreprise de Recyclage"
      userMeta="Recycleur Pro"
      theme="light"
      title={title}
      breadcrumb="ECOSHOP">

      <Outlet />
    </DashboardShell>);

}
