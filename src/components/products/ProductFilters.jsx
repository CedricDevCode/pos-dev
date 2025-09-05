import React from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

const ProductFilters = ({ recherche, setRecherche, categorieFiltre, setCategorieFiltre, stockFiltre, setStockFiltre, categories }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
    >
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
          <input
            type="text"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            placeholder="Rechercher un produit..."
            className="pl-10 pr-4 py-2 w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        <select
          value={categorieFiltre}
          onChange={(e) => setCategorieFiltre(e.target.value)}
          className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="">Toutes catégories</option>
          {categories.map(categorie => (
            <option key={categorie} value={categorie}>{categorie}</option>
          ))}
        </select>
        <select
          value={stockFiltre}
          onChange={(e) => setStockFiltre(e.target.value)}
          className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="tous">Tous les stocks</option>
          <option value="normal">Stock normal</option>
          <option value="faible">Stock faible</option>
          <option value="rupture">En rupture</option>
        </select>
      </div>
    </motion.div>
  );
};

export default ProductFilters;