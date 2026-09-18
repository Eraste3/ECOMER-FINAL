import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, MapIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { MEDIA } from '../../data/media';

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-abyss py-16 sm:py-24">
      <div className="absolute inset-0" aria-hidden="true">
        <img src={MEDIA.heroCoast} alt="" className="h-full w-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-abyss/85" />
      </div>
      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Rejoignez la mobilisation
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-slate-300">
          Citoyens, ONG, services municipaux : ECOMER met tout le monde autour de la même carte pour
          rendre les eaux de Pointe-Noire à leurs habitants.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/citoyens/signaler">
            <Button variant="accent" size="lg" icon={<ArrowRightIcon className="h-4 w-4" />}>
              Signaler une pollution
            </Button>
          </Link>
          <Link to="/ONG">
            <Button variant="outline-dark" size="lg" icon={<MapIcon className="h-4 w-4" />}>
              Devenir ONG partenaire
            </Button>
          </Link>
        </div>
      </div>
    </section>);

}