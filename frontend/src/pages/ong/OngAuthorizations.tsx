import { useState } from 'react';
import { SendIcon } from 'lucide-react';
import { Card, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/status/StatusBadge';
import { DataTable, type Column } from '../../components/tables/DataTable';
import { usePerimeters } from '../../hooks/usePerimeters';
import { useAuthorizationRequests } from '../../hooks/useAuthorizationRequests';
import { useAuth } from '../../hooks/useAuth';
import { formatDate, formatDateTime } from '../../utils/format';
import { materialMeta, requestStatusMeta, severityMeta } from '../../utils/labels';
import type { MaterialKey } from '../../types';

const interventionTypes = [
'Collecte manuelle',
'Dépollution de canal',
'Dépollution littorale',
'Curage de canal',
'Retrait de filets'];


const materialKeys: MaterialKey[] = ['sacs', 'gants', 'camion', 'collecte', 'autre'];

export function OngAuthorizationsPage() {
  const { perimeters, loading: perimetersLoading } = usePerimeters();
  const { requests, loading: requestsLoading, createRequest } = useAuthorizationRequests();
  const { user } = useAuth();
  const openPerimeters = perimeters.filter((p: any) => p.status !== 'resolu');

  const [perimeterId, setPerimeterId] = useState(openPerimeters[0]?.id ?? '');
  const [plannedDate, setPlannedDate] = useState('2026-09-10');
  const [agents, setAgents] = useState(12);
  const [interventionType, setInterventionType] = useState(interventionTypes[0]);
  const [materials, setMaterials] = useState<MaterialKey[]>(['sacs', 'gants']);
  const [note, setNote] = useState('');

  const perimeter = perimeters.find((p: any) => p.id === perimeterId);
  const mine = requests.filter((r: any) => r.ongId === user?.id);

  const toggleMaterial = (m: MaterialKey) =>
  setMaterials((prev) => prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!perimeter) return;
    createRequest({
      ongId: user?.id || 'ONG-001',
      ongName: user?.name || 'ONG',
      perimeterId: perimeter.id,
      zone: perimeter.zone,
      wasteType: perimeter.dominantWaste,
      severity: perimeter.severity,
      plannedDate,
      agents,
      interventionType,
      materials,
      note: note || undefined
    });
    setNote('');
  };

  const columns: Array<Column<any>> = [
  {
    key: 'id',
    header: 'Demande',
    render: (r) =>
    <div>
          <p className="font-semibold text-navy">{r.id}</p>
          <p className="text-[11px] text-slate-500">{formatDateTime(r.submittedAt)}</p>
        </div>

  },
  { key: 'per', header: 'Périmètre', render: (r) => `${r.perimeterId} · ${r.zone}` },
  { key: 'date', header: 'Date prévue', render: (r) => formatDate(r.plannedDate), hideOn: 'sm' },
  { key: 'agents', header: 'Agents', render: (r) => r.agents, hideOn: 'md' },
  {
    key: 'mat',
    header: 'Matériel',
    hideOn: 'lg',
    render: (r) =>
    <span className="text-[11px] text-slate-500">
          {r.materials?.map((m: any) => materialMeta[m as keyof typeof materialMeta]).join(', ') || 'Aucun'}
        </span>

  },
  {
    key: 'status',
    header: 'Statut',
    render: (r) =>
    <StatusBadge label={requestStatusMeta[r.status as keyof typeof requestStatusMeta]?.label || r.status} tone={requestStatusMeta[r.status as keyof typeof requestStatusMeta]?.tone || 'neutral'} />

    }];


  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
      {perimetersLoading || requestsLoading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-sm text-slate-500">Chargement...</p>
        </div>
      ) : (
        <>
          <Card>
            <CardHeader
              title="Nouvelle demande d'autorisation"
              subtitle="Transmise au guichet unique de la Direction de l'Environnement" />
            
            <form onSubmit={onSubmit} className="space-y-4 p-5">
              <div>
                <label htmlFor="per" className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Périmètre concerné
                </label>
                <select
                  id="per"
                  value={perimeterId}
                  onChange={(e) => setPerimeterId(e.target.value)}
                  className="mt-1.5 h-10 w-full rounded-lg border-0 bg-surface px-3 text-sm text-navy ring-1 ring-inset ring-hairline focus:ring-2 focus:ring-ocean">
                  
                  {openPerimeters.map((p) =>
                  <option key={p.id} value={p.id}>
                      {p.id} — {p.zone} ({severityMeta[p.severity as keyof typeof severityMeta]?.label || p.severity})
                    </option>
                  )}
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="date" className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Date prévue
                  </label>
                  <input
                    id="date"
                    type="date"
                    value={plannedDate}
                    onChange={(e) => setPlannedDate(e.target.value)}
                    className="mt-1.5 h-10 w-full rounded-lg border-0 bg-surface px-3 text-sm text-navy ring-1 ring-inset ring-hairline focus:ring-2 focus:ring-ocean" />
                  
                </div>
                <div>
                  <label htmlFor="agents" className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Nombre d'agents
                  </label>
                  <input
                    id="agents"
                    type="number"
                    min={1}
                    max={80}
                    value={agents}
                    onChange={(e) => setAgents(Number(e.target.value))}
                    className="mt-1.5 h-10 w-full rounded-lg border-0 bg-surface px-3 text-sm text-navy ring-1 ring-inset ring-hairline focus:ring-2 focus:ring-ocean" />
                  
                </div>
              </div>

              <div>
                <label htmlFor="type" className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Type d'intervention
                </label>
                <select
                  id="type"
                  value={interventionType}
                  onChange={(e) => setInterventionType(e.target.value)}
                  className="mt-1.5 h-10 w-full rounded-lg border-0 bg-surface px-3 text-sm text-navy ring-1 ring-inset ring-hairline focus:ring-2 focus:ring-ocean">
                  
                  {interventionTypes.map((t) =>
                  <option key={t} value={t}>
                      {t}
                    </option>
                  )}
                </select>
              </div>

              <fieldset>
                <legend className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Demande de matériel
                </legend>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {materialKeys.map((m) =>
                  <label
                    key={m}
                    className={`flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors ${
                    materials.includes(m) ?
                    'bg-ocean/5 text-navy ring-1 ring-inset ring-ocean/40' :
                    'bg-surface text-slate-600 ring-1 ring-inset ring-hairline'}`
                    }>
                    
                      <input
                      type="checkbox"
                      checked={materials.includes(m)}
                      onChange={() => toggleMaterial(m)}
                      className="h-4 w-4 rounded border-slate-300 text-ocean focus:ring-ocean" />
                    
                      {materialMeta[m]}
                    </label>
                  )}
                </div>
              </fieldset>

              <div>
                <label htmlFor="note" className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Précisions (facultatif)
                </label>
                <textarea
                  id="note"
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Besoins spécifiques, contraintes d'accès…"
                  className="mt-1.5 w-full rounded-lg border-0 bg-surface p-3 text-sm text-navy ring-1 ring-inset ring-hairline placeholder:text-slate-400 focus:ring-2 focus:ring-ocean" />
              
              </div>

              <div className="rounded-lg bg-sky-50 px-3 py-2.5 text-[11px] text-sky-800 ring-1 ring-inset ring-sky-100">
                Une autorisation approuvée ouvre une échéance d'intervention de 30 jours.
              </div>

              <Button type="submit" variant="accent" block size="lg" icon={<SendIcon className="h-4 w-4" />}>
                Soumettre la demande
              </Button>
            </form>
          </Card>

          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              {(['en_attente', 'approuvee', 'refusee'] as const).map((s) =>
              <div key={s} className="rounded-xl bg-white p-4 ring-1 ring-hairline shadow-card">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    {requestStatusMeta[s].label}
                  </p>
                  <p className="mt-1 font-display text-2xl font-bold text-navy">
                    {mine.filter((r) => r.status === s).length}
                  </p>
                </div>
              )}
            </div>

            <Card>
              <CardHeader title="Suivi de mes demandes" subtitle="Statut délivré par la Direction de l'Environnement" />
              <DataTable columns={columns} rows={mine} emptyTitle="Aucune demande" emptyMessage="Soumettez votre première demande d'autorisation." />
            </Card>
          </div>
        </>
      )}
    </div>);

}