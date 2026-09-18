import { Link } from 'react-router-dom';
import { PackageIcon, ScaleIcon, TagIcon } from 'lucide-react';
import { products } from '../EcoShopPage';

export function RecycleurMarketplace() {
  return (
    <div className="space-y-4 sm:space-y-5">
      <section className="bg-navy px-4 py-5 sm:rounded-xl sm:px-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-cyan-ecomer">
              Marketplace ECOSHOP
            </p>
            <h2 className="mt-1 font-display text-xl font-bold text-white">
              Lots de déchets recyclables disponibles
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Déchets triés et pesés par les équipes ECOMER sur le terrain.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-0">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/recycleur/marketplace/lot/${product.id}`}
              className="group flex flex-col overflow-hidden rounded-xl bg-white ring-1 ring-hairline shadow-card transition-shadow hover:shadow-lg"
            >
              <div className="relative aspect-video overflow-hidden bg-slate-100">
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute right-2 top-2 rounded-md bg-white/90 px-2 py-1 text-[10px] font-bold text-navy backdrop-blur-sm">
                  Qualité A
                </div>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-display text-sm font-bold text-navy">LOT-{product.id.toString().padStart(4, '0')}</p>
                    <p className="text-[12px] font-medium text-slate-600">
                      {product.title}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-lg font-bold text-ocean">
                      {product.price.split(' ')[0]} €
                      <span className="text-[10px] text-slate-500"> /t</span>
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1 rounded bg-surface px-2 py-1">
                    <ScaleIcon className="h-3.5 w-3.5" />
                    {product.quantity}
                  </span>
                  <span className="flex items-center gap-1 rounded bg-surface px-2 py-1">
                    <TagIcon className="h-3.5 w-3.5" />
                    Trié & Pesé
                  </span>
                </div>
              </div>
            </Link>
          ))}
          {products.length === 0 && (
            <div className="col-span-full py-12 text-center">
              <PackageIcon className="mx-auto h-12 w-12 text-slate-300" />
              <p className="mt-2 text-sm font-medium text-slate-500">
                Aucun lot disponible.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
