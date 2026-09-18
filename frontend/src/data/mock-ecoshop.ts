import { WasteLot, EcoshopOrder } from '../types';

export const mockWasteLots: WasteLot[] = [
  {
    id: 'LOT-001',
    type: 'plastiques',
    quantityTons: 5.5,
    quality: 'A',
    pricePerTon: 250,
    description: 'Bouteilles PET transparentes triées et compressées. Moins de 2% d\'impuretés.',
    status: 'disponible',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    images: ['https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&q=80&w=600']
  },
  {
    id: 'LOT-002',
    type: 'plastiques',
    quantityTons: 2.0,
    quality: 'B',
    pricePerTon: 180,
    description: 'Mélange de plastiques PEHD (bouchons, flacons). Nécessite un tri fin.',
    status: 'disponible',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    images: ['https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=600']
  },
  {
    id: 'LOT-003',
    type: 'filets',
    quantityTons: 1.2,
    quality: 'A',
    pricePerTon: 300,
    description: 'Filets de pêche en nylon récupérés en mer. Excellente qualité pour upcycling.',
    status: 'reserve',
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    images: ['https://images.unsplash.com/photo-1583594898394-ee802877a5ea?auto=format&fit=crop&q=80&w=600']
  },
  {
    id: 'LOT-004',
    type: 'divers',
    quantityTons: 8.0,
    quality: 'C',
    pricePerTon: 50,
    description: 'Déchets divers (bois, métaux non triés). Idéal pour valorisation énergétique.',
    status: 'disponible',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    images: ['https://images.unsplash.com/photo-1605600659905-23c2a688b577?auto=format&fit=crop&q=80&w=600']
  }
];

export const mockEcoshopOrders: EcoshopOrder[] = [
  {
    id: 'ORD-001',
    lotId: 'LOT-003',
    recyclerId: 'REC-001',
    recyclerName: 'EcoPlast Congo',
    amount: 360, // 1.2 * 300
    status: 'acceptee',
    deliveryMethod: 'livraison_ecomer',
    paymentStatus: 'en_attente',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    notes: 'Livraison prévue à l\'entrepôt zone industrielle.'
  },
  {
    id: 'ORD-002',
    lotId: 'LOT-001',
    recyclerId: 'REC-002',
    recyclerName: 'Recycle Tout',
    amount: 1375, // 5.5 * 250
    status: 'en_attente',
    deliveryMethod: 'retrait_sur_place',
    paymentStatus: 'en_attente',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString()
  }
];
