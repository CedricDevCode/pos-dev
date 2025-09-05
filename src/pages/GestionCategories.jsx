import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Tag, Search, Plus, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { useApp } from '@/hooks/useApp';
import { useToast } from '@/components/ui/use-toast';

import { Button } from '@/components/ui/button';
// CORRECTION: Changer le chemin d'import pour pointer vers le dossier products
import CategorieModal from '@/components/products/CategorieModal'; // ← Modifié ici

const GestionCategories = () => {
  const { categories, activiteActive, ajouterCategorie, modifierCategorie, supprimerCategorie } = useApp();
  const { toast } = useToast();

  const [modaleOuverte, setModaleOuverte] = useState(false);
  const [categorieEnEdition, setCategorieEnEdition] = useState(null);
  const [recherche, setRecherche] = useState('');

  // Filtrer les catégories par activité active et recherche
  const categoriesAffichees = useCallback(() => {
    return categories.filter(categorie => {
      if (!activiteActive || categorie.activiteId !== activiteActive.id) return false;
      
      const correspondRecherche = categorie.nom.toLowerCase().includes(recherche.toLowerCase()) ||
                                 (categorie.description && categorie.description.toLowerCase().includes(recherche.toLowerCase()));
      
      return correspondRecherche;
    });
  }, [categories, activiteActive, recherche]);

  // Modale création/édition
  const ouvrirModaleCreation = () => { 
    setCategorieEnEdition(null); 
    setModaleOuverte(true); 
  };
  
  const ouvrirModaleEdition = (categorie) => { 
    setCategorieEnEdition(categorie); 
    setModaleOuverte(true); 
  };
  
  const fermerModale = () => setModaleOuverte(false);

  const gererSoumission = (formData) => {
    try {
      if (categorieEnEdition) {
        modifierCategorie(categorieEnEdition.id, { ...formData, activiteId: activiteActive.id });
        toast({ 
          title: "✅ Catégorie modifiée", 
          description: `${formData.nom} a été mise à jour avec succès`, 
          className: "toast-success" 
        });
      } else {
        ajouterCategorie({ ...formData, activiteId: activiteActive.id });
        toast({ 
          title: "✅ Catégorie créée", 
          description: `${formData.nom} a été ajoutée avec succès`, 
          className: "toast-success" 
        });
      }
      fermerModale();
    } catch (error) {
      toast({ 
        title: "❌ Erreur", 
        description: error.message, 
        className: "toast-error" 
      });
    }
  };

  const gererSuppression = (categorie) => {
    try {
      if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${categorie.nom}" ?`)) {
        supprimerCategorie(categorie.id);
        toast({ 
          title: "✅ Catégorie supprimée", 
          description: `${categorie.nom} a été supprimée`, 
          className: "toast-success" 
        });
      }
    } catch (error) {
      toast({ 
        title: "❌ Erreur", 
        description: error.message, 
        className: "toast-error" 
      });
    }
  };

  const basculerEtatActif = (categorie) => {
    modifierCategorie(categorie.id, { actif: !categorie.actif });
    toast({ 
      title: categorie.actif ? "⏸️ Catégorie désactivée" : "▶️ Catégorie activée", 
      description: `${categorie.nom} est maintenant ${categorie.actif ? 'inactive' : 'active'}`, 
      className: "toast-success" 
    });
  };

  if (!activiteActive) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <Tag className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Aucune activité sélectionnée</h3>
        <p className="text-gray-500 dark:text-gray-400">Veuillez sélectionner une activité pour gérer ses catégories</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Gestion des Catégories - POS</title>
        <meta name="description" content="Gérez vos catégories de produits." />
      </Helmet>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Gestion des Catégories</h1>
            <p className="text-gray-600 dark:text-gray-400">{activiteActive.nom}</p>
          </div>
          <Button onClick={ouvrirModaleCreation} className="pos-button mt-4 md:mt-0">
            <Plus className="w-4 h-4 mr-2" />Nouvelle Catégorie
          </Button>
        </div>
      </motion.div>

      {/* Barre de recherche */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher une catégorie..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </motion.div>

      {/* Tableau des catégories */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          {categoriesAffichees().length === 0 ? (
            <div className="text-center py-12">
              <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {recherche ? 'Aucune catégorie trouvée' : 'Aucune catégorie'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {recherche ? 'Essayez avec d\'autres termes' : 'Commencez par créer votre première catégorie'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Nom
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {categoriesAffichees().map((categorie) => (
                    <tr key={categorie.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                            <Tag className="w-5 h-5 text-white" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {categorie.nom}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                          {categorie.description || 'Aucune description'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => basculerEtatActif(categorie)}
                          className="flex items-center space-x-2"
                        >
                          {categorie.actif ? (
                            <ToggleRight className="w-6 h-6 text-green-500" />
                          ) : (
                            <ToggleLeft className="w-6 h-6 text-gray-400" />
                          )}
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {categorie.actif ? 'Active' : 'Inactive'}
                          </span>
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => ouvrirModaleEdition(categorie)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => gererSuppression(categorie)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {modaleOuverte && (
          <CategorieModal
            isOpen={modaleOuverte}
            onClose={fermerModale}
            onSubmit={gererSoumission}
            categorieToEdit={categorieEnEdition}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default GestionCategories;