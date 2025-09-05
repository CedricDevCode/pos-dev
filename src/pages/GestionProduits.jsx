import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Package, Search } from 'lucide-react';
import { useApp } from '@/hooks/useApp';
import { useToast } from '@/components/ui/use-toast';

import ProductStats from '@/components/products/ProductStats';
import ProductFilters from '@/components/products/ProductFilters';
import ProductTable from '@/components/products/ProductTable';
import ProductModal from '@/components/products/ProductModal';
import StockModal from '@/components/products/StockModal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const GestionProduits = () => {
  const { produits, activiteActive, ajouterProduit, modifierProduit, supprimerProduit, categories } = useApp(); // ← Ajout de categories depuis useApp
  const { toast } = useToast();

  const [modaleOuverte, setModaleOuverte] = useState(false);
  const [produitEnEdition, setProduitEnEdition] = useState(null);

  const [stockModalOuverte, setStockModalOuverte] = useState(false);
  const [produitARegulariser, setProduitARegulariser] = useState(null);

  const [recherche, setRecherche] = useState('');
  const [categorieFiltre, setCategorieFiltre] = useState('');
  const [stockFiltre, setStockFiltre] = useState('tous');

  const produitsAffiches = useCallback(() => {
    return produits.filter(produit => {
      if (!activiteActive || produit.activiteId !== activiteActive.id) return false;

      const correspondRecherche = produit.nom.toLowerCase().includes(recherche.toLowerCase()) ||
                                 produit.description.toLowerCase().includes(recherche.toLowerCase());

      // Modification pour utiliser le nom de la catégorie
      const correspondCategorie = categorieFiltre === '' || produit.categorie === categorieFiltre;

      let correspondStock = true;
      if (stockFiltre === 'faible') correspondStock = produit.stock <= produit.stockMin;
      else if (stockFiltre === 'rupture') correspondStock = produit.stock === 0;
      else if (stockFiltre === 'normal') correspondStock = produit.stock > produit.stockMin;

      return correspondRecherche && correspondCategorie && correspondStock;
    });
  }, [produits, activiteActive, recherche, categorieFiltre, stockFiltre]);

  // Récupérer les noms des catégories pour les filtres (comme avant)
  const nomsCategories = [...new Set(
    produits
      .filter(p => p.activiteId === activiteActive?.id && p.categorie)
      .map(p => p.categorie)
  )];

  // Filtrer les catégories pour l'activité active (objets complets)
  const categoriesFiltrees = categories.filter(c => 
    c.activiteId === activiteActive?.id && c.actif
  );

  // Modale création/édition
  const ouvrirModaleCreation = () => { setProduitEnEdition(null); setModaleOuverte(true); };
  const ouvrirModaleEdition = (produit) => { setProduitEnEdition(produit); setModaleOuverte(true); };
  const fermerModale = () => setModaleOuverte(false);

  const gererSoumission = (formData) => {
    if (produitEnEdition) {
      modifierProduit(produitEnEdition.id, { ...formData, activiteId: activiteActive.id });
      toast({ title: "✅ Produit modifié", description: `${formData.nom} a été mis à jour avec succès`, className: "toast-success" });
    } else {
      ajouterProduit({ ...formData, activiteId: activiteActive.id });
      toast({ title: "✅ Produit créé", description: `${formData.nom} a été ajouté avec succès`, className: "toast-success" });
    }
    fermerModale();
  };

  const gererSuppression = (produit) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${produit.nom}" ?`)) {
      supprimerProduit(produit.id);
      toast({ title: "✅ Produit supprimé", description: `${produit.nom} a été supprimé`, className: "toast-success" });
    }
  };

  const basculerEtatActif = (produit) => {
    modifierProduit(produit.id, { actif: !produit.actif });
    toast({ title: produit.actif ? "⏸️ Produit désactivé" : "▶️ Produit activé", description: `${produit.nom} est maintenant ${produit.actif ? 'inactif' : 'actif'}`, className: "toast-success" });
  };

  // Stock
  const ouvrirStockModal = (produit) => { setProduitARegulariser(produit); setStockModalOuverte(true); };
  const fermerStockModal = () => { setStockModalOuverte(false); setProduitARegulariser(null); };

  const gererRegularisationStock = (produitId, nouvelleQuantite) => {
    modifierProduit(produitId, { stock: nouvelleQuantite });
    toast({ title: "📦 Stock régularisé", description: `Le stock a été mis à jour`, className: "toast-success" });
  };

  if (!activiteActive) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Aucune activité sélectionnée</h3>
        <p className="text-gray-500 dark:text-gray-400">Veuillez sélectionner une activité pour gérer ses produits</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Gestion des Produits - POS</title>
        <meta name="description" content="Gérez votre catalogue de produits." />
      </Helmet>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Gestion des Produits</h1>
            <p className="text-gray-600 dark:text-gray-400">{activiteActive.nom}</p>
          </div>
          <Button onClick={ouvrirModaleCreation} className="pos-button mt-4 md:mt-0">
            <Plus className="w-4 h-4 mr-2" />Nouveau Produit
          </Button>
        </div>
      </motion.div>

      <ProductStats produits={produits.filter(p => p.activiteId === activiteActive.id)} />

      <ProductFilters 
        recherche={recherche}
        setRecherche={setRecherche}
        categorieFiltre={categorieFiltre}
        setCategorieFiltre={setCategorieFiltre}
        stockFiltre={stockFiltre}
        setStockFiltre={setStockFiltre}
        categories={nomsCategories} // ← Utilisation des noms pour les filtres
      />

      <ProductTable
        produits={produitsAffiches()}
        onEdit={ouvrirModaleEdition}
        onDelete={gererSuppression}
        onToggleActive={basculerEtatActif}
        onRegulariserStock={ouvrirStockModal}
        recherche={recherche}
        categorieFiltre={categorieFiltre}
        stockFiltre={stockFiltre}
      />

      <AnimatePresence>
        {modaleOuverte && (
          <ProductModal
            isOpen={modaleOuverte}
            onClose={fermerModale}
            onSubmit={gererSoumission}
            produitToEdit={produitEnEdition}
            categories={categoriesFiltrees} // ← Passage des objets catégories complets
          />
        )}

        {stockModalOuverte && produitARegulariser && (
          <StockModal
            isOpen={stockModalOuverte}
            onClose={fermerStockModal}
            produit={produitARegulariser}
            onSubmit={gererRegularisationStock}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default GestionProduits;