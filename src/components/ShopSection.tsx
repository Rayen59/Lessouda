import React, { useState } from 'react';
import {
  ShoppingBag,
  MessageCircle,
  Plus,
  Truck,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BackButton } from './BackButton';
import {
  CLUB_NAME,
  CLUB_SHORT,
  CLUB_LOGO,
  CLUB_WHATSAPP_NUMBER
} from '../data/constants';
import { ShopProduct } from '../types';

export const ShopSection: React.FC = () => {
  const { shopProducts, currentUser, isAdmin, navigateTo } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeProduct, setActiveProduct] = useState<ShopProduct | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('L');
  const [quantity, setQuantity] = useState<number>(1);

  const filteredProducts = shopProducts.filter((p) => {
    if (selectedCategory === 'all') return true;
    return p.category === selectedCategory;
  });

  const handleOpenProduct = (product: ShopProduct) => {
    setActiveProduct(product);
    setSelectedSize(product.sizes[0] || 'L');
    setQuantity(1);
  };

  const handleOrderViaWhatsApp = (product: ShopProduct) => {
    const userName = currentUser?.fullName || 'Supporter LSSB';
    const userPhone = currentUser?.phone || '';
    const totalPrice = product.price * quantity;

    const message = [
      `Bonjour Lessouda Sportive (LSSB),`,
      `Je souhaite commander le produit officiel suivant :`,
      `• Article : ${product.name}`,
      `• Taille sélectionnée : ${selectedSize}`,
      `• Quantité : ${quantity}`,
      `• Prix unitaire : ${product.price} DT`,
      `• Total : ${totalPrice} DT`,
      ``,
      `Mes coordonnées :`,
      `• Nom : ${userName}`,
      userPhone ? `• Téléphone : ${userPhone}` : ``,
      `Merci de me confirmer la commande et la livraison.`
    ]
      .filter(Boolean)
      .join('\n');

    const whatsappUrl = `https://wa.me/216${CLUB_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Top Header with BackButton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
          <div className="flex items-center gap-4">
            <BackButton label="Retour" />
            <div>
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-white" />
                <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-white font-heading">
                  Boutique Officielle · Place de Marketing LSSB
                </h1>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Vente officielle des maillots et équipements sportifs du club
              </p>
            </div>
          </div>

          {isAdmin && (
            <button
              onClick={() => navigateTo('admin')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-zinc-200 text-zinc-950 font-black rounded-xl text-xs uppercase tracking-wider transition-colors shadow shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Gérer les articles (Admin)</span>
            </button>
          )}
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 py-4 overflow-x-auto border-b border-zinc-900 text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-white text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Tous les articles ({shopProducts.length})
          </button>
          <button
            onClick={() => setSelectedCategory('maillot')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap ${
              selectedCategory === 'maillot'
                ? 'bg-white text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Maillots de match
          </button>
          <button
            onClick={() => setSelectedCategory('survetement')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap ${
              selectedCategory === 'survetement'
                ? 'bg-white text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Survêtements & Vestes
          </button>
          <button
            onClick={() => setSelectedCategory('accessoire')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap ${
              selectedCategory === 'accessoire'
                ? 'bg-white text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Accessoires & Écharpes
          </button>
        </div>

        {/* Empty State / 100% Vierge */}
        {filteredProducts.length === 0 ? (
          <div className="py-24 text-center bg-zinc-950 border border-zinc-800/80 rounded-3xl p-8 my-8 max-w-2xl mx-auto shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8 text-zinc-500" />
            </div>
            <h3 className="text-xl font-black uppercase text-white font-heading tracking-wider mb-2">
              Boutique officielle vierge
            </h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed mb-6">
              {isAdmin
                ? "Aucun article n'est actuellement en vente. En tant qu'administrateur, vous pouvez publier les maillots de l'équipe et les équipements avec photos, tailles et tarifs."
                : "Les maillots et produits officiels de Lessouda Sportive seront prochainement mis en vente en ligne par la direction."}
            </p>

            {isAdmin && (
              <button
                onClick={() => navigateTo('admin')}
                className="px-6 py-3 bg-white hover:bg-zinc-200 text-zinc-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-colors inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Publier un premier maillot</span>
              </button>
            )}
          </div>
        ) : (
          /* Products Grid if admin has added products */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="bg-zinc-950 border border-zinc-800/80 hover:border-zinc-700 rounded-3xl overflow-hidden flex flex-col group transition-all duration-300 shadow-md"
              >
                <div
                  onClick={() => handleOpenProduct(product)}
                  className="relative aspect-square bg-zinc-900 cursor-pointer overflow-hidden"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

                  {product.badge && (
                    <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md border border-zinc-700 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      {product.badge}
                    </div>
                  )}

                  <div className="absolute bottom-3 right-3 bg-white text-zinc-950 font-black text-sm px-2.5 py-1 rounded-lg shadow-lg">
                    {product.price} DT
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3
                      onClick={() => handleOpenProduct(product)}
                      className="font-bold text-white text-base font-heading line-clamp-1 cursor-pointer group-hover:text-zinc-200 transition-colors"
                    >
                      {product.name}
                    </h3>
                    <p className="text-xs text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
                      {product.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {product.sizes.map((s) => (
                        <span
                          key={s}
                          className="text-[10px] font-mono px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-zinc-900 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleOpenProduct(product)}
                      className="text-xs text-zinc-400 hover:text-white font-medium"
                    >
                      Détails
                    </button>

                    <button
                      onClick={() => handleOpenProduct(product)}
                      className="px-3.5 py-1.5 bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center gap-1.5 shadow"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Commander</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Order Modal via WhatsApp */}
      {activeProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl my-8 bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl p-6 sm:p-8 text-zinc-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-5">
              <button
                onClick={() => setActiveProduct(null)}
                className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white"
              >
                ← Continuer les achats
              </button>
              <span className="text-xs font-mono text-zinc-400">
                Boutique Officielle LSSB
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-900">
                <img
                  src={activeProduct.images[0]}
                  alt={activeProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4 flex flex-col justify-between">
                <div>
                  <span className="text-xs uppercase font-bold text-zinc-400 tracking-wider">
                    {activeProduct.category}
                  </span>
                  <h2 className="text-2xl font-black uppercase text-white font-heading mt-0.5">
                    {activeProduct.name}
                  </h2>

                  <div className="flex items-baseline gap-2 my-2">
                    <span className="text-3xl font-black text-white font-heading">
                      {activeProduct.price} DT
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {activeProduct.description}
                  </p>
                </div>

                {/* Size Selector */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                    Taille :
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {activeProduct.sizes.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSelectedSize(s)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          selectedSize === s
                            ? 'bg-white text-zinc-950 shadow-md ring-2 ring-white'
                            : 'bg-zinc-900 text-zinc-300 border border-zinc-800'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                    Quantité :
                  </label>
                  <div className="inline-flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-1">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-2.5 py-1 text-sm font-bold text-zinc-300 hover:text-white"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 text-xs font-bold font-mono text-white">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-2.5 py-1 text-sm font-bold text-zinc-300 hover:text-white"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-zinc-400 ml-3">
                    Total : <strong className="text-white font-mono">{activeProduct.price * quantity} DT</strong>
                  </span>
                </div>

                {/* Direct WhatsApp Call to Action */}
                <button
                  type="button"
                  onClick={() => handleOrderViaWhatsApp(activeProduct)}
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-xs uppercase tracking-wider transition-colors shadow-lg flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Commander via WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
