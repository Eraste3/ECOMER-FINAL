import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, CheckCircle2Icon, TruckIcon, StoreIcon, ScaleIcon } from 'lucide-react';
import { useEcomer } from '../../contexts/EcomerContext';
import { Button } from '../../components/ui/Button';
import type { DeliveryMethod } from '../../types';
import { products } from '../EcoShopPage';

export function RecycleurLotDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { placeOrder } = useEcomer();
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('livraison_ecomer');

  const lot = products.find((l) => l.id.toString() === id);

  if (!lot) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500">Lot introuvable</p>
        <Button className="mt-4" onClick={() => navigate('/recycleur/marketplace')}>
          Retour à la marketplace
        </Button>
      </div>
    );
  }

  const handleOrder = () => {
    placeOrder(`LOT-${lot.id.toString().padStart(4, '0')}`, deliveryMethod, 'Achat direct depuis la marketplace ECOSHOP.');
    navigate('/recycleur/commandes');
  };

  const quantityNum = parseInt(lot.quantity) || 0;
  const priceNum = parseInt(lot.price) || 0;
  const totalPrice = quantityNum * priceNum;

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 pb-12 sm:px-0">
      <button
        onClick={() => navigate('/recycleur/marketplace')}
        className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-navy"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Retour à la marketplace
      </button>

      <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-hairline shadow-card">
        <div className="aspect-video w-full bg-slate-100 sm:aspect-[21/9]">
          <img src={lot.image} alt={lot.title} className="h-full w-full object-cover" />
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-display text-2xl font-bold text-navy">LOT-{lot.id.toString().padStart(4, '0')}</h1>
                <span className="rounded-md bg-surface px-2.5 py-1 text-xs font-bold text-navy ring-1 ring-inset ring-hairline">
                  Qualité A
                </span>
              </div>
              <p className="mt-1 flex items-center gap-2 text-sm font-medium text-slate-600">
                {lot.title}
              </p>
            </div>
            <div className="text-right">
              <p className="font-display text-3xl font-bold text-ocean">
                {totalPrice.toLocaleString()} €
              </p>
              <p className="text-sm text-slate-500">{priceNum} € / tonne</p>
            </div>
          </div>

          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            <div>
              <h3 className="font-display text-sm font-semibold text-navy">Description du lot</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{lot.description}</p>

              <ul className="mt-6 space-y-3">
                <li className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface text-ocean">
                    <ScaleIcon className="h-4 w-4" />
                  </div>
                  Quantité totale :{' '}
                  <strong className="text-navy">{lot.quantity}</strong>
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface text-ocean">
                    <CheckCircle2Icon className="h-4 w-4" />
                  </div>
                  Tri & pesée effectués par les équipes ECOMER
                </li>
              </ul>
            </div>

            <div className="rounded-xl bg-surface p-6 ring-1 ring-inset ring-hairline">
              <h3 className="font-display text-sm font-semibold text-navy">Passer commande</h3>
              <p className="mt-1 text-[11px] text-slate-500">
                Le paiement se fera par facturation hors ligne après validation.
              </p>

              <div className="mt-6 space-y-4">
                <label className="block text-sm font-medium text-navy">Mode de livraison</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setDeliveryMethod('livraison_ecomer')}
                    className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 p-4 text-sm transition-colors ${deliveryMethod === 'livraison_ecomer' ? 'border-ocean bg-ocean/5 text-ocean font-bold' : 'border-hairline bg-white text-slate-500 hover:bg-slate-50'}`}
                  >
                    <TruckIcon className="h-6 w-6" />
                    Livraison ECOMER
                  </button>
                  <button
                    onClick={() => setDeliveryMethod('retrait_sur_place')}
                    className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 p-4 text-sm transition-colors ${deliveryMethod === 'retrait_sur_place' ? 'border-ocean bg-ocean/5 text-ocean font-bold' : 'border-hairline bg-white text-slate-500 hover:bg-slate-50'}`}
                  >
                    <StoreIcon className="h-6 w-6" />
                    Retrait sur place
                  </button>
                </div>
              </div>

              <div className="mt-8">
                <Button block onClick={handleOrder}>
                  Commander ce lot
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
