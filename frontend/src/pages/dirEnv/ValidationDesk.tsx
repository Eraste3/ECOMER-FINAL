import React, { useState } from 'react';
import { CheckIcon, EyeIcon, XIcon } from 'lucide-react';
import { Card, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { DataTable, type Column } from '../../components/tables/DataTable';
import { SeverityBadge, StatusBadge } from '../../components/status/StatusBadge';
import { Modal } from '../../components/modals/Modal';
import { ConfirmDialog } from '../../components/modals/ConfirmDialog';
import { MapView } from '../../components/maps/MapView';
import { useEcomer } from '../../contexts/EcomerContext';
import { formatArea, formatDate, formatDateTime } from '../../utils/format';
import { materialMeta, requestStatusMeta, wasteMeta } from '../../utils/labels';
import type { AuthorizationRequest, RequestStatus } from '../../types';

export function ValidationDeskPage() {
  const { requests, perimeters, decideRequest } = useEcomer();
  const [filter, setFilter] = useState<'tous' | RequestStatus>('en_attente');
  const [detail, setDetail] = useState<AuthorizationRequest | null>(null);
  const [confirm, setConfirm] = useState<{id: string;decision: 'approuvee' | 'refusee';} | null>(null);

  const rows = filter === 'tous' ? requests : requests.filter((r) => r.status === filter);
  const perimeter = detail ? perimeters.find((p) => p.id === detail.perimeterId) : undefined;

  const columns: Array<Column<AuthorizationRequest>> = [
  {
    key: 'id',
    header: 'ID',
    render: (r) =>
    <div>
          <p className="font-semibold text-navy">{r.id}</p>
          <p className="text-[11px] text-slate-500">{formatDateTime(r.submittedAt)}</p>
        </div>

  },
  { key: 'ong', header: 'ONG', render: (r) => r.ongName },
  { key: 'per', header: 'Périmètre', render: (r) => r.perimeterId, hideOn: 'sm' },
  { key: 'zone', header: 'Zone', render: (r) => r.zone, hideOn: 'sm' },
  {
    key: 'waste',
    header: 'Type de pollution',
    render: (r) => wasteMeta[r.wasteType].short,
    hideOn: 'md'
  },
  { key: 'sev', header: 'Gravité', render: (r) => <SeverityBadge severity={r.severity} /> },
  {
    key: 'mat',
    header: 'Matériel demandé',
    hideOn: 'lg',
    render: (r) =>
    <span className="text-[11px] text-slate-500">
          {r.materials.map((m) => materialMeta[m]).join(', ')}
        </span>

  },
  { key: 'date', header: 'Date', render: (r) => formatDate(r.plannedDate), hideOn: 'lg' },
  {
    key: 'status',
    header: 'Statut',
    render: (r) =>
    <StatusBadge label={requestStatusMeta[r.status].label} tone={requestStatusMeta[r.status].tone} />

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (r) =>
    <div className="flex items-center gap-1.5">
          <Button variant="secondary" size="sm" onClick={() => setDetail(r)} icon={<EyeIcon className="h-3.5 w-3.5" />}>
            Voir
          </Button>
          {r.status === 'en_attente' &&
      <>
              <Button
          variant="success"
          size="sm"
          onClick={() => setConfirm({ id: r.id, decision: 'approuvee' })}
          icon={<CheckIcon className="h-3.5 w-3.5" />}>
          
                Approuver
              </Button>
              <Button
          variant="danger"
          size="sm"
          onClick={() => setConfirm({ id: r.id, decision: 'refusee' })}
          icon={<XIcon className="h-3.5 w-3.5" />}>
          
                Refuser
              </Button>
            </>
      }
        </div>

  }];


  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        {(['en_attente', 'approuvee', 'refusee'] as const).map((s) =>
        <button
          key={s}
          onClick={() => setFilter(s)}
          className={`rounded-xl p-4 text-left transition-all ${
          filter === s ? 'bg-white ring-2 ring-ocean shadow-card' : 'bg-white ring-1 ring-hairline'}`
          }>
          
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              {requestStatusMeta[s].label}
            </p>
            <p className="mt-1 font-display text-2xl font-bold text-navy">
              {requests.filter((r) => r.status === s).length}
            </p>
          </button>
        )}
      </div>

      <Card>
        <CardHeader
          title="Demandes à traiter"
          subtitle="Guichet unique de validation des interventions ONG"
          action={
          <div className="inline-flex rounded-lg bg-slate-100 p-0.5">
              {(['tous', 'en_attente', 'approuvee', 'refusee'] as const).map((f) =>
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-[6px] px-2.5 py-1 text-[11px] font-semibold transition-colors ${
              filter === f ? 'bg-white text-navy shadow-sm' : 'text-slate-500 hover:text-navy'}`
              }>
              
                  {f === 'tous' ? 'Toutes' : requestStatusMeta[f].label}
                </button>
            )}
            </div>
          } />
        
        <DataTable columns={columns} rows={rows} />
      </Card>

      <Modal
        open={detail !== null}
        onClose={() => setDetail(null)}
        title={detail ? `Demande ${detail.id}` : ''}
        subtitle={detail ? `${detail.ongName} — périmètre ${detail.perimeterId}` : undefined}
        size="lg"
        footer={
        detail && detail.status === 'en_attente' ?
        <>
              <Button
            variant="danger"
            onClick={() => {
              setConfirm({ id: detail.id, decision: 'refusee' });
              setDetail(null);
            }}>
            
                Refuser
              </Button>
              <Button
            variant="success"
            onClick={() => {
              setConfirm({ id: detail.id, decision: 'approuvee' });
              setDetail(null);
            }}>
            
                Approuver la demande
              </Button>
            </> :

        <Button variant="secondary" onClick={() => setDetail(null)}>
              Fermer
            </Button>

        }>
        
        {detail &&
        <div className="grid gap-4 sm:grid-cols-2">
            <dl className="space-y-px overflow-hidden rounded-xl bg-hairline">
              {[
            ['ONG demandeuse', detail.ongName],
            ['Périmètre', `${detail.perimeterId} — ${detail.zone}`],
            ['Type de pollution', wasteMeta[detail.wasteType].label],
            ['Type d’intervention', detail.interventionType],
            ['Date prévue', formatDate(detail.plannedDate)],
            ['Agents mobilisés', `${detail.agents}`],
            ['Matériel demandé', detail.materials.map((m) => materialMeta[m]).join(', ')],
            ['Surface du périmètre', perimeter ? formatArea(perimeter.areaM2) : '—'],
            ['Signalements regroupés', perimeter ? `${perimeter.reportCount}` : '—'],
            ['Précisions', detail.note ?? 'Aucune']].
            map(([k, v]) =>
            <div key={k} className="bg-white px-4 py-3">
                  <dt className="text-[10px] uppercase tracking-wide text-slate-500">{k}</dt>
                  <dd className="mt-0.5 text-[13px] font-semibold text-navy">{v}</dd>
                </div>
            )}
            </dl>

            <div className="space-y-3">
              {perimeter &&
            <div className="overflow-hidden rounded-xl bg-navy">
                  <div className="relative aspect-[4/3]">
                    <MapView
                  perimeters={[perimeter]}
                  selectedPerimeterId={perimeter.id}
                  tone="dark"
                  showZoneLabels={false} />
                
                  </div>
                </div>
            }
              <div className="rounded-xl bg-amber-50 p-4 ring-1 ring-inset ring-amber-200">
                <p className="text-[12px] font-semibold text-amber-900">Règle ECOMER</p>
                <p className="mt-1 text-[11px] text-amber-800">
                  L’approbation ouvre une intervention avec échéance de 30 jours et attribue le matériel
                  municipal demandé. Le périmètre passe au statut « En intervention ».
                </p>
              </div>
            </div>
          </div>
        }
      </Modal>

      <ConfirmDialog
        open={confirm !== null}
        onClose={() => setConfirm(null)}
        onConfirm={() => confirm && decideRequest(confirm.id, confirm.decision)}
        title={confirm?.decision === 'approuvee' ? 'Approuver la demande' : 'Refuser la demande'}
        message={
        confirm?.decision === 'approuvee' ?
        'L’ONG sera autorisée à intervenir et disposera de 30 jours pour déposer la preuve « après ».' :
        'La demande sera refusée. L’ONG en sera notifiée et pourra soumettre un nouveau dossier.'
        }
        confirmLabel={confirm?.decision === 'approuvee' ? 'Approuver' : 'Refuser'}
        destructive={confirm?.decision === 'refusee'} />
      
    </div>);

}