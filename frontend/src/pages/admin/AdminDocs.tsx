import React from 'react';
import { BookOpenIcon, CheckCircle2Icon } from 'lucide-react';
import { Card, CardHeader } from '../../components/ui/Card';
import { pipeline } from '../../data/landing-content';

const rules = [
'Les signalements citoyens proches dans l’espace et le temps sont regroupés en périmètres de pollution.',
'Le clustering spatial est représenté visuellement par des polygones sur toutes les cartes de la plateforme.',
'Un périmètre nouvellement généré déclenche une notification pour les ONG de la zone et la Direction de l’Environnement.',
'Un signalement déposé par une ONG accréditée est marqué comme prioritaire pour la Municipalité.',
'Une intervention autorisée dispose d’une échéance stricte de 30 jours.',
'Une intervention terminée doit recevoir une preuve « après » avant validation.',
'Le périmètre ne peut passer au statut « Résolu » qu’après validation de la preuve.'];


const roles = [
{
  role: 'Citoyen',
  color: '#22d3ee',
  actions: ['Signale', 'Géolocalise', 'Consulte ses signalements', 'Suit le périmètre', 'Gagne des EcoPoints']
},
{
  role: 'ONG',
  color: '#14b8a6',
  actions: [
  'Consulte les périmètres',
  'Demande une autorisation',
  'Demande du matériel',
  'Intervient',
  'Fournit une preuve avant/après']

},
{
  role: 'Direction de l’Environnement',
  color: '#f97316',
  actions: [
  'Reçoit les périmètres',
  'Valide ou refuse',
  'Attribue le matériel',
  'Mandate des équipes',
  'Supervise les KPI']

},
{
  role: 'Admin ECOMER',
  color: '#0e4f7d',
  actions: [
  'Supervise la plateforme',
  'Gère les utilisateurs',
  'Valide les ONG',
  'Configure l’IA',
  'Configure le clustering',
  'Surveille le système']

}];


export function AdminDocsPage() {
  return (
    <div className="space-y-5">
      <div className="max-w-2xl">
        <h2 className="flex items-center gap-2 font-display text-xl font-bold text-white">
          <BookOpenIcon className="h-5 w-5 text-cyan-ecomer" />
          Documentation ECOMER
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Système Intégré de Signalement et de Gestion des Déchets Aquatiques pour la Ville de
          Pointe-Noire.
        </p>
      </div>

      <Card tone="dark">
        <CardHeader tone="dark" title="Chaîne de traitement" subtitle="Du signalement à la résolution" />
        <ol className="grid gap-3 p-5 sm:grid-cols-3 xl:grid-cols-5">
          {pipeline.map((p, i) =>
          <li key={p.label} className="rounded-xl bg-white/5 p-4 ring-1 ring-inset ring-white/10">
              <span className="font-display text-[11px] font-bold" style={{ color: p.color }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="mt-1.5 text-[13px] font-semibold text-white">{p.label}</p>
              <p className="mt-0.5 text-[11px] text-slate-400">{p.detail}</p>
            </li>
          )}
        </ol>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card tone="dark">
          <CardHeader tone="dark" title="Règles métier" subtitle="Appliquées par la plateforme" />
          <ul className="divide-y divide-white/5">
            {rules.map((r, i) =>
            <li key={i} className="flex gap-3 px-5 py-3.5">
                <CheckCircle2Icon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                <p className="text-[13px] leading-relaxed text-slate-300">{r}</p>
              </li>
            )}
          </ul>
        </Card>

        <Card tone="dark">
          <CardHeader tone="dark" title="Rôles et responsabilités" subtitle="Cohérence des permissions" />
          <div className="space-y-3 p-5">
            {roles.map((r) =>
            <div key={r.role} className="rounded-xl bg-white/5 p-4">
                <p className="text-[13px] font-bold" style={{ color: r.color }}>
                  {r.role}
                </p>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {r.actions.map((a) =>
                <li
                  key={a}
                  className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-slate-300 ring-1 ring-inset ring-white/10">
                  
                      {a}
                    </li>
                )}
                </ul>
              </div>
            )}
          </div>
        </Card>
      </div>

      <Card tone="dark">
        <CardHeader tone="dark" title="Zones couvertes" subtitle="Agglomération de Pointe-Noire" />
        <div className="flex flex-wrap gap-2 p-5">
          {[
          'Ngambio',
          'Mvou-Mvou',
          'Loandjili',
          'Tié-Tié',
          'Mongo-Mpoukou',
          'Lumumba',
          'Centre-ville',
          'Côte Sauvage',
          'Port Autonome',
          'Baie de Loango'].
          map((z) =>
          <span
            key={z}
            className="rounded-lg bg-white/5 px-3 py-2 text-[12px] font-medium text-slate-300 ring-1 ring-inset ring-white/10">
            
              {z}
            </span>
          )}
        </div>
      </Card>
    </div>);

}