import React from 'react';
import { Link } from 'react-router-dom';
import { MailIcon, MapPinIcon, PhoneIcon } from 'lucide-react';
import { EcomerLogo } from '../ui/Logo';

const columns = [
{
  title: 'Plateforme',
  links: [
  { label: 'Espace citoyen', to: '/citoyens' },
  { label: 'Espace ONG', to: '/ONG' },
  { label: 'Direction de l’Environnement', to: '/dirEnv' },
  { label: 'Console d’administration', to: '/adminEcomer' }]

},
{
  title: 'Ressources',
  links: [
  { label: 'Documentation', to: '/adminEcomer/documentation' },
  { label: 'Module IA', to: '/adminEcomer/ia' },
  { label: 'Rapports d’impact', to: '/ONG/rapports' },
  { label: 'Indicateurs publics', to: '/dirEnv/kpi' }]

}];


export function LandingFooter() {
  return (
    <footer className="border-t border-white/10 bg-navy">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]">
        <div>
          <EcomerLogo />
          <p className="mt-4 max-w-sm text-[13px] leading-relaxed text-slate-400">
            Système Intégré de Signalement et de Gestion des Déchets Aquatiques pour la Ville de
            Pointe-Noire.
          </p>
          <p className="mt-4 text-[11px] text-slate-500">
            Projet développé en partenariat avec la Direction de l’Environnement et la Mairie de
            Pointe-Noire.
          </p>
        </div>

        {columns.map((c) =>
        <nav key={c.title} aria-label={c.title}>
            <p className="text-[11px] font-bold uppercase tracking-wider text-white">{c.title}</p>
            <ul className="mt-4 space-y-2.5">
              {c.links.map((l) =>
            <li key={l.label}>
                  <Link to={l.to} className="text-[13px] text-slate-400 transition-colors hover:text-cyan-ecomer">
                    {l.label}
                  </Link>
                </li>
            )}
            </ul>
          </nav>
        )}

        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-white">Contact</p>
          <ul className="mt-4 space-y-2.5 text-[13px] text-slate-400">
            <li className="flex items-start gap-2">
              <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-cyan-ecomer" />
              Avenue Charles de Gaulle, Centre-ville, Pointe-Noire
            </li>
            <li className="flex items-center gap-2">
              <PhoneIcon className="h-4 w-4 shrink-0 text-cyan-ecomer" />
              +242 06 000 00 00
            </li>
            <li className="flex items-center gap-2">
              <MailIcon className="h-4 w-4 shrink-0 text-cyan-ecomer" />
              contact@ecomer.cg
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-5 sm:px-6">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>© 2026 ECOMER — Ville de Pointe-Noire. Tous droits réservés.</p>
          <p>Mentions légales · Politique de confidentialité · Accessibilité</p>
        </div>
      </div>
    </footer>);

}