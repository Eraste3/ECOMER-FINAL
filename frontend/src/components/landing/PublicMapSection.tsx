import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, LayersIcon } from 'lucide-react';
import { MapView } from '../maps/MapView';
import { MapLegend } from '../maps/MapLegend';
import { Button } from '../ui/Button';
import { mockPerimeters } from '../../data/mock-perimeters';
import { severityMeta } from '../../utils/labels';
import { formatArea, formatCoordSafe } from './mapHelpers';
import type { Perimeter } from '../../types';

export function PublicMapSection() {
  const [selected, setSelected] = useState<Perimeter | null>(mockPerimeters[0]);
  const [heatmap, setHeatmap] = useState(true);

  return (
    <section id="carte" className="bg-abyss py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-cyan-ecomer">
              Carte environnementale publique
            </p>
            <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Les périmètres de pollution de Pointe-Noire
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              Chaque polygone représente un regroupement de signalements citoyens généré par le moteur de
              clustering spatial. Cliquez sur un périmètre pour consulter sa fiche.
            </p>
          </div>
          <Button
            variant="outline-dark"
            size="sm"
            onClick={() => setHeatmap((v) => !v)}
            icon={<LayersIcon className="h-4 w-4" />}>
            
            {heatmap ? 'Masquer la heatmap' : 'Afficher la heatmap'}
          </Button>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-navy">
            <div className="relative aspect-[10/7] sm:aspect-[16/10]">
              <MapView
                perimeters={mockPerimeters}
                showHeatmap={heatmap}
                selectedPerimeterId={selected?.id ?? null}
                onSelectPerimeter={setSelected}
                tone="dark" />
              
              <MapLegend tone="dark" className="absolute bottom-3 left-3" />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {selected &&
            <div className="rounded-2xl border border-white/10 bg-navy p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-lg font-bold text-white">{selected.id}</p>
                    <p className="text-xs text-slate-400">{selected.zone} · Pointe-Noire</p>
                  </div>
                  <span
                  className="rounded-full px-2.5 py-1 text-[11px] font-bold"
                  style={{
                    color: severityMeta[selected.severity].color,
                    backgroundColor: `${severityMeta[selected.severity].color}1f`
                  }}>
                  
                    {severityMeta[selected.severity].label}
                  </span>
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
                  {[
                ['Signalements', `${selected.reportCount}`],
                ['Surface estimée', formatArea(selected.areaM2)],
                ['Déchets estimés', `${selected.wasteTons.toFixed(1).replace('.', ',')} t`],
                ['Coordonnées', formatCoordSafe(selected.centroid.lat, selected.centroid.lng)]].
                map(([k, v]) =>
                <div key={k} className="rounded-lg bg-white/5 px-3 py-2.5">
                      <dt className="text-[10px] uppercase tracking-wide text-slate-500">{k}</dt>
                      <dd className="mt-0.5 font-semibold text-white">{v}</dd>
                    </div>
                )}
                </dl>
              </div>
            }

            <ul className="ecomer-scroll max-h-[320px] space-y-2 overflow-y-auto rounded-2xl border border-white/10 bg-navy p-3">
              {mockPerimeters.map((p) =>
              <li key={p.id}>
                  <button
                  onClick={() => setSelected(p)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                  selected?.id === p.id ? 'bg-white/10' : 'hover:bg-white/5'}`
                  }>
                  
                    <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: severityMeta[p.severity].color }} />
                  
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-semibold text-white">{p.zone}</span>
                      <span className="block text-[11px] text-slate-400">
                        {p.id} · {p.reportCount} signalements
                      </span>
                    </span>
                  </button>
                </li>
              )}
            </ul>

            <Link to="/citoyens" className="block">
              <Button variant="accent" block icon={<ArrowRightIcon className="h-4 w-4" />}>
                Ouvrir la carte citoyenne
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>);

}