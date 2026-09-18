import { LandingHeader } from '../components/landing/LandingHeader';
import { LandingFooter } from '../components/landing/LandingFooter';
import { Link } from 'react-router-dom';
import { PackageIcon, ScaleIcon, TagIcon } from 'lucide-react';

export const products = [
  {
    id: 1,
    title: 'Filets de pêche récupérés',
    description: 'Filets de pêche en nylon prêts au recyclage.',
    price: '150 € / tonne',
    image: '/091ac480-3406-4ca0-af91-85559655c127.jpg',
    quantity: '5 tonnes',
  },
  {
    id: 2,
    title: 'Bouteilles PET compressées',
    description: 'Balles de bouteilles plastiques transparentes.',
    price: '300 € / tonne',
    image: '/1dac922e-b7fa-424f-923a-4df145e925c0.jpg',
    quantity: '12 tonnes',
  },
  {
    id: 3,
    title: 'Plastiques mixtes (PEHD/PP)',
    description: 'Plastiques rigides issus des collectes côtières.',
    price: '200 € / tonne',
    image: '/22252d32-67e3-40df-97c9-224d7a33ad02.jpg',
    quantity: '8 tonnes',
  },
  {
    id: 4,
    title: 'Débris métalliques',
    description: 'Ferraille et aluminium récupérés sur les plages.',
    price: '800 € / tonne',
    image: '/9f1a6b06-1f95-4f6a-9b40-01ed92d0dc39.jpg',
    quantity: '2 tonnes',
  },
  {
    id: 5,
    title: 'Verre concassé',
    description: 'Verre trié et prêt à être fondu.',
    price: '50 € / tonne',
    image: '/e7f04cde-0625-4fdc-82a9-bb006922db10.jpg',
    quantity: '20 tonnes',
  },
  {
    id: 6,
    title: 'Bouées et flotteurs usagés',
    description: 'Matériel de pêche en PVC/plastique.',
    price: '180 € / tonne',
    image: '/091ac480-3406-4ca0-af91-85559655c127.jpg',
    quantity: '3 tonnes',
  },
  {
    id: 7,
    title: 'Cordages marins',
    description: 'Cordes en polypropylène et nylon.',
    price: '250 € / tonne',
    image: '/1dac922e-b7fa-424f-923a-4df145e925c0.jpg',
    quantity: '4 tonnes',
  },
  {
    id: 8,
    title: 'Microplastiques filtrés',
    description: 'Résidus plastiques récupérés par filtration.',
    price: '400 € / tonne',
    image: '/22252d32-67e3-40df-97c9-224d7a33ad02.jpg',
    quantity: '1 tonne',
  },
];

export function EcoShopPage() {

  return (
    <div className="w-full  bg-navy min-h-screen flex flex-col">
      <LandingHeader />
      <main className="flex-1 pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-4">
              La Marketplace <span className="text-emerald-400">EcoShop</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Achetez des matières premières secondaires issues de la dépollution marine.
              Contribuez à l'économie circulaire tout en soutenant nos actions.
            </p>
          </div>

          <div className="px-4 sm:px-0">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
