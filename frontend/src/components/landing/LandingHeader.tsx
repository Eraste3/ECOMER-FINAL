import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MenuIcon, XIcon } from 'lucide-react';
import { EcomerLogo } from '../ui/Logo';
import { Button } from '../ui/Button';
import LoginRegistration from './ConnexionInscription';

const links = [
  { href: '/#fonctionnement', label: 'Fonctionnement' },
  { href: '/#acteurs', label: 'Acteurs' },
  { href: '/#carte', label: 'Carte' },
  { href: '/#impact', label: 'Impact' },
  { href: '/ecoshop', label: 'EcoShop' }
];


const spaces = [
  { to: '/citoyens', label: 'Citoyens' },
  { to: '/recycleur', label: 'Recycleurs' },
  { to: '/adminEcomer', label: 'Admin' }];


export function LandingHeader() {
  const [open, setOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-abyss/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-6 px-4 sm:px-6">
        <Link to="/" aria-label="ECOMER, accueil">
          <EcomerLogo size="sm" />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Sections">
          {links.map((l) =>
            <a
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-[13px] font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white">

              {l.label}
            </a>
          )}
        </nav>

        <div className="ml-auto hidden items-center gap-2 lg:flex">
          <div className="mr-2 flex items-center gap-1 rounded-lg bg-white/5 p-1 ring-1 ring-inset ring-white/10">
            {spaces.map((s) =>
              <Link
                key={s.to}
                to={s.to}
                className="rounded-md px-2.5 py-1.5 text-[11px] font-semibold text-slate-300 transition-colors hover:bg-white/10 hover:text-white">

                {s.label}
              </Link>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsAuthModalOpen(true)} className="text-white hover:bg-white/10">
            Connexion
          </Button>
          <Link to="/citoyens/signaler">
            <Button variant="accent" size="sm">
              Signaler une pollution
            </Button>
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="ml-auto rounded-lg p-2 text-slate-300 hover:bg-white/10 lg:hidden"
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}>

          {open ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
        </button>
      </div>

      {open &&
        <div className="border-t border-white/10 bg-navy px-4 py-4 lg:hidden">
          <nav className="grid gap-1" aria-label="Sections mobiles">
            {links.map((l) =>
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/5">

                {l.label}
              </a>
            )}
          </nav>
          <p className="mt-4 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Espaces
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {spaces.map((s) =>
              <Link
                key={s.to}
                to={s.to}
                onClick={() => setOpen(false)}
                className="rounded-lg bg-white/5 px-3 py-2.5 text-center text-xs font-semibold text-white ring-1 ring-inset ring-white/10">

                {s.label}
              </Link>
            )}
          </div>
          <div className="mt-3 flex flex-col gap-2">
            <Button variant="secondary" block onClick={() => { setOpen(false); setIsAuthModalOpen(true); }}>
              Connexion
            </Button>
            <Link to="/citoyens/signaler" onClick={() => setOpen(false)} className="block">
              <Button variant="accent" block>
                Signaler une pollution
              </Button>
            </Link>
          </div>
        </div>
      }
      <LoginRegistration isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </header>);

}