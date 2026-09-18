import React, { useState } from 'react';
import { EyeIcon, PencilIcon, SearchIcon, ShieldOffIcon } from 'lucide-react';
import { Card, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { DataTable, type Column } from '../../components/tables/DataTable';
import { StatusBadge } from '../../components/status/StatusBadge';
import { Modal } from '../../components/modals/Modal';
import { ConfirmDialog } from '../../components/modals/ConfirmDialog';
import { useEcomer } from '../../contexts/EcomerContext';
import { formatDate, relativeTime } from '../../utils/format';
import { accountStatusMeta, roleMeta } from '../../utils/labels';
import type { AppUser, UserRole } from '../../types';

const filters: Array<{key: 'tous' | UserRole;label: string;}> = [
{ key: 'tous', label: 'Tous' },
{ key: 'citoyen', label: 'Citoyens' },
{ key: 'ong', label: 'ONG' },
{ key: 'direnv', label: 'Direction Environnement' },
{ key: 'agent', label: 'Agents' },
{ key: 'admin', label: 'Administrateurs' }];


export function AdminUsersPage() {
  const { users, setUserStatus } = useEcomer();
  const [role, setRole] = useState<'tous' | UserRole>('tous');
  const [query, setQuery] = useState('');
  const [detail, setDetail] = useState<AppUser | null>(null);
  const [suspend, setSuspend] = useState<AppUser | null>(null);

  const rows = users.filter(
    (u) =>
    (role === 'tous' || u.role === role) && (
    query.trim() === '' ||
    u.name.toLowerCase().includes(query.toLowerCase()) ||
    u.email.toLowerCase().includes(query.toLowerCase()))
  );

  const columns: Array<Column<AppUser>> = [
  {
    key: 'name',
    header: 'Nom',
    render: (u) =>
    <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-[10px] font-bold text-white">
            {u.name.
        split(' ').
        map((p) => p[0]).
        slice(0, 2).
        join('')}
          </span>
          <div className="min-w-0">
            <p className="truncate font-semibold text-white">{u.name}</p>
            <p className="truncate text-[11px] text-slate-400">{u.organisation ?? u.zone}</p>
          </div>
        </div>

  },
  { key: 'email', header: 'Email', render: (u) => <span className="text-slate-400">{u.email}</span>, hideOn: 'md' },
  {
    key: 'role',
    header: 'Rôle',
    render: (u) => <StatusBadge label={roleMeta[u.role].label} tone={roleMeta[u.role].tone} dark />
  },
  {
    key: 'status',
    header: 'Statut',
    render: (u) =>
    <StatusBadge label={accountStatusMeta[u.status].label} tone={accountStatusMeta[u.status].tone} dark />

  },
  { key: 'created', header: 'Inscription', render: (u) => formatDate(u.createdAt), hideOn: 'lg' },
  { key: 'last', header: 'Dernière activité', render: (u) => relativeTime(u.lastActivity), hideOn: 'lg' },
  {
    key: 'actions',
    header: 'Actions',
    render: (u) =>
    <div className="flex items-center gap-1.5">
          <Button variant="outline-dark" size="sm" onClick={() => setDetail(u)} icon={<EyeIcon className="h-3.5 w-3.5" />}>
            Voir
          </Button>
          <Button variant="outline-dark" size="sm" icon={<PencilIcon className="h-3.5 w-3.5" />}>
            Modifier
          </Button>
          <Button
        variant={u.status === 'suspendu' ? 'success' : 'danger'}
        size="sm"
        onClick={() =>
        u.status === 'suspendu' ? setUserStatus(u.id, 'actif') : setSuspend(u)
        }
        icon={<ShieldOffIcon className="h-3.5 w-3.5" />}>
        
            {u.status === 'suspendu' ? 'Réactiver' : 'Suspendre'}
          </Button>
        </div>

  }];


  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
        ['Comptes actifs', users.filter((u) => u.status === 'actif').length],
        ['En attente', users.filter((u) => u.status === 'en_attente').length],
        ['Suspendus', users.filter((u) => u.status === 'suspendu').length],
        ['Total', users.length]].
        map(([k, v]) =>
        <div key={k as string} className="glass-dark rounded-xl p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{k}</p>
            <p className="mt-1 font-display text-2xl font-bold text-white">{v}</p>
          </div>
        )}
      </div>

      <Card tone="dark">
        <CardHeader
          tone="dark"
          title="Gestion des utilisateurs"
          subtitle={`${rows.length} compte(s) affiché(s)`}
          action={
          <label className="relative">
              <span className="sr-only">Rechercher un utilisateur</span>
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
              <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Nom ou email…"
              className="h-9 w-56 rounded-lg bg-white/5 pl-9 pr-3 text-xs text-white ring-1 ring-inset ring-white/10 outline-none placeholder:text-slate-500 focus:ring-cyan-ecomer/40" />
            
            </label>
          } />
        
        <div className="flex gap-1.5 overflow-x-auto border-b border-white/10 px-5 py-3">
          {filters.map((f) =>
          <button
            key={f.key}
            onClick={() => setRole(f.key)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors ${
            role === f.key ?
            'bg-eco-orange text-white' :
            'bg-white/5 text-slate-400 ring-1 ring-inset ring-white/10 hover:text-white'}`
            }>
            
              {f.label}
            </button>
          )}
        </div>
        <DataTable columns={columns} rows={rows} tone="dark" />
      </Card>

      <Modal
        open={detail !== null}
        onClose={() => setDetail(null)}
        tone="dark"
        title={detail?.name ?? ''}
        subtitle={detail ? roleMeta[detail.role].label : undefined}
        footer={
        <Button variant="outline-dark" onClick={() => setDetail(null)}>
            Fermer
          </Button>
        }>
        
        {detail &&
        <dl className="grid gap-2 sm:grid-cols-2">
            {[
          ['Identifiant', detail.id],
          ['Email', detail.email],
          ['Rôle', roleMeta[detail.role].label],
          ['Statut', accountStatusMeta[detail.status].label],
          ['Zone', detail.zone],
          ['Organisation', detail.organisation ?? '—'],
          ['Inscription', formatDate(detail.createdAt)],
          ['Dernière activité', relativeTime(detail.lastActivity)],
          ['EcoPoints', detail.ecoPoints !== undefined ? `${detail.ecoPoints}` : '—']].
          map(([k, v]) =>
          <div key={k} className="rounded-lg bg-white/5 px-3 py-2.5">
                <dt className="text-[10px] uppercase tracking-wide text-slate-500">{k}</dt>
                <dd className="mt-0.5 text-[13px] font-semibold text-white">{v}</dd>
              </div>
          )}
          </dl>
        }
      </Modal>

      <ConfirmDialog
        open={suspend !== null}
        onClose={() => setSuspend(null)}
        onConfirm={() => suspend && setUserStatus(suspend.id, 'suspendu')}
        title="Suspendre le compte"
        message={`Le compte de ${suspend?.name ?? ''} sera suspendu. L’utilisateur ne pourra plus se connecter ni signaler.`}
        confirmLabel="Suspendre"
        destructive
        tone="dark" />
      
    </div>);

}