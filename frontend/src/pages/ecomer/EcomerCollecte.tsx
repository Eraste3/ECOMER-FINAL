import { Link } from 'react-router-dom';
import { ArrowRightIcon, PlusIcon } from 'lucide-react';
import { Card, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/status/StatusBadge';
import { DataTable, type Column } from '../../components/tables/DataTable';
import { useCollecte } from '../../hooks/useCollecte';
import { formatDate } from '../../utils/format';

export function EcomerCollectePage() {
  const { operations, loading } = useCollecte();

  const columns: Array<Column<any>> = [
    {
      key: 'id',
      header: 'Opération',
      render: (o) =>
        <div>
          <p className="font-semibold text-navy">{o.id}</p>
          <p className="text-[11px] text-slate-500">{o.perimeterId}</p>
        </div>
    },
    { key: 'zone', header: 'Zone', render: (o) => o.zone },
    { key: 'operator', header: 'Opérateur', render: (o) => o.operator },
    { key: 'team', header: 'Équipe', render: (o) => `${o.team} · ${o.agents} agents` },
    { key: 'materials', header: 'Matériel', render: (o) => o.materials.join(', ') },
    {
      key: 'planned',
      header: 'Planifiée',
      render: (o) => formatDate(o.plannedDate)
    },
    {
      key: 'status',
      header: 'Statut',
      render: (o) => {
        const statusMap: Record<string, {label: string; tone: string}> = {
          planifie: { label: 'Planifiée', tone: 'info' },
          en_cours: { label: 'En cours', tone: 'warning' },
          terminee: { label: 'Terminée', tone: 'success' },
          annule: { label: 'Annulée', tone: 'danger' }
        };
        const meta = statusMap[o.status] || { label: o.status, tone: 'neutral' };
        return <StatusBadge label={meta.label} tone={meta.tone as any} />;
      }
    },
    {
      key: 'actions',
      header: '',
      render: (o) =>
        <Link
          to={`/ECOMER/collecte/${o.id}`}
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
        title="Opérations de collecte"
        subtitle="Gestion des opérations de terrain ECOMER"
        action={
          <Button variant="accent" icon={<PlusIcon className="h-4 w-4" />}>
            Nouvelle opération
          </Button>
        } />

      <DataTable columns={columns} rows={operations} />
    </Card>);
}
