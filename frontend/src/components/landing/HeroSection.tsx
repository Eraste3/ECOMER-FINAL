import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRightIcon, MapIcon, SatelliteIcon, ShieldCheckIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { MapView } from '../maps/MapView';
import { MapLegend } from '../maps/MapLegend';
import { mockPerimeters } from '../../data/mock-perimeters';
import { mockReports } from '../../data/mock-reports';
import { MEDIA } from '../../data/media';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-abyss pt-16">
      <div className="absolute inset-0" aria-hidden="true">
        <img
          src={MEDIA.heroCoast}
          alt=""
          className="h-full w-full object-cover opacity-25"
          loading="eager" />
        
        <div className="absolute inset-0 bg-abyss/80" />
      </div>

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}>
          
          <span className="inline-flex items-center gap-2 rounded-full bg-cyan-ecomer/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-cyan-ecomer ring-1 ring-inset ring-cyan-ecomer/30">
            <SatelliteIcon className="h-3.5 w-3.5" />
            Ville de Pointe-Noire · Plateforme officielle
          </span>

          <h1 className="mt-5 font-display text-3xl font-bold leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-[52px]">
            Ensemble, protégeons les eaux de Pointe-Noire
          </h1>

          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-slate-300 sm:text-base">
            ECOMER transforme les signalements citoyens en actions concrètes pour une ville plus propre
            et un environnement aquatique durable.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/citoyens/signaler">
              <Button variant="accent" size="lg" icon={<ArrowRightIcon className="h-4 w-4" />}>
                Signaler une pollution
              </Button>
            </Link>
            <a href="#carte">
              <Button variant="outline-dark" size="lg" icon={<MapIcon className="h-4 w-4" />}>
                Explorer la carte
              </Button>
            </a>
          </div>

          <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-white/10 pt-6">
            {[
            { k: '1 248', v: 'signalements' },
            { k: '86', v: 'périmètres actifs' },
            { k: '92 t', v: 'déchets collectés' }].
            map((s) =>
            <div key={s.v}>
                <dt className="font-display text-xl font-bold text-white sm:text-2xl">{s.k}</dt>
                <dd className="text-[11px] uppercase tracking-wide text-slate-400">{s.v}</dd>
              </div>
            )}
          </dl>

          <p className="mt-6 flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldCheckIcon className="h-4 w-4 text-eco-green" />
            Données traitées avec la Direction de l’Environnement de Pointe-Noire
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative">
          
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-navy shadow-float">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div>
                <p className="font-display text-sm font-semibold text-white">Cartographie temps réel</p>
                <p className="text-[11px] text-slate-400">Périmètres de pollution — agglomération de Pointe-Noire</p>
              </div>
              <span className="flex items-center gap-1.5 rounded-full bg-eco-red/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-eco-red ring-1 ring-inset ring-eco-red/30">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-eco-red" />
                Live
              </span>
            </div>
            <div className="relative aspect-[10/7]">
              <MapView
                perimeters={mockPerimeters}
                reports={mockReports}
                showHeatmap
                tone="dark"
                ariaLabel="Carte des périmètres de pollution de Pointe-Noire" />
              
              <MapLegend tone="dark" className="absolute bottom-3 left-3" extras={false} />
            </div>
          </div>
        </motion.div>
      </div>
    </section>);

}