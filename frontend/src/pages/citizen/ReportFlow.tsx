import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  AwardIcon,
  CameraIcon,
  CheckCircle2Icon,
  CrosshairIcon,
  DropletsIcon,
  FishIcon,
  HelpCircleIcon,
  ImageIcon,
  PackageIcon,
  SendIcon,
  Trash2Icon } from
'lucide-react';
import { Button } from '../../components/ui/Button';
import { StepIndicator } from '../../components/forms/StepIndicator';
import { AiAnalysisCard, type AiResult } from '../../components/ai/AiAnalysisCard';
import { MapView } from '../../components/maps/MapView';
import { useSignalements } from '../../hooks/useSignalements';
import { CITIZEN_POSITION } from '../../data/citizen';
import { MEDIA } from '../../data/media';
import { formatCoord, toGeo } from '../../data/mock-geo';
import { severityMeta, wasteMeta } from '../../utils/labels';
import { zoneAt } from '../../utils/geo';
import type { Severity, WasteType } from '../../types';

const steps = ['Type de pollution', 'Photo & analyse IA', 'Localisation', 'Description', 'Résumé'];

const wasteOptions: Array<{key: WasteType;icon: React.ElementType;}> = [
{ key: 'plastiques', icon: PackageIcon },
{ key: 'menagers', icon: Trash2Icon },
{ key: 'hydrocarbures', icon: DropletsIcon },
{ key: 'filets', icon: FishIcon },
{ key: 'divers', icon: ImageIcon },
{ key: 'inconnue', icon: HelpCircleIcon }];


const photoSamples = [
{ url: MEDIA.beforePlastic, label: 'Littoral — plastiques' },
{ url: MEDIA.householdWaste, label: 'Canal — déchets ménagers' },
{ url: MEDIA.oilSlick, label: 'Port — hydrocarbures' }];


const severityByWaste: Record<WasteType, Severity> = {
  plastiques: 'eleve',
  menagers: 'modere',
  hydrocarbures: 'critique',
  filets: 'eleve',
  divers: 'modere',
  inconnue: 'faible'
};

export function ReportFlowPage() {
  const navigate = useNavigate();
  const { createSignalement } = useSignalements();

  const [step, setStep] = useState(0);
  const [wasteType, setWasteType] = useState<WasteType | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [ai, setAi] = useState<AiResult | null>(null);
  const [marker, setMarker] = useState(CITIZEN_POSITION);
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const geo = useMemo(() => toGeo(marker.x, marker.y), [marker]);
  const zone = useMemo(() => zoneAt(marker), [marker]);

  useEffect(() => {
    if (!photo || !wasteType) return;
    setAnalyzing(true);
    setAi(null);
    const t = setTimeout(() => {
      setAnalyzing(false);
      setAi({
        detectedType: wasteType,
        confidence: wasteType === 'inconnue' ? 61 : wasteType === 'plastiques' ? 94 : 89,
        severity: severityByWaste[wasteType]
      });
    }, 2200);
    return () => clearTimeout(t);
  }, [photo, wasteType]);

  const canContinue =
  step === 0 && wasteType !== null ||
  step === 1 && photo !== null && !analyzing ||
  step === 2 ||
  step === 3 ||
  step === 4;

  const submit = async () => {
    if (!wasteType) return;
    setSubmitting(true);
    try {
      const report = await createSignalement({
        photoUrl: photo || '',
        latitude: geo.lat,
        longitude: geo.lng,
        typeDechet: wasteType,
        description: description || undefined,
        gravite: (ai?.severity ?? severityByWaste[wasteType]) as any
      });
      setSubmitted(report.id?.toString() || 'submitted');
    } catch (error) {
      console.error('Error creating report:', error);
      alert('Erreur lors de la création du signalement');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md rounded-2xl bg-white p-8 text-center ring-1 ring-hairline shadow-card">
          
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 12, delay: 0.1 }}
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-eco-green">
            
            <CheckCircle2Icon className="h-9 w-9" />
          </motion.span>
          <h2 className="mt-5 font-display text-xl font-bold text-navy">
            Signalement transmis avec succès
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Votre signalement <strong className="text-navy">#{submitted}</strong> a été enregistré et
            transmis au moteur de clustering spatial d’ECOMER.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700 ring-1 ring-inset ring-emerald-200">
            <AwardIcon className="h-4 w-4" />
            +10 EcoPoints
          </motion.div>
          <div className="mt-7 grid gap-2">
            <Link to="/citoyens/mes-signalements">
              <Button block icon={<ArrowRightIcon className="h-4 w-4" />}>
                Suivre mon signalement
              </Button>
            </Link>
            <Button variant="secondary" block onClick={() => navigate('/citoyens')}>
              Retour à la carte
            </Button>
          </div>
        </motion.div>
      </div>);

  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-5 sm:px-0">
      <div className="rounded-xl bg-white p-5 ring-1 ring-hairline shadow-card">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-lg font-bold text-navy">Nouveau signalement</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Quelques secondes suffisent — vos informations sont vérifiées par l’IA ECOMER.
            </p>
          </div>
          <button
            onClick={() => navigate('/citoyens')}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
            aria-label="Annuler le signalement">
            
            <ArrowLeftIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5">
          <StepIndicator steps={steps} current={step} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.2 }}
            className="mt-6">
            
            {step === 0 &&
            <fieldset>
                <legend className="font-display text-base font-semibold text-navy">
                  Que se passe-t-il ?
                </legend>
                <p className="mt-1 text-xs text-slate-500">Sélectionnez le type de pollution observé.</p>
                <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  {wasteOptions.map((o) => {
                  const meta = wasteMeta[o.key];
                  const selected = wasteType === o.key;
                  return (
                    <button
                      key={o.key}
                      onClick={() => setWasteType(o.key)}
                      aria-pressed={selected}
                      className={`flex items-center gap-3 rounded-xl p-4 text-left transition-all ${
                      selected ?
                      'bg-ocean/5 ring-2 ring-ocean' :
                      'bg-surface ring-1 ring-hairline hover:ring-ocean/40'}`
                      }>
                      
                        <span
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                        style={{ backgroundColor: `${meta.color}1f`, color: meta.color }}>
                        
                          <o.icon className="h-5 w-5" />
                        </span>
                        <span className="text-[13px] font-semibold text-navy">{meta.label}</span>
                      </button>);

                })}
                </div>
              </fieldset>
            }

            {step === 1 &&
            <div>
                <h3 className="font-display text-base font-semibold text-navy">Ajoutez une photo</h3>
                <p className="mt-1 text-xs text-slate-500">
                  La photo alimente l’analyse IA : type de déchet, gravité et niveau de confiance.
                </p>

                {photo ?
              <div className="mt-4 space-y-3">
                    <div className="relative overflow-hidden rounded-xl ring-1 ring-hairline">
                      <img src={photo} alt="Aperçu du signalement" className="h-56 w-full object-cover" />
                      <button
                    onClick={() => {
                      setPhoto(null);
                      setAi(null);
                    }}
                    className="absolute right-3 top-3 rounded-lg bg-abyss/70 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur">
                    
                        Changer
                      </button>
                    </div>
                    <AiAnalysisCard loading={analyzing} result={ai} />
                  </div> :

              <div className="mt-4 space-y-3">
                    <div className="grid gap-2.5 sm:grid-cols-2">
                      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ocean/30 bg-ocean/5 p-6 text-center transition-colors hover:border-ocean/60">
                        <CameraIcon className="h-7 w-7 text-ocean" />
                        <span className="text-[13px] font-semibold text-navy">Prendre une photo</span>
                        <span className="text-[11px] text-slate-500">Appareil photo du téléphone</span>
                        <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="sr-only"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) setPhoto(URL.createObjectURL(f));
                      }} />
                    
                      </label>
                      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-hairline bg-surface p-6 text-center transition-colors hover:border-ocean/40">
                        <ImageIcon className="h-7 w-7 text-slate-400" />
                        <span className="text-[13px] font-semibold text-navy">Sélectionner une photo</span>
                        <span className="text-[11px] text-slate-500">Depuis la galerie</span>
                        <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) setPhoto(URL.createObjectURL(f));
                      }} />
                    
                      </label>
                    </div>

                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        Ou utilisez un exemple de démonstration
                      </p>
                      <div className="mt-2 grid grid-cols-3 gap-2">
                        {photoSamples.map((s) =>
                    <button
                      key={s.url}
                      onClick={() => setPhoto(s.url)}
                      className="group overflow-hidden rounded-lg ring-1 ring-hairline">
                      
                            <img
                        src={s.url}
                        alt={s.label}
                        className="h-20 w-full object-cover transition-transform group-hover:scale-105" />
                      
                          </button>
                    )}
                      </div>
                    </div>
                  </div>
              }
              </div>
            }

            {step === 2 &&
            <div>
                <h3 className="font-display text-base font-semibold text-navy">Localisation</h3>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-eco-green">
                  <CrosshairIcon className="h-3.5 w-3.5" />
                  Votre position a été détectée automatiquement
                </p>

                <div className="mt-4 overflow-hidden rounded-xl bg-navy ring-1 ring-hairline">
                  <div className="relative aspect-[4/3]">
                    <MapView
                    perimeters={[]}
                    marker={marker}
                    onMarkerMove={setMarker}
                    userPosition={CITIZEN_POSITION}
                    tone="dark"
                    ariaLabel="Positionnez le marqueur du signalement" />
                  
                    <p className="absolute inset-x-3 top-3 rounded-lg glass-dark px-3 py-2 text-[11px] text-slate-300">
                      Touchez la carte ou faites glisser le marqueur pour ajuster la position.
                    </p>
                  </div>
                </div>

                <dl className="mt-3 grid grid-cols-3 gap-2 text-xs">
                  <div className="rounded-lg bg-surface p-3 ring-1 ring-hairline">
                    <dt className="text-[10px] uppercase tracking-wider text-slate-500">Latitude</dt>
                    <dd className="mt-0.5 font-semibold text-navy">{formatCoord(geo.lat, 'lat')}</dd>
                  </div>
                  <div className="rounded-lg bg-surface p-3 ring-1 ring-hairline">
                    <dt className="text-[10px] uppercase tracking-wider text-slate-500">Longitude</dt>
                    <dd className="mt-0.5 font-semibold text-navy">{formatCoord(geo.lng, 'lng')}</dd>
                  </div>
                  <div className="rounded-lg bg-surface p-3 ring-1 ring-hairline">
                    <dt className="text-[10px] uppercase tracking-wider text-slate-500">Quartier</dt>
                    <dd className="mt-0.5 font-semibold text-navy">{zone}</dd>
                  </div>
                </dl>
              </div>
            }

            {step === 3 &&
            <div>
                <h3 className="font-display text-base font-semibold text-navy">
                  Description <span className="text-xs font-normal text-slate-400">(facultative)</span>
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Précisez ce qui aidera l’équipe d’intervention : accès, odeur, ampleur…
                </p>
                <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                maxLength={400}
                placeholder="Ex. Amas de bouteilles plastiques bloquant le canal derrière le marché de Ngambio."
                className="mt-4 w-full rounded-xl border-0 bg-surface p-4 text-sm text-navy ring-1 ring-inset ring-hairline outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-ocean" />
              
                <p className="mt-1.5 text-right text-[11px] text-slate-400">{description.length}/400</p>
              </div>
            }

            {step === 4 && wasteType &&
            <div>
                <h3 className="font-display text-base font-semibold text-navy">Résumé du signalement</h3>
                <p className="mt-1 text-xs text-slate-500">Vérifiez les informations avant l’envoi.</p>

                <div className="mt-4 overflow-hidden rounded-xl ring-1 ring-hairline">
                  {photo && <img src={photo} alt="Photo du signalement" className="h-44 w-full object-cover" />}
                  <dl className="divide-y divide-hairline bg-white">
                    {[
                  ['Type déclaré', wasteMeta[wasteType].label],
                  ['Type détecté par l’IA', ai ? wasteMeta[ai.detectedType].label : '—'],
                  ['Confiance IA', ai ? `${ai.confidence} %` : '—'],
                  [
                  'Gravité estimée',
                  severityMeta[ai?.severity ?? severityByWaste[wasteType]].label],

                  ['Quartier', zone],
                  [
                  'Coordonnées',
                  `${formatCoord(geo.lat, 'lat')} · ${formatCoord(geo.lng, 'lng')}`],

                  ['Description', description || 'Aucune']].
                  map(([k, v]) =>
                  <div key={k} className="flex items-start justify-between gap-4 px-4 py-3">
                        <dt className="text-[11px] uppercase tracking-wide text-slate-500">{k}</dt>
                        <dd className="max-w-[60%] text-right text-[13px] font-semibold text-navy">{v}</dd>
                      </div>
                  )}
                  </dl>
                </div>

                <p className="mt-3 rounded-lg bg-sky-50 px-3 py-2.5 text-[11px] text-sky-800 ring-1 ring-inset ring-sky-100">
                  Votre signalement sera automatiquement rattaché à un périmètre de pollution si d’autres
                  signalements existent dans un rayon de 100 m.
                </p>
              </div>
            }
          </motion.div>
        </AnimatePresence>

        <div className="mt-7 flex items-center justify-between gap-3 border-t border-hairline pt-5">
          <Button
            variant="ghost"
            onClick={() => step === 0 ? navigate('/citoyens') : setStep((s) => s - 1)}
            icon={<ArrowLeftIcon className="h-4 w-4" />}>
            
            {step === 0 ? 'Annuler' : 'Retour'}
          </Button>

          {step < 4 ?
          <Button
            variant="accent"
            size="lg"
            disabled={!canContinue}
            onClick={() => setStep((s) => s + 1)}
            icon={<ArrowRightIcon className="h-4 w-4" />}>
            
              Continuer
            </Button> :

          <Button variant="success" size="lg" onClick={submit} disabled={submitting} icon={<SendIcon className="h-4 w-4" />}>
              {submitting ? 'Envoi en cours...' : 'Envoyer le signalement'}
            </Button>
          }
        </div>
      </div>
    </div>);

}