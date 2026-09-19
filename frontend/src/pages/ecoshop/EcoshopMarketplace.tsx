import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FilterIcon, PackageIcon, TagIcon, ScaleIcon } from 'lucide-react';
import { useEcoshop } from '../../hooks/useEcoshop';
import { wasteMeta } from '../../utils/labels';
import type { WasteType } from '../../types';

export function EcoshopMarketplace() {
  const { getLots } = useEcoshop();
  const [wasteLots, setWasteLots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<WasteType | 'tous'>('tous');

  useEffect(() => {
    const fetchLots = async () => {
      try {
        const data = await getLots();
        setWasteLots(data);
      } catch (error) {
        console.error('Error fetching waste lots:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLots();
  }, [getLots]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-slate-500">Chargement des lots...</p>
      </div>
    );
  }

  const availableLots = wasteLots.filter(l => l.status === 'disponible');
  const filteredLots = filter === 'tous' ? availableLots : availableLots.filter(l => l.type === filter);

  return (
    <div className="space-y-4 sm:space-y-5">
      <section className="bg-navy px-4 py-5 sm:rounded-xl sm:px-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-cyan-ecomer">
              Marketplace
            </p>
            <h2 className="mt-1 font-display text-xl font-bold text-white">
              Lots de déchets recyclables disponibles
            </h2>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-0">
        <div className="mb-4 flex items-center gap-2 overflow-x-auto pb-2">
          <div className="flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-[11px] font-semibold text-slate-500 ring-1 ring-inset ring-hairline">
            <FilterIcon className="h-3.5 w-3.5" />
            Filtres
          </div>
          <button
            onClick={() => setFilter('tous')}
            className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors ${filter === 'tous'
                ? 'bg-ocean text-white'
                : 'bg-white text-slate-500 ring-1 ring-inset ring-hairline hover:bg-surface'
              }`}
          >
            Tous
          </button>
          {(['plastiques', 'filets', 'divers'] as WasteType[]).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors ${filter === type
                  ? 'bg-ocean text-white'
                  : 'bg-white text-slate-500 ring-1 ring-inset ring-hairline hover:bg-surface'
                }`}
            >
              {wasteMeta[type].label}
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredLots.map((lot) => (
            <Link
              key={lot.id}
              to={`/ecoshop/lot/${lot.id}`}
              className="group flex flex-col overflow-hidden rounded-xl bg-white ring-1 ring-hairline shadow-card transition-shadow hover:shadow-lg"
            >
              <div className="relative aspect-video overflow-hidden bg-slate-100">
                <img
                  src={lot.images[0]}
                  alt={lot.description}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute right-2 top-2 rounded-md bg-white/90 px-2 py-1 text-[10px] font-bold text-navy backdrop-blur-sm">
                  Qualité {lot.quality}
                </div>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-display text-sm font-bold text-navy">{lot.id}</p>
                    <p className="text-[12px] font-medium" style={{ color: wasteMeta[lot.type as keyof typeof wasteMeta]?.color || '#3b82f6' }}>
                      {wasteMeta[lot.type as keyof typeof wasteMeta]?.label || lot.type}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-lg font-bold text-ocean">{lot.pricePerTon} €<span className="text-[10px] text-slate-500"> /t</span></p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1 rounded bg-surface px-2 py-1">
                    <ScaleIcon className="h-3.5 w-3.5" />
                    {lot.quantityTons} Tonnes
                  </span>
                  <span className="flex items-center gap-1 rounded bg-surface px-2 py-1">
                    <TagIcon className="h-3.5 w-3.5" />
                    Lot Trié
                  </span>
                </div>
              </div>
            </Link>
          ))}
          {filteredLots.length === 0 && (
            <div className="col-span-full py-12 text-center">
              <PackageIcon className="mx-auto h-12 w-12 text-slate-300" />
              <p className="mt-2 text-sm font-medium text-slate-500">Aucun lot disponible pour le moment.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
