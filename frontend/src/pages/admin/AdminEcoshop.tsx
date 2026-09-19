import { useState, useRef, useEffect } from 'react';
import { PackageSearchIcon, PlusIcon, EditIcon, UploadCloudIcon, ImageIcon } from 'lucide-react';
import { useEcoshop } from '../../hooks/useEcoshop';
import { StatusBadge } from '../../components/status/StatusBadge';
import { Button } from '../../components/ui/Button';

export function AdminEcoshop() {
  const { getCommandes, getLots, createLot } = useEcoshop();
  const [ecoshopOrders, setEcoshopOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'commandes' | 'lots'>('commandes');
  const [localProducts, setLocalProducts] = useState<any[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    quantity: '',
    image: '/091ac480-3406-4ca0-af91-85559655c127.jpg'
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersData, lotsData] = await Promise.all([
          getCommandes(),
          getLots()
        ]);
        setEcoshopOrders(ordersData);
        setLocalProducts(lotsData);
      } catch (error) {
        console.error('Error fetching ecoshop data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [getCommandes, getLots]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-slate-500">Chargement...</p>
      </div>
    );
  }

  const updateOrderStatus = (orderId: string, status: string, paymentStatus?: string) => {
    setEcoshopOrders(prev => prev.map(o => 
      o.id === orderId ? { ...o, status, paymentStatus, updatedAt: new Date().toISOString() } : o
    ));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, image: imageUrl }));
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      title: '',
      description: '',
      price: '',
      quantity: '',
      image: '/091ac480-3406-4ca0-af91-85559655c127.jpg'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: any) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      image: product.image
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        // Update existing lot - this would need an API call
        setLocalProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...editingProduct, ...formData } : p));
      } else {
        // Create new lot using API
        const newLot = await createLot({
          categorie: formData.title,
          quantiteKg: parseFloat(formData.quantity) * 1000,
          qualite: 'trie',
          prixUnitaire: parseFloat(formData.price)
        });
        setLocalProducts(prev => [...prev, newLot]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving lot:', error);
      alert('Erreur lors de la sauvegarde du lot');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-lg font-bold text-navy">Gestion ECOSHOP</h2>
          <p className="text-sm text-slate-500">Supervisez la marketplace B2B de déchets recyclables.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg bg-surface p-1 ring-1 ring-inset ring-hairline">
            <button
              onClick={() => setActiveTab('commandes')}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${activeTab === 'commandes' ? 'bg-white text-navy shadow-sm ring-1 ring-hairline' : 'text-slate-500 hover:text-navy'
                }`}
            >
              Commandes ({ecoshopOrders.length})
            </button>
            <button
              onClick={() => setActiveTab('lots')}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${activeTab === 'lots' ? 'bg-white text-navy shadow-sm ring-1 ring-hairline' : 'text-slate-500 hover:text-navy'
                }`}
            >
              Lots publiés ({localProducts.length})
            </button>
          </div>
          <Button icon={<PlusIcon className="h-4 w-4" />} onClick={openAddModal}>Nouveau lot</Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl bg-white ring-1 ring-hairline shadow-card">
        {activeTab === 'commandes' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="border-b border-hairline bg-surface text-xs font-semibold text-navy">
                <tr>
                  <th className="px-4 py-3">N° Commande</th>
                  <th className="px-4 py-3">Client (Recycleur)</th>
                  <th className="px-4 py-3">Lot concerné</th>
                  <th className="px-4 py-3">Montant</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline bg-white">
                {ecoshopOrders.map((order) => (
                  <tr key={order.id} className="transition-colors hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-medium text-navy">{order.id}</td>
                    <td className="px-4 py-3">{order.recyclerName}</td>
                    <td className="px-4 py-3">{order.lotId}</td>
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
                    <td className="px-4 py-3 text-right">
                      {order.status === 'en_attente' && (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => updateOrderStatus(order.id, 'acceptee')}
                            className="rounded-md bg-ocean/10 px-2 py-1 text-[11px] font-semibold text-ocean hover:bg-ocean/20"
                          >
                            Accepter
                          </button>
                          <button
                            onClick={() => updateOrderStatus(order.id, 'refusee')}
                            className="rounded-md bg-red-50 px-2 py-1 text-[11px] font-semibold text-red-600 hover:bg-red-100"
                          >
                            Refuser
                          </button>
                        </div>
                      )}
                      {order.status === 'acceptee' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'livree', 'facture_emise')}
                          className="rounded-md bg-green-50 px-2 py-1 text-[11px] font-semibold text-green-600 hover:bg-green-100"
                        >
                          Marquer Livrée
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {ecoshopOrders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center">
                      <PackageSearchIcon className="mx-auto h-8 w-8 text-slate-300" />
                      <p className="mt-2 text-sm text-slate-500">Aucune commande pour le moment.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="border-b border-hairline bg-surface text-xs font-semibold text-navy">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Image</th>
                  <th className="px-4 py-3">Titre</th>
                  <th className="px-4 py-3">Quantité</th>
                  <th className="px-4 py-3">Prix</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline bg-white">
                {localProducts.map((product) => (
                  <tr key={product.id} className="transition-colors hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-medium text-navy">LOT-{product.id.toString().padStart(4, '0')}</td>
                    <td className="px-4 py-3">
                      <img src={product.image} alt="preview" className="h-10 w-10 rounded object-cover" />
                    </td>
                    <td className="px-4 py-3 font-medium text-navy">{product.title}</td>
                    <td className="px-4 py-3">{product.quantity}</td>
                    <td className="px-4 py-3 text-ocean font-semibold">{product.price}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => openEditModal(product)}
                        className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-200 inline-flex items-center gap-1"
                      >
                        <EditIcon className="h-3 w-3" />
                        Modifier
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/80 backdrop-blur-md p-4 transition-all duration-300">
          <div className="bg-white rounded-3xl w-full max-w-4xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-2xl font-display font-bold text-navy">
                {editingProduct ? 'Modifier le lot existant' : 'Créer un nouveau lot de déchets'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-navy hover:bg-slate-100 rounded-full transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="overflow-y-auto p-8">
              <form id="lot-form" className="grid grid-cols-1 md:grid-cols-2 gap-10" onSubmit={handleSave}>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-2">Titre du lot</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ex: Filets de pêche récupérés"
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-ocean/50 focus:border-ocean transition-all shadow-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-2">Description détaillée</label>
                    <textarea 
                      required
                      rows={4}
                      placeholder="Ex: Filets de pêche en nylon prêts au recyclage..."
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-ocean/50 focus:border-ocean transition-all shadow-sm resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-navy mb-2">Prix unitaire</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Ex: 150 € / tonne"
                        value={formData.price}
                        onChange={e => setFormData({...formData, price: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-ocean/50 focus:border-ocean transition-all shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-navy mb-2">Quantité totale</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Ex: 5 tonnes"
                        value={formData.quantity}
                        onChange={e => setFormData({...formData, quantity: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-ocean/50 focus:border-ocean transition-all shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col h-full">
                  <label className="block text-sm font-semibold text-navy mb-2">Image d'illustration</label>
                  <div 
                    className="flex-1 min-h-[250px] relative border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors group overflow-hidden flex flex-col items-center justify-center cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {formData.image ? (
                      <>
                        <img 
                          src={formData.image} 
                          alt="Prévisualisation" 
                          className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" 
                        />
                        <div className="absolute inset-0 bg-navy/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white font-medium flex items-center gap-2 bg-navy/80 px-4 py-2 rounded-lg">
                            <UploadCloudIcon className="h-5 w-5" />
                            Changer l'image
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-6">
                        <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-ocean transition-colors">
                          <ImageIcon className="h-8 w-8" />
                        </div>
                        <p className="text-sm font-semibold text-slate-600 mb-1">Cliquez pour ajouter une image</p>
                        <p className="text-xs text-slate-400">JPG, PNG, WebP (Max 5MB)</p>
                      </div>
                    )}
                    <input 
                      type="file" 
                      accept="image/*"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </div>
                </div>
              </form>
            </div>
            
            <div className="border-t border-slate-100 bg-slate-50/50 px-8 py-5 flex justify-end gap-3 rounded-b-3xl">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" form="lot-form" variant="primary" icon={<PlusIcon className="h-4 w-4" />}>
                {editingProduct ? 'Enregistrer les modifications' : 'Publier le lot sur la marketplace'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
