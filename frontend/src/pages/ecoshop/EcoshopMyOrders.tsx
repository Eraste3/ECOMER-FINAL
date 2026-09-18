
import { PackageSearchIcon } from 'lucide-react';
import { useEcomer } from '../../contexts/EcomerContext';
import { StatusBadge } from '../../components/status/StatusBadge';
import { relativeTime } from '../../utils/format';

export function EcoshopMyOrders() {
  const { ecoshopOrders, currentUser } = useEcomer();

  // Dans un cas réel, on filtrerait par recyclerId === currentUser.id
  // Ici pour la démo, on montre toutes les commandes du mock ou on filtre par le currentUser s'il était un recycleur.
  const myOrders = ecoshopOrders.filter(o => o.recyclerId === currentUser.id || o.recyclerId === 'REC-001');

  return (
    <div className="space-y-4 sm:space-y-5">
      <section className="bg-navy px-4 py-5 sm:rounded-xl sm:px-5">
        <div>
          <h2 className="font-display text-xl font-bold text-white">Mes commandes</h2>
          <p className="mt-1 text-sm text-slate-400">Suivez le statut de vos commandes de lots de déchets.</p>
        </div>
      </section>

      <section className="px-4 sm:px-0">
        <div className="overflow-hidden rounded-xl bg-white ring-1 ring-hairline shadow-card">
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
                {myOrders.map((order) => (
                  <tr key={order.id} className="transition-colors hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-medium text-navy">{order.id}</td>
                    <td className="px-4 py-3">{order.lotId}</td>
                    <td className="px-4 py-3">{relativeTime(order.createdAt)}</td>
                    <td className="px-4 py-3">
                      {order.deliveryMethod === 'livraison_ecomer' ? 'Livraison' : 'Retrait sur place'}
                    </td>
                    <td className="px-4 py-3 font-medium text-ocean">{order.amount.toLocaleString()} €</td>
                    <td className="px-4 py-3">
                      <StatusBadge
                        label={order.status.replace('_', ' ')}
                        tone={
                          order.status === 'acceptee' || order.status === 'livree' ? 'success' :
                            order.status === 'en_attente' ? 'warning' : 'danger'
                        }
                      />
                    </td>
                  </tr>
                ))}
                {myOrders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center">
                      <PackageSearchIcon className="mx-auto h-8 w-8 text-slate-300" />
                      <p className="mt-2 text-sm text-slate-500">Aucune commande trouvée.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
