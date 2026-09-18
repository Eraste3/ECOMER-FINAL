import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeftIcon, CheckCircle2Icon, ClockIcon, UsersIcon } from 'lucide-react';
import { Card, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { SeverityBadge, StatusBadge } from '../../components/status/StatusBadge';
import { BeforeAfterProof } from '../../components/reports/BeforeAfterProof';
import { MapView } from '../../components/maps/MapView';
import { EmptyState } from '../../components/ui/States';
import { Modal } from '../../components/modals/Modal';
import { useEcomer } from '../../contexts/EcomerContext';
import { daysBetween, formatArea, formatDate } from '../../utils/format';
import { interventionStatusMeta, materialMeta, perimeterStatusMeta } from '../../utils/labels';
import { MEDIA } from '../../data/media';

export function OngInterventionDetailPage() {
  const { id } = useParams<{id: string;}>();
  const { interventions, perimeters, addAfterProof, resolvePerimeter } = useEcomer();
  const [proofOpen, setProofOpen] = useState(false);
  const [tons, setTons] = useState(3.5);
  const [photo, setPhoto] = useState(MEDIA.afterClean);

  const intervention = interventions.find((i) => i.id === id);
  const perimeter = perimeters.find((p) => p.id === intervention?.perimeterId);

  if (!intervention) {
    return (
      <Card>
        <EmptyState
          title="Intervention introuvable"
          message="Cette intervention n’existe pas ou a été archivée."
          action={
          <Link to="/ONG/interventions">
              <Button variant="secondary">Retour à la liste</Button>
            </Link>
          } />
        
      </Card>);

  }

  const left = daysBetween(new Date(), intervention.deadline);
  const progress = Math.max(0, Math.min(100, Math.round((30 - left) / 30 * 100)));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/ONG/interventions"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-slate-500 hover:text-navy">
          
          <ArrowLeftIcon className="h-4 w-4" />
          Toutes les interventions
        </Link>
        <div className="flex items-center gap-2">
          <StatusBadge
            label={interventionStatusMeta[intervention.status].label}
            tone={interventionStatusMeta[intervention.status].tone} />
          
          <SeverityBadge severity={intervention.severity} />
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <Card>
            <CardHeader
              title={`Intervention ${intervention.id}`}
              subtitle={`${intervention.operator} · périmètre ${intervention.perimeterId}`} />
            
            <dl className="grid grid-cols-2 gap-px bg-hairline sm:grid-cols-3">
              {[
              ['Périmètre', intervention.perimeterId],
              ['Zone', intervention.zone],
              ['Surface', formatArea(intervention.areaM2)],
              ['Équipe', intervention.team],
              ['Responsable', intervention.lead],
              ['Agents mobilisés', `${intervention.agents}`],
              ['Début', formatDate(intervention.startDate)],
              ['Date limite', formatDate(intervention.deadline)],
              ['Matériel', intervention.materials.map((m) => materialMeta[m]).join(', ')]].
              map(([k, v]) =>
              <div key={k} className="bg-white px-4 py-3">
                  <dt className="text-[10px] uppercase tracking-wide text-slate-500">{k}</dt>
                  <dd className="mt-0.5 text-[13px] font-semibold text-navy">{v}</dd>
                </div>
              )}
            </dl>
          </Card>

          <Card>
            <CardHeader
              title="Preuve avant / après"
              subtitle="Contrôle visuel obligatoire pour clôturer le périmètre" />
            
            <div className="p-5">
              <BeforeAfterProof
                before={intervention.beforePhoto}
                after={intervention.afterPhoto}
                onAddAfter={() => setProofOpen(true)} />
              

              {intervention.afterPhoto && perimeter && perimeter.status !== 'resolu' &&
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-emerald-50 p-4 ring-1 ring-inset ring-emerald-200">
                  <div>
                    <p className="text-[13px] font-semibold text-emerald-900">
                      Preuve « après » validée — le périmètre peut être clôturé
                    </p>
                    <p className="text-[11px] text-emerald-700">
                      {intervention.collectedTons?.toFixed(1).replace('.', ',')} t collectées sur{' '}
                      {formatArea(intervention.areaM2)}
                    </p>
                  </div>
                  <Button
                  variant="success"
                  onClick={() => resolvePerimeter(intervention.perimeterId)}
                  icon={<CheckCircle2Icon className="h-4 w-4" />}>
                  
                    Marquer le périmètre comme résolu
                  </Button>
                </div>
              }
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Échéance réglementaire" subtitle="30 jours à compter de l’autorisation" />
            <div className="p-5">
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-lg font-bold ${
                  left <= 7 ? 'bg-red-50 text-eco-red' : 'bg-amber-50 text-amber-700'}`
                  }>
                  
                  {Math.max(0, left)}
                </span>
                <div>
                  <p className="font-display text-lg font-bold text-navy">
                    {left > 0 ? `${left} jours restants` : 'Échéance dépassée'}
                  </p>
                  <p className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <ClockIcon className="h-3.5 w-3.5" />
                    Limite : {formatDate(intervention.deadline)}
                  </p>
                </div>
              </div>
              <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${left <= 7 ? 'bg-eco-red' : 'bg-eco-orange'}`}
                  style={{ width: `${progress}%` }} />
                
              </div>
              <p className="mt-2 text-[11px] text-slate-500">{progress} % du délai consommé</p>

              <div className="mt-5 flex items-center gap-2 rounded-lg bg-surface p-3 ring-1 ring-hairline">
                <UsersIcon className="h-4 w-4 text-ocean" />
                <p className="text-[11px] text-slate-600">
                  {intervention.agents} agents · {intervention.team} · resp. {intervention.lead}
                </p>
              </div>
            </div>
          </Card>

          {perimeter &&
          <Card>
              <CardHeader
              title={`Périmètre ${perimeter.id}`}
              subtitle={`${perimeter.reportCount} signalements regroupés`}
              action={
              <StatusBadge
                label={perimeterStatusMeta[perimeter.status].label}
                tone={perimeterStatusMeta[perimeter.status].tone} />

              } />
            
              <div className="relative aspect-[4/3]">
                <MapView
                perimeters={[perimeter]}
                selectedPerimeterId={perimeter.id}
                tone="dark"
                showZoneLabels={false} />
              
              </div>
            </Card>
          }
        </div>
      </div>

      <Modal
        open={proofOpen}
        onClose={() => setProofOpen(false)}
        title="Ajouter la preuve après nettoyage"
        subtitle={`Intervention ${intervention.id} — ${intervention.zone}`}
        footer={
        <>
            <Button variant="secondary" onClick={() => setProofOpen(false)}>
              Annuler
            </Button>
            <Button
            variant="success"
            onClick={() => {
              addAfterProof(intervention.id, photo, tons);
              setProofOpen(false);
            }}>
            
              Enregistrer la preuve
            </Button>
          </>
        }>
        
        <div className="space-y-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Photo après nettoyage
            </p>
            <div className="mt-2 overflow-hidden rounded-xl ring-1 ring-hairline">
              <img src={photo} alt="Aperçu de la preuve après nettoyage" className="h-48 w-full object-cover" />
            </div>
            <label className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-hairline bg-surface py-3 text-[12px] font-semibold text-slate-600">
              Sélectionner une autre photo
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
            <label htmlFor="tons" className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Quantité estimée collectée (tonnes)
            </label>
            <input
              id="tons"
              type="number"
              step="0.1"
              min={0}
              value={tons}
              onChange={(e) => setTons(Number(e.target.value))}
              className="mt-1.5 h-10 w-full rounded-lg border-0 bg-surface px-3 text-sm text-navy ring-1 ring-inset ring-hairline focus:ring-2 focus:ring-ocean" />
            
          </div>
        </div>
      </Modal>
    </div>);

}