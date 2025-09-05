import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Plus } from 'lucide-react';

const StockAlerts = ({ produits, onMouvement }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-6"
    >
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Alertes Stock Faible</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{produits.length} produit(s) à réapprovisionner</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {produits.slice(0, 6).map((produit) => (
          <div key={produit.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
            <div className="flex items-center space-x-3">
              <img src={produit.image} alt={produit.nom} className="w-12 h-12 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{produit.nom}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Stock: {produit.stock} • Min: {produit.stockMin}</p>
              </div>
              <button onClick={() => onMouvement(produit, 'entree')} className="p-2 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 rounded-lg" title="Réapprovisionner">
                <Plus className="w-4 h-4 text-green-600" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default StockAlerts;