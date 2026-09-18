
import { Outlet, useLocation } from 'react-router-dom';
import {
  ActivityIcon,
  BookOpenIcon,
  BotIcon,
  Building2Icon,
  ChartPieIcon,
  LayoutDashboardIcon,
  MapPinIcon,
  SettingsIcon,
  ShapesIcon,
  StoreIcon,
  UsersIcon,
  WavesIcon
} from
  'lucide-react';
import { DashboardShell, type NavItem } from './DashboardShell';

const navItems: NavItem[] = [
  { to: '/adminEcomer', label: 'Tableau de bord', icon: <LayoutDashboardIcon />, end: true },
  { to: '/adminEcomer/utilisateurs', label: 'Utilisateurs', icon: <UsersIcon /> },
  { to: '/adminEcomer/signalements', label: 'Signalements', icon: <MapPinIcon /> },
  { to: '/adminEcomer/perimetres', label: 'Périmètres', icon: <ShapesIcon /> },
  { to: '/adminEcomer/ong', label: 'ONG', icon: <Building2Icon /> },
  { to: '/adminEcomer/zones', label: 'Zones & Pollution', icon: <WavesIcon /> },
  { to: '/adminEcomer/analytics', label: 'Analytics', icon: <ChartPieIcon /> },
  { to: '/adminEcomer/ia', label: 'Module IA', icon: <BotIcon /> },
  { to: '/adminEcomer/ecoshop', label: 'ECOSHOP (B2B)', icon: <StoreIcon /> },
  { to: '/adminEcomer/configuration', label: 'Configuration', icon: <SettingsIcon /> },
  { to: '/adminEcomer/monitoring', label: 'Monitoring', icon: <ActivityIcon /> },
  { to: '/adminEcomer/documentation', label: 'Documentation', icon: <BookOpenIcon /> }];


const titles: Record<string, string> = {
  '/adminEcomer': 'Tableau de bord',
  '/adminEcomer/utilisateurs': 'Utilisateurs',
  '/adminEcomer/signalements': 'Signalements',
  '/adminEcomer/perimetres': 'Périmètres',
  '/adminEcomer/ong': 'ONG & Associations',
  '/adminEcomer/zones': 'Zones & Pollution',
  '/adminEcomer/analytics': 'Analytics',
  '/adminEcomer/ia': 'Module IA',
  '/adminEcomer/ecoshop': 'Gestion ECOSHOP',
  '/adminEcomer/configuration': 'Configuration du clustering',
  '/adminEcomer/monitoring': 'Monitoring système',
  '/adminEcomer/documentation': 'Documentation'
};

export function AdminLayout() {
  const { pathname } = useLocation();
  return (
    <DashboardShell
      navItems={navItems}
      role="admin"
      brandSubtitle="Console Admin"
      roleBadge="Super Admin"
      userName="Rachel Bantsimba"
      userMeta="Administration ECOMER"
      theme="dark"
      title={titles[pathname] ?? 'Console d’administration'}
      breadcrumb="ECOMER Admin">

      <Outlet />
    </DashboardShell>);

}