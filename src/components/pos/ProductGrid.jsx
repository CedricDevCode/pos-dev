import React, { useState } from "react";
import { Search, Plus } from "lucide-react";

const ProductCard = ({ produit, onAjouterAuPanier }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAjouterAuPanier?.(produit);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleAddToCart}
      className="group relative bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={produit.image || "/api/placeholder/400/400"}
          alt={produit.nom}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h3 className="font-semibold text-base mb-1 drop-shadow-lg line-clamp-2">{produit.nom}</h3>
            <p className="text-sm font-medium drop-shadow-lg">{produit.prix.toLocaleString()} FCFA</p>
          </div>
        </div>

        {produit.stock > 0 && (
          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}>
            <div
              onClick={handleAddToCart}
              className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-110"
            >
              <Plus className="w-7 h-7 text-gray-700" />
            </div>
          </div>
        )}

        {produit.stock <= 0 && (
          <div className="absolute inset-0 bg-red-500/80 flex items-center justify-center">
            <span className="text-white font-bold text-sm">RUPTURE</span>
          </div>
        )}
      </div>
    </div>
  );
};

const ProductGrid = ({ produits, onAjouterAuPanier }) => {
  if (!produits || produits.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg scrollbar-hide scrollable">
        <Search className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Aucun produit trouvé</h3>
        <p className="text-gray-500 dark:text-gray-400">Essayez de modifier vos filtres ou votre recherche.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-2 scrollbar-hide scrollable">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {produits.map((produit) => (
          <ProductCard key={produit.id} produit={produit} onAjouterAuPanier={onAjouterAuPanier} />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
