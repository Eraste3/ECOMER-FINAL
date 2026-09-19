import { Link } from 'react-router-dom';
import { ArrowRightIcon, PlusIcon } from 'lucide-react';
import { Card, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/status/StatusBadge';
import { DataTable, type Column } from '../../components/tables/DataTable';
import { useMissions } from '../../hooks/useMissions';
import { formatDate } from '../../utils/format';
import { missionStatusMeta } from '../../utils/labels';

export function EcomerMissionsPage() {
  const { missions, loading } = useMissions();

  const columns: Array<Column<any>> = [
    {
      key: 'id',
      header: 'Mission',
      render: (m) =>
        <div>
          <p className="font-semibold text-navy">{m.id}</p>
          <p className="text-[11px] text-slate-500">{m.perimeterId}</p>
        </div>
    },
    { key: 'zone', header: 'Zone', render: (m) => m.zone },
    { key: 'team', header: 'Équipe', render: (m) => m.teamName },
    { key: 'priority', header: 'Priorité', render: (m) => m.priority },
    { key: 'estimated', header: 'Estimé', render: (m) => `${m.estimatedTons} t` },
    {
      key: 'planned',
      header: 'Planifiée',
      render: (m) => formatDate(m.plannedDate)
    },
    {
      key: 'status',
      header: 'Statut',
      render: (m) =>
        <StatusBadge
          label={missionStatusMeta[m.status as keyof typeof missionStatusMeta]?.label || m.status}
          tone={missionStatusMeta[m.status as keyof typeof missionStatusMeta]?.tone || 'neutral'} />
    },
    {
      key: 'actions',
      header: '',
      render: (m) =>
        <Link
          to={`/ECOMER/missions/${m.id}`}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-ocean hover:underline">
          Ouvrir <ArrowRightIcon className="h-3 w-3" />
        </Link>
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-slate-500">Chargement...</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader
        title="Missions ECOMER"
        subtitle="Opérations de collecte et nettoyage"
        action={
          <Button variant="accent" icon={<PlusIcon className="h-4 w-4" />}>
            Nouvelle mission
          </Button>
        } />

      <DataTable columns={columns} rows={missions} />
    </Card>);
}
