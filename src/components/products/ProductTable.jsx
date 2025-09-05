import React from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Edit, Trash2, Package, Search } from 'lucide-react';

const ProductTable = ({ 
  produits, 
  onEdit, 
  onDelete, 
  onToggleActive, 
  onRegulariserStock, 
  recherche, 
  categorieFiltre,  
  stockFiltre 
}) => {
  const produitsList = Array.isArray(produits) ? produits : [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      {produits.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {['Produit', 'Catégorie', 'Prix', 'Stock', 'Statut', 'Actions'].map((title) => (
                  <th
                    key={title}
                    className="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    {title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {produits.map((produit) => (
                <tr key={produit.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  
                  {/* Produit */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      {produit.image ? (
                        <img src={produit.image} alt={produit.nom} className="w-12 h-12 rounded-lg object-cover" />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                          <Package className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      <div className="truncate">
                        <p className="font-medium text-gray-900 dark:text-white truncate">{produit.nom}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                          {produit.description || 'Aucune description'}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Catégorie */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      {produit.categorie || 'Non catégorisé'}
                    </span>
                  </td>

                  {/* Prix */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {produit.prix?.toLocaleString() || '0'} FCFA
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Coût: {produit.cout?.toLocaleString() || '0'} FCFA
                    </p>
                  </td>

                  {/* Stock */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900 dark:text-white">{produit.stock || 0}</span>
                      <div className={`w-3 h-3 rounded-full ${
                        produit.stock > produit.stockMin ? 'bg-green-500' :
                        produit.stock > 0 ? 'bg-orange-500' : 'bg-red-500'
                      }`} />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Min: {produit.stockMin || 0}</p>
                  </td>

                  {/* Statut */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      produit.actif 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                    }`}>
                      {produit.actif ? 'Actif' : 'Inactif'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      {/* Activer / Désactiver */}
                      <button
                        onClick={() => onToggleActive(produit)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition"
                        title={produit.actif ? 'Désactiver' : 'Activer'}
                      >
                        {produit.actif ? <EyeOff className="w-4 h-4 text-gray-500 dark:text-gray-400" /> : <Eye className="w-4 h-4 text-gray-500 dark:text-gray-400" />}
                      </button>

                      {/* Modifier */}
                      <button
                        onClick={() => onEdit(produit)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      </button>

                      {/* Supprimer */}
                      <button
                        onClick={() => onDelete(produit)}
                        className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4 text-red-500 dark:text-red-400" />
                      </button>

                      {/* Régulariser stock */}
                      {produit.stock <= produit.stockMin && (
                        <button
                          onClick={() => onRegulariserStock(produit)}
                          className="p-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition"
                          title="Régulariser le stock"
                        >
                          <Package className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                        </button>
                      )}
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Aucun produit trouvé</h3>
          <p className="text-gray-500 dark:text-gray-400">
            {recherche || categorieFiltre || stockFiltre !== 'tous'
              ? 'Essayez de modifier vos critères de recherche.'
              : 'Commencez par ajouter votre premier produit.'}
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default ProductTable;
