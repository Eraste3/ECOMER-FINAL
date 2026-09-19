import { Link } from 'react-router-dom';
import { ArrowRightIcon, PlusIcon } from 'lucide-react';
import { Card, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/status/StatusBadge';
import { DataTable, type Column } from '../../components/tables/DataTable';
import { useCitizenCalls } from '../../hooks/useCitizenCalls';
import { formatDate } from '../../utils/format';

export function EcomerCitizenCallsPage() {
  const { calls, loading, getOpenCalls } = useCitizenCalls();
  const openCalls = getOpenCalls();

  const columns: Array<Column<any>> = [
    {
      key: 'id',
      header: 'Appel',
      render: (c) =>
        <div>
          <p className="font-semibold text-navy">{c.id}</p>
          <p className="text-[11px] text-slate-500">{c.perimeterId}</p>
        </div>
    },
    { key: 'title', header: 'Titre', render: (c) => c.title },
    { key: 'zone', header: 'Zone', render: (c) => c.zone },
    { key: 'date', header: 'Date', render: (c) => formatDate(c.plannedDate) },
    { key: 'time', header: 'Horaire', render: (c) => `${c.startTime} - ${c.endTime}` },
    {
      key: 'participants',
      header: 'Participants',
      render: (c) => `${c.currentParticipants}/${c.maxParticipants}`
    },
    { key: 'ecoPoints', header: 'EcoPoints', render: (c) => c.ecoPoints },
    {
      key: 'status',
      header: 'Statut',
      render: (c) => {
        const statusMap: Record<string, {label: string; tone: string}> = {
          ouvert: { label: 'Ouvert', tone: 'success' },
          en_cours: { label: 'En cours', tone: 'warning' },
          termine: { label: 'Terminé', tone: 'info' },
          annule: { label: 'Annulé', tone: 'danger' }
        };
        const meta = statusMap[c.status] || { label: c.status, tone: 'neutral' };
        return <StatusBadge label={meta.label} tone={meta.tone as any} />;
      }
    },
    {
      key: 'actions',
      header: '',
      render: (c) =>
        <Link
          to={`/ECOMER/citizen-calls/${c.id}`}
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
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader
            title="Appels ouverts"
            subtitle={`${openCalls.length} disponible(s)`}
            tone="dark"
          />
        </Card>
        <Card>
          <CardHeader
            title="Total participants"
            subtitle={`${calls.reduce((sum: number, c: any) => sum + c.currentParticipants, 0)} citoyens`}
            tone="dark"
          />
        </Card>
        <Card>
          <CardHeader
            title="EcoPoints distribués"
            subtitle={`${calls.reduce((sum: number, c: any) => sum + (c.status === 'termine' ? c.ecoPoints * c.currentParticipants : 0), 0)} points`}
            tone="dark"
          />
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Appels d'offres citoyens"
          subtitle="Mobilisation des citoyens pour les opérations de collecte"
          action={
            <Button variant="accent" icon={<PlusIcon className="h-4 w-4" />}>
              Nouvel appel
            </Button>
          } />

        <DataTable columns={columns} rows={calls} />
      </Card>
    </div>);
}
