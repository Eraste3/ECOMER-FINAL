
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from 'lucide-react';
import { Card, CardHeader } from '../../components/ui/Card';
import { StatusBadge, SeverityBadge } from '../../components/status/StatusBadge';
import { DataTable, type Column } from '../../components/tables/DataTable';
import { useEcomer } from '../../contexts/EcomerContext';
import { daysBetween, formatArea, formatDate } from '../../utils/format';
import { interventionStatusMeta } from '../../utils/labels';
import type { Intervention } from '../../types';

export function OngInterventionsPage() {
  const { interventions } = useEcomer();
  const rows = interventions.filter((i) => i.operatorType === 'ong');

  const columns: Array<Column<Intervention>> = [
    {
      key: 'id',
      header: 'Intervention',
      render: (i) =>
        <div>
          <p className="font-semibold text-navy">{i.id}</p>
          <p className="text-[11px] text-slate-500">{i.perimeterId}</p>
        </div>

    },
    { key: 'zone', header: 'Zone', render: (i) => i.zone },
    { key: 'team', header: 'Équipe', render: (i) => `${i.team} · ${i.agents} agents`, hideOn: 'md' },
    { key: 'area', header: 'Surface', render: (i) => formatArea(i.areaM2), hideOn: 'sm' },
    { key: 'sev', header: 'Gravité', render: (i) => <SeverityBadge severity={i.severity} /> },
    {
      key: 'deadline',
      header: 'Échéance',
      render: (i) => {
        const left = daysBetween(new Date(), i.deadline);
        return (
          <div>
            <p className="font-semibold text-navy">{formatDate(i.deadline)}</p>
            <p
              className={`text-[11px] font-bold ${left <= 7 ? 'text-eco-red' : left <= 15 ? 'text-amber-600' : 'text-emerald-600'}`
              }>

              {left > 0 ? `${left} jours restants` : 'Échéance dépassée'}
            </p>
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
      header: '',
      render: (i) =>
        <Link
          to={`/recycleur/interventions/${i.id}`}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-ocean hover:underline">

          Ouvrir <ArrowRightIcon className="h-3 w-3" />
        </Link>

    }];


  return (
    <Card>
      <CardHeader
        title="Mes interventions"
        subtitle="Chaque autorisation ouvre une échéance de 30 jours pour déposer la preuve « après »" />

      <DataTable columns={columns} rows={rows} />
    </Card>);

}