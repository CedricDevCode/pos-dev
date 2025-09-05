import React from 'react';
import { AlertTriangle, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const StockAlerts = ({ produits }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 h-full">
    <div className="flex items-center space-x-3 mb-4">
      <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
        <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Alertes Stock</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{produits.length} produits à surveiller</p>
      </div>
    </div>
    <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
      {produits.slice(0, 5).map(produit => (
        <div key={produit.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <Package className="w-4 h-4 text-gray-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{produit.nom}</p>
              <p className="text-xs text-red-500">Stock: {produit.stock}</p>
            </div>
          </div>
          <span className="text-xs font-semibold badge-warning">Faible</span>
        </div>
      ))}
    </div>
    <Button asChild variant="outline" className="w-full mt-4">
      <Link to="/gestion-stock">Gérer le stock</Link>
    </Button>
  </div>
);

export default StockAlerts;