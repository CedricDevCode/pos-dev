import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, BarChart3, Search } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const StockTable = ({ produits, onMouvement, onAjustement, recherche }) => {
  const { toast } = useToast();
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden p-6"
    >
      {produits.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="table-header">
              <tr>
                <th className="px-6 py-3 text-left">Produit</th>
                <th className="px-6 py-3 text-left">Catégorie</th>
                <th className="px-6 py-3 text-left">Stock Actuel</th>
                <th className="px-6 py-3 text-left">Stock Min</th>
                <th className="px-6 py-3 text-left">Valeur</th>
                <th className="px-6 py-3 text-left">Statut</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {produits.map((produit) => (
                <tr key={produit.id} className="table-row">
                  <td className="table-cell">
                    <div className="flex items-center space-x-3">
                      <img src={produit.image} alt={produit.nom} className="w-12 h-12 rounded-lg object-cover" />
                      <div>
                        <p className="font-medium">{produit.nom}</p>
                        <p className="text-sm text-gray-500">{produit.prix.toLocaleString()} FCFA</p>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell"><span className="badge-success">{produit.categorie}</span></td>
                  <td className="table-cell">
                    <input type="number" value={produit.stock} onChange={(e) => onAjustement(produit, parseInt(e.target.value))} className="w-20 form-input text-sm" />
                  </td>
                  <td className="table-cell">{produit.stockMin}</td>
                  <td className="table-cell">
                    <p className="font-medium">{(produit.stock * produit.cout).toLocaleString()} FCFA</p>
                    <p className="text-xs text-gray-500">Coût: {produit.cout.toLocaleString()} FCFA</p>
                  </td>
                  <td className="table-cell">
                    {produit.stock === 0 ? <span className="badge-error">Rupture</span> :
                     produit.stock <= produit.stockMin ? <span className="badge-warning">Faible</span> :
                     <span className="badge-success">Normal</span>}
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center space-x-2">
                      <button onClick={() => onMouvement(produit, 'entree')} className="p-2 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 rounded-lg" title="Entrée">
                        <Plus className="w-4 h-4 text-green-600" />
                      </button>
                      <button onClick={() => onMouvement(produit, 'sortie')} className="p-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 rounded-lg" title="Sortie">
                        <Minus className="w-4 h-4 text-red-600" />
                      </button>
                      <button onClick={() => toast({title: "🚧 Non implémenté"})} className="p-2 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 rounded-lg" title="Historique">
                        <BarChart3 className="w-4 h-4 text-blue-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold">Aucun produit trouvé</h3>
          <p className="text-gray-500">{recherche ? 'Essayez une autre recherche.' : 'Aucun produit ne correspond aux filtres.'}</p>
        </div>
      )}
    </motion.div>
  );
};

export default StockTable;