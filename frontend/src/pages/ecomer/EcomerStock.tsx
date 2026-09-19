import { Link } from 'react-router-dom';
import { ArrowRightIcon, PlusIcon } from 'lucide-react';
import { Card, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/status/StatusBadge';
import { DataTable, type Column } from '../../components/tables/DataTable';
import { useStockage } from '../../hooks/useStockage';
import { formatDate } from '../../utils/format';

export function EcomerStockPage() {
  const { entries, loading } = useStockage();

  const columns: Array<Column<any>> = [
    {
      key: 'id',
      header: 'Entrée',
      render: (e) =>
        <div>
          <p className="font-semibold text-navy">{e.id}</p>
          <p className="text-[11px] text-slate-500">{e.collecteOperationId}</p>
        </div>
    },
    { key: 'wasteType', header: 'Type de déchets', render: (e) => e.wasteType },
    { key: 'quantity', header: 'Quantité', render: (e) => `${e.quantityTons.toFixed(1)} t` },
    { key: 'quality', header: 'Qualité', render: (e) => e.quality },
    { key: 'location', header: 'Emplacement', render: (e) => e.location },
    {
      key: 'storageDate',
      header: 'Date stockage',
      render: (e) => formatDate(e.storageDate)
    },
    {
      key: 'actions',
      header: '',
      render: (e) =>
        <Link
          to={`/ECOMER/stock/${e.id}`}
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

  const totalTons = entries.reduce((sum: number, e: any) => sum + e.quantityTons, 0);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader
            title="Stock total"
            subtitle={`${totalTons.toFixed(1)} tonnes`}
            tone="dark"
          />
        </Card>
        <Card>
          <CardHeader
            title="Entrées ce mois"
            subtitle={`${entries.length} opérations`}
            tone="dark"
          />
        </Card>
        <Card>
          <CardHeader
            title="Emplacements"
            subtitle="Entrepôt Pointe-Noire"
            tone="dark"
          />
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Entrées de stock"
          subtitle="Déchets triés et stockés"
          action={
            <Button variant="accent" icon={<PlusIcon className="h-4 w-4" />}>
              Nouvelle entrée
            </Button>
          } />

        <DataTable columns={columns} rows={entries} />
      </Card>
    </div>);
}
