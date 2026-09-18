import React, { useState } from 'react';
import { FileTextIcon, PrinterIcon, TruckIcon } from 'lucide-react';
import { Card, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/modals/Modal';
import { DataTable, type Column } from '../../components/tables/DataTable';
import { SeverityBadge, StatusBadge } from '../../components/status/StatusBadge';
import { useEcomer } from '../../contexts/EcomerContext';
import { municipalTeams } from '../../data/mock-interventions';
import { daysBetween, formatArea, formatDate } from '../../utils/format';
import { interventionStatusMeta, materialMeta, severityMeta, severityOrder } from '../../utils/labels';
import type { Intervention, MaterialKey, Severity } from '../../types';

const materialKeys: MaterialKey[] = ['sacs', 'gants', 'camion', 'collecte', 'autre'];

export function MunicipalInterventionsPage() {
  const { interventions, perimeters, mandateTeam } = useEcomer();
  const [open, setOpen] = useState(false);
  const [mission, setMission] = useState<Intervention | null>(null);

  const openPerimeters = perimeters.filter((p) => p.status !== 'resolu');
  const [perimeterId, setPerimeterId] = useState(openPerimeters[0]?.id ?? '');
  const [team, setTeam] = useState(municipalTeams[0].name);
  const [lead, setLead] = useState(municipalTeams[0].lead);
  const [date, setDate] = useState('2026-09-05');
  const [materials, setMaterials] = useState<MaterialKey[]>(['sacs', 'gants', 'camion']);
  const [priority, setPriority] = useState<Severity>('eleve');

  const rows = interventions.filter((i) => i.operatorType === 'municipale');

  const columns: Array<Column<Intervention>> = [
  { key: 'id', header: 'Ordre de mission', render: (i) => i.id },
  { key: 'per', header: 'Périmètre', render: (i) => `${i.perimeterId} · ${i.zone}` },
  { key: 'team', header: 'Équipe', render: (i) => i.team, hideOn: 'sm' },
  { key: 'lead', header: 'Responsable', render: (i) => i.lead, hideOn: 'md' },
  { key: 'area', header: 'Surface', render: (i) => formatArea(i.areaM2), hideOn: 'lg' },
  { key: 'sev', header: 'Priorité', render: (i) => <SeverityBadge severity={i.priority} /> },
  {
    key: 'deadline',
    header: 'Échéance',
    render: (i) => {
      const left = daysBetween(new Date(), i.deadline);
      return (
        <div>
            <p className="font-semibold text-navy">{formatDate(i.deadline)}</p>
            <p className="text-[11px] text-slate-500">{left > 0 ? `${left} j restants` : 'Clôturé'}</p>
          </div>);

    }
  },
  {
    key: 'status',
    header: 'Statut',
    render: (i) =>
    <StatusBadge
      label={interventionStatusMeta[i.status].label}
      tone={interventionStatusMeta[i.status].tone} />


  },
  {
    key: 'actions',
    header: 'Actions',
    render: (i) =>
    <Button variant="secondary" size="sm" onClick={() => setMission(i)} icon={<FileTextIcon className="h-3.5 w-3.5" />}>
          Ordre de mission
        </Button>

  }];


  const selectCls =
  'mt-1.5 h-10 w-full rounded-lg border-0 bg-surface px-3 text-sm text-navy ring-1 ring-inset ring-hairline focus:ring-2 focus:ring-ocean';

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-4">
        {[
        ['Équipes disponibles', municipalTeams.length],
        ['Missions actives', rows.filter((r) => r.status === 'en_cours').length],
        ['Missions validées', rows.filter((r) => r.status === 'validee').length],
        ['Périmètres sans opérateur', openPerimeters.filter((p) => !p.assignedOngId).length]].
        map(([k, v]) =>
        <div key={k as string} className="rounded-xl bg-white p-4 ring-1 ring-hairline shadow-card">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{k}</p>
            <p className="mt-1 font-display text-2xl font-bold text-navy">{v}</p>
          </div>
        )}
      </div>

      <Card>
        <CardHeader
          title="Interventions municipales"
          subtitle="Équipes de la voirie mandatées directement par la Direction de l’Environnement"
          action={
          <Button variant="accent" onClick={() => setOpen(true)} icon={<TruckIcon className="h-4 w-4" />}>
              Mandater une équipe
            </Button>
          } />
        
        <DataTable columns={columns} rows={rows} />
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Mandater une équipe municipale"
        subtitle="L’ordre de mission ouvre une échéance de 30 jours"
        footer={
        <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button
            variant="accent"
            onClick={() => {
              mandateTeam({ perimeterId, team, lead, date, materials, priority });
              setOpen(false);
            }}>
            
              Émettre l’ordre de mission
            </Button>
          </>
        }>
        
        <div className="space-y-4">
          <label className="block">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Périmètre</span>
            <select value={perimeterId} onChange={(e) => setPerimeterId(e.target.value)} className={selectCls}>
              {openPerimeters.map((p) =>
              <option key={p.id} value={p.id}>
                  {p.id} — {p.zone} ({severityMeta[p.severity].label})
                </option>
              )}
            </select>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Équipe</span>
              <select
                value={team}
                onChange={(e) => {
                  setTeam(e.target.value);
                  const t = municipalTeams.find((x) => x.name === e.target.value);
                  if (t) setLead(t.lead);
                }}
                className={selectCls}>
                
                {municipalTeams.map((t) =>
                <option key={t.id} value={t.name}>
                    {t.name} ({t.agents} agents)
                  </option>
                )}
              </select>
            </label>
            <label className="block">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Responsable</span>
              <input value={lead} onChange={(e) => setLead(e.target.value)} className={selectCls} />
            </label>
            <label className="block">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Date d’intervention
              </span>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={selectCls} />
            </label>
            <label className="block">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Priorité</span>
              <select value={priority} onChange={(e) => setPriority(e.target.value as Severity)} className={selectCls}>
                {severityOrder.map((s) =>
                <option key={s} value={s}>
                    {severityMeta[s].label}
                  </option>
                )}
              </select>
            </label>
          </div>

          <fieldset>
            <legend className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Matériel</legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {materialKeys.map((m) =>
              <label
                key={m}
                className={`flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-medium ${
                materials.includes(m) ?
                'bg-ocean/5 text-navy ring-1 ring-inset ring-ocean/40' :
                'bg-surface text-slate-600 ring-1 ring-inset ring-hairline'}`
                }>
                
                  <input
                  type="checkbox"
                  checked={materials.includes(m)}
                  onChange={() =>
                  setMaterials((prev) => prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m])
                  }
                  className="h-4 w-4 rounded border-slate-300 text-ocean focus:ring-ocean" />
                
                  {materialMeta[m]}
                </label>
              )}
            </div>
          </fieldset>
        </div>
      </Modal>

      <Modal
        open={mission !== null}
        onClose={() => setMission(null)}
        title={mission ? `Ordre de mission ${mission.id}` : ''}
        subtitle="Direction de l’Environnement — Ville de Pointe-Noire"
        footer={
        <Button variant="secondary" onClick={() => setMission(null)} icon={<PrinterIcon className="h-4 w-4" />}>
            Imprimer
          </Button>
        }>
        
        {mission &&
        <div className="space-y-4">
            <div className="rounded-xl bg-navy p-5 text-white">
              <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-ecomer">
                République du Congo — Ville de Pointe-Noire
              </p>
              <p className="mt-2 font-display text-lg font-bold">Ordre de mission {mission.id}</p>
              <p className="mt-1 text-[11px] text-slate-300">
                Émis le {formatDate(mission.startDate)} · échéance {formatDate(mission.deadline)}
              </p>
            </div>
            <dl className="space-y-px overflow-hidden rounded-xl bg-hairline">
              {[
            ['Équipe mandatée', mission.team],
            ['Responsable', mission.lead],
            ['Périmètre', `${mission.perimeterId} — ${mission.zone}`],
            ['Surface', formatArea(mission.areaM2)],
            ['Priorité', severityMeta[mission.priority].label],
            ['Matériel attribué', mission.materials.map((m) => materialMeta[m]).join(', ')],
            ['Agents', `${mission.agents}`]].
            map(([k, v]) =>
            <div key={k} className="bg-white px-4 py-3">
                  <dt className="text-[10px] uppercase tracking-wide text-slate-500">{k}</dt>
                  <dd className="mt-0.5 text-[13px] font-semibold text-navy">{v}</dd>
                </div>
            )}
            </dl>
          </div>
        }
      </Modal>
    </div>);

}