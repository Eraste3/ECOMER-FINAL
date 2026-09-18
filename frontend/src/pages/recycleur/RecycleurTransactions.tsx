import { toast } from 'sonner';
import { FileSpreadsheetIcon, FileTextIcon, PackageSearchIcon, TruckIcon } from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { KpiCard } from '../../components/cards/KpiCard';
import { ChartCard } from '../../components/charts/ChartCard';
import { DonutChart } from '../../components/charts/DonutChart';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader } from '../../components/ui/Card';
import { StatusBadge } from '../../components/status/StatusBadge';
import { useEcomer } from '../../contexts/EcomerContext';
import { relativeTime } from '../../utils/format';
import { wasteMeta } from '../../utils/labels';
import { chartTooltipStyle } from '../../components/charts/chartTheme';

// Données simulées : évolution mensuelle des commandes par statut
const orderTrendData = [
  { mois: 'Avr', en_attente: 0, acceptees: 0, livrees: 0 },
  { mois: 'Mai', en_attente: 1, acceptees: 0, livrees: 0 },
  { mois: 'Jun', en_attente: 2, acceptees: 1, livrees: 0 },
  { mois: 'Jul', en_attente: 1, acceptees: 2, livrees: 1 },
  { mois: 'Aoû', en_attente: 3, acceptees: 1, livrees: 2 },
  { mois: 'Sep', en_attente: 2, acceptees: 2, livrees: 1 },
];

export function RecycleurTransactionsPage() {
  const { ecoshopOrders, wasteLots } = useEcomer();

  const totalSpent = ecoshopOrders.reduce((s, o) => s + o.amount, 0);
  const delivered = ecoshopOrders.filter((o) => o.status === 'livree');
  const totalTons = wasteLots
    .filter((l) => l.status === 'vendu')
    .reduce((acc, l) => acc + l.quantityTons, 0);
  const pending = ecoshopOrders.filter((o) => o.status === 'en_attente');

  // Distribution des types de déchets achetés
  const typeDistribution = ['plastiques', 'filets', 'divers', 'menagers'].map((type) => {
    const lots = wasteLots.filter((l) => l.type === type);
    const tons = lots.reduce((s, l) => s + l.quantityTons, 0);
    return {
      label: wasteMeta[type as keyof typeof wasteMeta].label,
      value: Number(tons.toFixed(1)),
      color: wasteMeta[type as keyof typeof wasteMeta].color,
    };
  }).filter((d) => d.value > 0);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-bold text-navy">Rapports de transactions</h2>
          <p className="text-xs text-slate-500">
            EcoPlast Congo — historique de vos achats ECOSHOP
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            icon={<FileTextIcon className="h-4 w-4" />}
            onClick={() =>
              toast.success('Export PDF généré', { description: 'rapport-transactions.pdf' })
            }
          >
            Exporter PDF
          </Button>
          <Button
            variant="secondary"
            icon={<FileSpreadsheetIcon className="h-4 w-4" />}
            onClick={() =>
              toast.success('Export XLSX généré', { description: 'rapport-transactions.xlsx' })
            }
          >
            Exporter XLSX
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Total des achats"
          value={totalSpent}
          suffix="€"
          icon={<FileTextIcon className="h-4 w-4" />}
          accent="#1273b8"
          index={0}
        />
        <KpiCard
          label="Tonnes acquises"
          value={totalTons}
          suffix="t"
          icon={<TruckIcon className="h-4 w-4" />}
          accent="#14b8a6"
          index={1}
        />
        <KpiCard
          label="Commandes livrées"
          value={delivered.length}
          icon={<FileSpreadsheetIcon className="h-4 w-4" />}
          accent="#10b981"
          index={2}
        />
        <KpiCard
          label="En attente validation"
          value={pending.length}
          icon={<PackageSearchIcon className="h-4 w-4" />}
          accent="#f97316"
          index={3}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <ChartCard title="Répartition par type de déchet" subtitle="Volume total par catégorie (tonnes)">
          {typeDistribution.length > 0 ? (
            <DonutChart
              data={typeDistribution}
              centerLabel="Tonnes"
            />
          ) : (
            <div className="flex h-48 items-center justify-center text-sm text-slate-400">
              Aucune donnée disponible
            </div>
          )}
        </ChartCard>

        <ChartCard title="Évolution des commandes par statut" subtitle="Tendance mensuelle sur 6 mois">
          <div style={{ height: 280 }} className="w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={orderTrendData} margin={{ top: 6, right: 12, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradAttente" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="gradAcceptees" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1273b8" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#1273b8" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="gradLivrees" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="mois"
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                  width={30}
                />
                <Tooltip {...chartTooltipStyle('light')} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 11, paddingTop: 12 }}
                />
                <Area
                  type="monotone"
                  dataKey="en_attente"
                  name="En attente"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  fill="url(#gradAttente)"
                  dot={{ r: 3, fill: '#f59e0b' }}
                />
                <Area
                  type="monotone"
                  dataKey="acceptees"
                  name="Acceptées"
                  stroke="#1273b8"
                  strokeWidth={2.5}
                  fill="url(#gradAcceptees)"
                  dot={{ r: 3, fill: '#1273b8' }}
                />
                <Area
                  type="monotone"
                  dataKey="livrees"
                  name="Livrées"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fill="url(#gradLivrees)"
                  dot={{ r: 3, fill: '#10b981' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Tableau détaillé */}
      <Card>
        <CardHeader
          title="Détail de toutes les transactions"
          subtitle="Historique complet de vos commandes"
        />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="border-b border-hairline bg-surface text-xs font-semibold text-navy">
              <tr>
                <th className="px-4 py-3">N° Commande</th>
                <th className="px-4 py-3">Lot</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Livraison</th>
                <th className="px-4 py-3">Montant</th>
                <th className="px-4 py-3">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline bg-white">
              {ecoshopOrders.map((order) => (
                <tr key={order.id} className="transition-colors hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-medium text-navy">{order.id}</td>
                  <td className="px-4 py-3">{order.lotId}</td>
                  <td className="px-4 py-3 text-[11px]">{relativeTime(order.createdAt)}</td>
                  <td className="px-4 py-3">
                    {order.deliveryMethod === 'livraison_ecomer'
                      ? 'Livraison ECOMER'
                      : 'Retrait sur place'}
                  </td>
                  <td className="px-4 py-3 font-medium text-ocean">
                    {order.amount.toLocaleString()} €
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      label={order.status.replace('_', ' ')}
                      tone={
                        order.status === 'acceptee' || order.status === 'livree'
                          ? 'success'
                          : order.status === 'en_attente'
                            ? 'warning'
                            : 'danger'
                      }
                    />
                  </td>
                </tr>
              ))}
              {ecoshopOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <PackageSearchIcon className="mx-auto h-8 w-8 text-slate-300" />
                    <p className="mt-2 text-sm text-slate-500">Aucune transaction.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
