import React from 'react';
import { toast } from 'sonner';
import { SaveIcon, SlidersHorizontalIcon } from 'lucide-react';
import { Card, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { MapView } from '../../components/maps/MapView';
import { useEcomer } from '../../contexts/EcomerContext';
import { severityMeta, severityOrder } from '../../utils/labels';
import type { Severity } from '../../types';

export function AdminConfigPage() {
  const { clustering, updateClustering, perimeters } = useEcomer();

  const sliders: Array<{
    key: 'radiusM' | 'maxDistanceM' | 'minReports' | 'timeWindowDays';
    label: string;
    min: number;
    max: number;
    step: number;
    unit: string;
    help: string;
  }> = [
  {
    key: 'radiusM',
    label: 'Rayon de clustering',
    min: 25,
    max: 500,
    step: 25,
    unit: 'm',
    help: 'Rayon autour d’un signalement dans lequel un périmètre peut l’absorber.'
  },
  {
    key: 'maxDistanceM',
    label: 'Distance maximale',
    min: 50,
    max: 1000,
    step: 50,
    unit: 'm',
    help: 'Distance maximale entre deux signalements d’un même périmètre.'
  },
  {
    key: 'minReports',
    label: 'Nombre minimum de signalements',
    min: 1,
    max: 15,
    step: 1,
    unit: 'signalements',
    help: 'Seuil de déclenchement de la création d’un périmètre de pollution.'
  },
  {
    key: 'timeWindowDays',
    label: 'Fenêtre temporelle',
    min: 1,
    max: 60,
    step: 1,
    unit: 'jours',
    help: 'Période pendant laquelle des signalements peuvent être regroupés.'
  }];


  return (
    <div className="space-y-4">
      <div className="max-w-2xl">
        <h2 className="font-display text-xl font-bold text-white">Configuration du moteur spatial</h2>
        <p className="mt-1 text-sm text-slate-400">
          Ces paramètres déterminent comment les signalements citoyens sont regroupés en périmètres de
          pollution.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <Card tone="dark">
          <CardHeader
            tone="dark"
            title="Paramètres de clustering"
            subtitle="Appliqués en temps réel à la simulation"
            action={<SlidersHorizontalIcon className="h-4 w-4 text-eco-orange" />} />
          
          <div className="space-y-6 p-5">
            {sliders.map((s) =>
            <div key={s.key}>
                <div className="flex items-baseline justify-between">
                  <label htmlFor={s.key} className="text-[13px] font-semibold text-white">
                    {s.label}
                  </label>
                  <span className="rounded-lg bg-eco-orange/15 px-2.5 py-1 font-display text-[13px] font-bold text-eco-orange">
                    {clustering[s.key]} {s.unit}
                  </span>
                </div>
                <input
                id={s.key}
                type="range"
                min={s.min}
                max={s.max}
                step={s.step}
                value={clustering[s.key]}
                onChange={(e) => updateClustering({ [s.key]: Number(e.target.value) })}
                className="mt-3 w-full accent-eco-orange" />
              
                <div className="mt-1 flex justify-between text-[10px] text-slate-500">
                  <span>
                    {s.min} {s.unit}
                  </span>
                  <span>
                    {s.max} {s.unit}
                  </span>
                </div>
                <p className="mt-1.5 text-[11px] text-slate-500">{s.help}</p>
              </div>
            )}

            <div>
              <p className="text-[13px] font-semibold text-white">Seuil de gravité</p>
              <p className="mt-1 text-[11px] text-slate-500">
                Gravité minimale requise pour générer une notification automatique.
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {severityOrder.map((s) =>
                <button
                  key={s}
                  onClick={() => updateClustering({ severityThreshold: s as Severity })}
                  className="rounded-full px-3 py-1.5 text-[11px] font-semibold transition-opacity"
                  style={{
                    color: severityMeta[s].color,
                    backgroundColor: `${severityMeta[s].color}1f`,
                    boxShadow: `inset 0 0 0 1px ${severityMeta[s].color}4d`,
                    opacity: clustering.severityThreshold === s ? 1 : 0.4
                  }}>
                  
                    {severityMeta[s].label}
                  </button>
                )}
              </div>
            </div>

            <Button
              variant="accent"
              block
              icon={<SaveIcon className="h-4 w-4" />}
              onClick={() =>
              toast.success('Configuration enregistrée', {
                description: `Rayon ${clustering.radiusM} m · ${clustering.minReports} signalements minimum`
              })
              }>
              
              Enregistrer la configuration
            </Button>
          </div>
        </Card>

        <div className="space-y-4">
          <Card tone="dark" className="overflow-hidden">
            <CardHeader
              tone="dark"
              title="Simulation du clustering"
              subtitle={`Rayon de ${clustering.radiusM} m appliqué autour de chaque cluster`} />
            
            <div className="relative aspect-[4/3]">
              <MapView
                perimeters={perimeters}
                clusterRadius={clustering.radiusM}
                tone="dark"
                showZoneLabels={false} />
              
            </div>
          </Card>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
            ['Périmètres simulés', perimeters.length],
            [
            'Signalements absorbés',
            perimeters.reduce((s, p) => s + p.reportCount, 0)],

            ['Fenêtre active', `${clustering.timeWindowDays} jours`],
            ['Seuil de gravité', severityMeta[clustering.severityThreshold].label]].
            map(([k, v]) =>
            <div key={k as string} className="glass-dark rounded-xl p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{k}</p>
                <p className="mt-1 font-display text-xl font-bold text-white">{v}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>);

}