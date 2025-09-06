
import React from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2 } from 'lucide-react';

const ProductCard = ({ produit, onAjouterAuPanier }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    whileHover={{ y: -5 }}
    onClick={() => onAjouterAuPanier(produit)}
    className="product-card overflow-hidden"
  >
    <div className="aspect-square relative">
      <img  src={produit.image} alt={produit.nom} className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1635865165118-917ed9e20936" />
      <div className="absolute bottom-2 right-2 flex items-center space-x-1 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
        <div className={`w-2 h-2 rounded-full ${
          produit.stock > produit.stockMin ? 'bg-green-500' :
          produit.stock > 0 ? 'bg-orange-500' : 'bg-red-500'
        }`}></div>
        <span>{produit.stock}</span>
      </div>
    </div>
    <div className="p-3">
      <h3 className="font-semibold text-gray-800 dark:text-white text-sm truncate">{produit.nom}</h3>
      <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{produit.prix.toLocaleString()} FCFA</p>
    </div>
  </motion.div>
);

const ProductGrid = ({ produits, onAjouterAuPanier, loading }) => {
  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8">
        <Loader2 className="w-16 h-16 text-purple-500 animate-spin mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Chargement des produits...</h3>
      </div>
    );
  }

  if (!produits || produits.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <Search className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Aucun produit trouvé</h3>
        <p className="text-gray-500 dark:text-gray-400">Essayez de modifier vos filtres ou votre recherche.</p>
      </div>
    );
  }

  return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {produits.map((produit) => (
          <ProductCard key={produit.id} produit={produit} onAjouterAuPanier={onAjouterAuPanier} />
        ))}
      </div>
  );
};

export default ProductGrid;
