import { useState } from 'react';
import { CheckIcon, EyeIcon, ShieldOffIcon, XIcon } from 'lucide-react';
import { Card, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { DataTable, type Column } from '../../components/tables/DataTable';
import { StatusBadge } from '../../components/status/StatusBadge';
import { Modal } from '../../components/modals/Modal';
import { useEcomer } from '../../contexts/EcomerContext';
import { formatDate } from '../../utils/format';
import { accountStatusMeta } from '../../utils/labels';
import type { AccountStatus, Ong } from '../../types';

export function AdminOngsPage() {
  const { ongs, setOngStatus, perimeters } = useEcomer();
  const [filter, setFilter] = useState<'tous' | AccountStatus>('tous');
  const [detail, setDetail] = useState<Ong | null>(null);

  const rows = filter === 'tous' ? ongs : ongs.filter((o) => o.status === filter);

  const cards: Array<{ key: AccountStatus; label: string; accent: string; }> = [
    { key: 'en_attente', label: 'ONG en attente', accent: '#f59e0b' },
    { key: 'actif', label: 'ONG validées', accent: '#10b981' },
    { key: 'suspendu', label: 'ONG suspendues', accent: '#ef4444' }];


  const columns: Array<Column<Ong>> = [
    {
      key: 'name',
      header: 'Nom ONG',
      render: (o) =>
        <div className="flex items-center gap-2.5">
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold"
            style={{ backgroundColor: `${o.logoColor}26`, color: o.logoColor }}>

            {o.name.slice(0, 2).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate font-semibold text-white">{o.name}</p>
            <p className="truncate text-[11px] text-slate-400">{o.email}</p>
          </div>
        </div>

    },
    { key: 'manager', header: 'Responsable', render: (o) => o.manager, hideOn: 'sm' },
    { key: 'zone', header: 'Zone', render: (o) => o.zone, hideOn: 'md' },
    { key: 'agents', header: 'Agents', render: (o) => o.agents, hideOn: 'lg' },
    {
      key: 'status',
      header: 'Statut',
      render: (o) =>
        <StatusBadge label={accountStatusMeta[o.status].label} tone={accountStatusMeta[o.status].tone} dark />

    },
    { key: 'date', header: 'Date', render: (o) => formatDate(o.createdAt), hideOn: 'lg' },
    {
      key: 'actions',
      header: 'Actions',
      render: (o) =>
        <div className="flex flex-wrap items-center gap-1.5">
          <Button variant="outline-dark" size="sm" onClick={() => setDetail(o)} icon={<EyeIcon className="h-3.5 w-3.5" />}>
            Voir profil
          </Button>
          {o.status !== 'actif' &&
            <Button variant="success" size="sm" onClick={() => setOngStatus(o.id, 'actif')} icon={<CheckIcon className="h-3.5 w-3.5" />}>
              Approuver
            </Button>
          }
          {o.status === 'en_attente' &&
            <Button variant="danger" size="sm" onClick={() => setOngStatus(o.id, 'suspendu')} icon={<XIcon className="h-3.5 w-3.5" />}>
              Refuser
            </Button>
          }
          {o.status === 'actif' &&
            <Button variant="danger" size="sm" onClick={() => setOngStatus(o.id, 'suspendu')} icon={<ShieldOffIcon className="h-3.5 w-3.5" />}>
              Suspendre
            </Button>
          }
        </div>

    }];


  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        {cards.map((c) =>
          <button
            key={c.key}
            onClick={() => setFilter(c.key)}
            className={`glass-dark rounded-xl p-4 text-left transition-all ${filter === c.key ? 'ring-1 ring-inset ring-eco-orange/50' : ''}`
            }>

            <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: c.accent }}>
              {c.label}
            </p>
            <p className="mt-1 font-display text-2xl font-bold text-white">
              {ongs.filter((o) => o.status === c.key).length}
            </p>
          </button>
        )}
      </div>

      <Card tone="dark">
        <CardHeader
          tone="dark"
          title="Validation des comptes ONG"
          subtitle="Une ONG accréditée peut déposer des signalements prioritaires"
          action={
            <div className="inline-flex rounded-lg bg-white/5 p-0.5 ring-1 ring-inset ring-white/10">
              {(['tous', 'en_attente', 'actif', 'suspendu'] as const).map((f) =>
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-[6px] px-2.5 py-1 text-[11px] font-semibold transition-colors ${filter === f ? 'bg-eco-orange text-white' : 'text-slate-400 hover:text-white'}`
                  }>

                  {f === 'tous' ? 'Toutes' : accountStatusMeta[f].label}
                </button>
              )}
            </div>
          } />

        <DataTable columns={columns} rows={rows} tone="dark" />
      </Card>

      <Modal
        open={detail !== null}
        onClose={() => setDetail(null)}
        tone="dark"
        title={detail?.name ?? ''}
        subtitle={detail ? `${detail.zone} · ${detail.agents} agents` : undefined}
        footer={
          detail &&
          <>
            <Button variant="outline-dark" onClick={() => setDetail(null)}>
              Fermer
            </Button>
            {detail.status !== 'actif' &&
              <Button
                variant="success"
                onClick={() => {
                  setOngStatus(detail.id, 'actif');
                  setDetail(null);
                }}>

                Approuver l’accréditation
              </Button>
            }
          </>

        }>

        {detail &&
          <div className="space-y-4">
            <dl className="grid gap-2 sm:grid-cols-2">
              {[
                ['Identifiant', detail.id],
                ['Responsable', detail.manager],
                ['Email', detail.email],
                ['Téléphone', detail.phone],
                ['Zone d’action', detail.zone],
                ['Agents déclarés', `${detail.agents}`],
                ['Interventions réalisées', `${detail.interventionsDone}`],
                ['Accréditation', detail.accredited ? 'Accréditée' : 'Non accréditée'],
                ['Inscription', formatDate(detail.createdAt)],
                ['Statut', accountStatusMeta[detail.status].label]].
                map(([k, v]) =>
                  <div key={k} className="rounded-lg bg-white/5 px-3 py-2.5">
                    <dt className="text-[10px] uppercase tracking-wide text-slate-500">{k}</dt>
                    <dd className="mt-0.5 text-[13px] font-semibold text-white">{v}</dd>
                  </div>
                )}
            </dl>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Périmètres affectés
              </p>
              <ul className="mt-2 space-y-1.5">
                {perimeters.
                  filter((p) => p.assignedOngId === detail.id).
                  map((p) =>
                    <li
                      key={p.id}
                      className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-[12px] text-slate-300">

                      <span>
                        {p.id} · {p.zone}
                      </span>
                      <span className="text-slate-500">{p.reportCount} signalements</span>
                    </li>
                  )}
                {perimeters.filter((p) => p.assignedOngId === detail.id).length === 0 &&
                  <li className="rounded-lg bg-white/5 px-3 py-2 text-[12px] text-slate-500">
                    Aucun périmètre affecté
                  </li>
                }
              </ul>
            </div>
          </div>
        }
      </Modal>
    </div>);

}