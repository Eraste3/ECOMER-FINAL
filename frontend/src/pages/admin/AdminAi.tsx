import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BotIcon, LoaderIcon, SparklesIcon, WandSparklesIcon } from 'lucide-react';
import { Card, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Toggle } from '../../components/ui/Toggle';
import { useEcomer } from '../../contexts/EcomerContext';
import type { AiSettings } from '../../types';

const settingsMeta: Array<{key: keyof AiSettings;label: string;description: string;}> = [
{
  key: 'classification',
  label: 'Classification automatique des déchets',
  description: 'Identifie le type de déchet à partir de la photo transmise par le citoyen.'
},
{
  key: 'anomalies',
  label: 'Détection des anomalies',
  description: 'Signale les doublons, les photos non pertinentes et les signalements suspects.'
},
{
  key: 'severity',
  label: 'Estimation de la gravité',
  description: 'Attribue un niveau faible, modéré, élevé ou critique à chaque signalement.'
},
{
  key: 'imageAnalysis',
  label: 'Analyse des images',
  description: 'Extrait la densité de déchets et la surface approximative couverte.'
},
{
  key: 'riskPrediction',
  label: 'Prédiction des zones à risque',
  description: 'Anticipe les zones susceptibles de devenir critiques dans les 30 prochains jours.'
}];


const suggestions = [
'Analyse les zones les plus à risque pour septembre',
'Résume l’activité des ONG sur les 30 derniers jours',
'Priorise les périmètres critiques non encore affectés'];


export function AdminAiPage() {
  const { aiSettings, toggleAi, perimeters } = useEcomer();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string[] | null>(null);

  const generate = () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      const critical = perimeters.filter((p) => p.severity === 'critique' && p.status !== 'resolu');
      setLoading(false);
      setResult([
      `Analyse de ${perimeters.length} périmètres actifs sur l’agglomération de Pointe-Noire.`,
      `${critical.length} périmètre(s) critique(s) identifié(s) — priorité maximale sur ${
      critical[0]?.zone ?? 'la Côte Sauvage'} (${
      critical[0]?.id ?? 'PER-0038'}), ${critical[0]?.reportCount ?? 41} signalements regroupés.`,
      'Corrélation forte entre pluviométrie et signalements de déchets ménagers dans les canaux de Mvou-Mvou et Ngambio (+38 % après épisode pluvieux).',
      'Recommandation : mandater une équipe municipale sur Ngambio et pré-positionner du matériel de collecte à Tié-Tié avant le 10 septembre.',
      'Fiabilité de l’analyse : 91 % — modèle de classification v2.4, fenêtre temporelle de 14 jours.']
      );
    }, 2000);
  };

  return (
    <div className="space-y-5">
      <div className="max-w-2xl">
        <h2 className="font-display text-xl font-bold text-white">Module IA</h2>
        <p className="mt-1 text-sm text-slate-400">
          Configurez et supervisez les fonctionnalités d’intelligence artificielle d’ECOMER.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card tone="dark">
          <CardHeader
            tone="dark"
            title="Paramètres d’IA"
            subtitle="Activation des modules d’analyse automatique"
            action={
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300 ring-1 ring-inset ring-emerald-400/20">
                {Object.values(aiSettings).filter(Boolean).length}/5 actifs
              </span>
            } />
          
          <div className="divide-y divide-white/5 p-2">
            {settingsMeta.map((s) =>
            <Toggle
              key={s.key}
              tone="dark"
              checked={aiSettings[s.key]}
              onChange={() => toggleAi(s.key)}
              label={s.label}
              description={s.description} />

            )}
          </div>
          <div className="border-t border-white/10 px-5 py-4">
            <p className="text-[11px] text-slate-500">
              Modèle de classification v2.4 · précision moyenne 94,2 % · dernier entraînement 27 août 2026.
            </p>
          </div>
        </Card>

        <Card tone="dark">
          <CardHeader
            tone="dark"
            title="Assistant IA"
            subtitle="Génère une analyse à partir des données de la plateforme"
            action={<BotIcon className="h-4 w-4 text-cyan-ecomer" />} />
          
          <div className="space-y-3 p-5">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              placeholder="Décrivez votre demande…"
              className="w-full rounded-xl border-0 bg-white/5 p-4 text-sm text-white ring-1 ring-inset ring-white/10 outline-none placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-ecomer/40" />
            
            <div className="flex flex-wrap gap-1.5">
              {suggestions.map((s) =>
              <button
                key={s}
                onClick={() => setPrompt(s)}
                className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] font-medium text-slate-400 ring-1 ring-inset ring-white/10 transition-colors hover:text-white">
                
                  {s}
                </button>
              )}
            </div>
            <Button
              variant="accent"
              block
              onClick={generate}
              disabled={loading || !prompt.trim()}
              icon={
              loading ?
              <LoaderIcon className="h-4 w-4 animate-spin" /> :

              <WandSparklesIcon className="h-4 w-4" />

              }>
              
              {loading ? 'Analyse en cours…' : 'Générer une analyse'}
            </Button>

            {loading &&
            <div className="space-y-2 rounded-xl bg-white/5 p-4">
                {[0, 1, 2].map((i) =>
              <div key={i} className="h-3 rounded bg-white/10" style={{ width: `${90 - i * 18}%` }} />
              )}
              </div>
            }

            {result &&
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl bg-white/5 p-4 ring-1 ring-inset ring-cyan-ecomer/20">
              
                <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-cyan-ecomer">
                  <SparklesIcon className="h-3.5 w-3.5" />
                  Analyse générée
                </p>
                <ul className="mt-3 space-y-2.5">
                  {result.map((line, i) =>
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.12 }}
                  className="flex gap-2 text-[13px] leading-relaxed text-slate-300">
                  
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-ecomer" />
                      {line}
                    </motion.li>
                )}
                </ul>
              </motion.div>
            }
          </div>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
        ['Images analysées', '4 812'],
        ['Précision moyenne', '94,2 %'],
        ['Anomalies détectées', '137'],
        ['Zones prédites à risque', '6']].
        map(([k, v]) =>
        <div key={k} className="glass-dark rounded-xl p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{k}</p>
            <p className="mt-1 font-display text-2xl font-bold text-white">{v}</p>
          </div>
        )}
      </div>
    </div>);

}