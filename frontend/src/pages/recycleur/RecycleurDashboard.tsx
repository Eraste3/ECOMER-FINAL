import { Link } from 'react-router-dom';
import {
  ArrowRightIcon,
  CheckCircle2Icon,
  EuroIcon,
  MapIcon,
  PackageIcon,
  ShoppingCartIcon,
  TruckIcon,
} from 'lucide-react';
import { KpiCard } from '../../components/cards/KpiCard';
import { Card, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { MapView } from '../../components/maps/MapView';
import { MapLegend } from '../../components/maps/MapLegend';
import { StatusBadge } from '../../components/status/StatusBadge';
import { useEcomer } from '../../contexts/EcomerContext';
import { relativeTime } from '../../utils/format';
import { wasteMeta } from '../../utils/labels';

export function RecycleurDashboard() {
  const { ecoshopOrders, wasteLots, perimeters } = useEcomer();

  const availableLots = wasteLots.filter((l) => l.status === 'disponible');
  const myOrders = ecoshopOrders; // In a real app, filter by current user
  const pendingOrders = myOrders.filter((o) => o.status === 'en_attente');
  const acceptedOrders = myOrders.filter((o) => o.status === 'acceptee');
  const totalSpent = myOrders
    .filter((o) => o.status === 'livree')
    .reduce((acc, o) => acc + o.amount, 0);
  const totalTons = wasteLots
    .filter((l) => l.status === 'vendu')
    .reduce((acc, l) => acc + l.quantityTons, 0);

  return (
    <div className="space-y-5">
      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Lots disponibles"
          value={availableLots.length}
          icon={<PackageIcon className="h-4 w-4" />}
          accent="#1273b8"
          trend={{ value: availableLots.length, label: 'à acheter' }}
          index={0}
        />
        <KpiCard
          label="Commandes en cours"
          value={pendingOrders.length + acceptedOrders.length}
          icon={<ShoppingCartIcon className="h-4 w-4" />}
          accent="#f97316"
          trend={{ value: pendingOrders.length, label: 'en attente validation' }}
          index={1}
        />
        <KpiCard
          label="Tonnes achetées"
          value={totalTons}
          suffix="t"
          icon={<TruckIcon className="h-4 w-4" />}
          accent="#14b8a6"
          index={2}
        />
        <KpiCard
          label="Volume d'achat"
          value={totalSpent}
          suffix="€"
          icon={<EuroIcon className="h-4 w-4" />}
          accent="#10b981"
          trend={{ value: 0, label: 'transactions livrées' }}
          index={3}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        {/* Carte de traçabilité */}
        <Card>
          <CardHeader
            title="Carte des zones de collecte"
            subtitle="Traçabilité des origines des déchets disponibles"
            action={
              <Link to="/recycleur/carte">
                <Button variant="secondary" size="sm" icon={<MapIcon className="h-3.5 w-3.5" />}>
                  Voir la carte
                </Button>
              </Link>
            }
          />
          <div className="relative aspect-[16/10]">
            <MapView perimeters={perimeters} showHeatmap tone="dark" />
            <MapLegend tone="dark" className="absolute bottom-3 left-3" extras={false} />
          </div>
        </Card>

        <div className="space-y-4">
          {/* Lots disponibles */}
          <Card>
            <CardHeader
              title="Lots disponibles à l'achat"
              subtitle={`${availableLots.length} lot(s) en stock`}
              action={
                <Link to="/recycleur/marketplace" className="inline-flex items-center gap-1 text-[11px] font-semibold text-ocean hover:underline">
                  Tout voir <ArrowRightIcon className="h-3 w-3" />
                </Link>
              }
            />
            <ul className="divide-y divide-hairline">
              {availableLots.slice(0, 4).map((lot) => (
                <li key={lot.id}>
                  <Link
                    to={`/recycleur/marketplace/lot/${lot.id}`}
                    className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-slate-50"
                  >
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold"
                      style={{
                        backgroundColor: `${wasteMeta[lot.type].color}1f`,
                        color: wasteMeta[lot.type].color,
                      }}
                    >
                      {wasteMeta[lot.type].short.slice(0, 3).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-semibold text-navy">
                        {lot.id} · {lot.quantityTons} t
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {wasteMeta[lot.type].label} · Qualité {lot.quality}
                      </p>
                    </div>
                    <span className="shrink-0 font-display text-sm font-bold text-ocean">
                      {lot.pricePerTon} €/t
                    </span>
                  </Link>
                </li>
              ))}
              {availableLots.length === 0 && (
                <li className="px-5 py-6 text-center text-sm text-slate-400">
                  Aucun lot disponible pour le moment.
                </li>
              )}
            </ul>
          </Card>

          {/* Dernières commandes */}
          <Card>
            <CardHeader
              title="Mes dernières commandes"
              subtitle={`${myOrders.length} commande(s) au total`}
              action={
                <Link to="/recycleur/commandes">
                  <Button variant="accent" size="sm">
                    Tout voir
                  </Button>
                </Link>
              }
            />
            <ul className="divide-y divide-hairline">
              {myOrders.slice(0, 3).map((order) => (
                <li key={order.id} className="flex items-center gap-3 px-5 py-3.5">
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold text-navy">
                      {order.id} · Lot {order.lotId}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {order.amount.toLocaleString()} € · {relativeTime(order.createdAt)}
                    </p>
                  </div>
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
                </li>
              ))}
              {myOrders.length === 0 && (
                <li className="px-5 py-6 text-center text-sm text-slate-400">
                  Aucune commande passée.
                </li>
              )}
            </ul>
          </Card>
        </div>
      </div>

      {/* Historique des lots achetés */}
      <Card>
        <CardHeader
          title="Historique des achats finalisés"
          subtitle={`${wasteLots.filter((l) => l.status === 'vendu').length} lot(s) livré(s)`}
        />
        <ul className="divide-y divide-hairline">
          {wasteLots
            .filter((l) => l.status === 'vendu')
            .map((lot) => (
              <li key={lot.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-navy">
                    {lot.id} · {lot.type}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {lot.quantityTons} t · Qualité {lot.quality}
                  </p>
                </div>
                <StatusBadge label="Livré" tone="success" />
              </li>
            ))}
          {wasteLots.filter((l) => l.status === 'vendu').length === 0 && (
            <li className="px-5 py-8 text-center">
              <CheckCircle2Icon className="mx-auto h-8 w-8 text-slate-300" />
              <p className="mt-2 text-sm text-slate-500">Aucun achat finalisé pour le moment.</p>
            </li>
          )}
        </ul>
      </Card>
    </div>
  );
}
