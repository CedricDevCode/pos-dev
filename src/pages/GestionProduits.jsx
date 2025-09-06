import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Package, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/components/ui/use-toast';
import ConfirmationModal from '@/components/common/ConfirmationModal.jsx';
import ProductHeader from '@/components/products/ProductHeader.jsx';
import ProductStats from '@/components/products/ProductStats.jsx';
import ProductFilters from '@/components/products/ProductFilters.jsx';
import ProductList from '@/components/products/ProductList.jsx';
import ProductModal from '@/components/products/ProductModal.jsx';

const GestionProduits = () => {
  const { produits, activiteActive, ajouterProduit, modifierProduit, supprimerProduit, categories: allCategories } = useApp();
  const { toast } = useToast();
  
  const [modaleOuverte, setModaleOuverte] = useState(false);
  const [produitEnEdition, setProduitEnEdition] = useState(null);
  const [recherche, setRecherche] = useState('');
  const [categorieFiltre, setCategorieFiltre] = useState('');
  const [stockFiltre, setStockFiltre] = useState('tous');
  const [modaleConfirmation, setModaleConfirmation] = useState({ isOpen: false, produit: null });

  if (!activiteActive) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Aucune activité sélectionnée
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Veuillez sélectionner une activité pour gérer ses produits
        </p>
      </div>
    );
  }

  const produitsActifs = produits.filter(p => p.activiteId === activiteActive.id);
  
  const produitsFiltres = produitsActifs.filter(produit => {
    const correspondRecherche = produit.nom.toLowerCase().includes(recherche.toLowerCase()) ||
                               (produit.description && produit.description.toLowerCase().includes(recherche.toLowerCase()));
    const correspondCategorie = !categorieFiltre || produit.categorie === categorieFiltre;
    
    let correspondStock = true;
    if (stockFiltre === 'faible') correspondStock = produit.stock <= produit.stockMin;
    else if (stockFiltre === 'rupture') correspondStock = produit.stock === 0;
    else if (stockFiltre === 'normal') correspondStock = produit.stock > produit.stockMin;
    
    return correspondRecherche && correspondCategorie && correspondStock;
  });

  const categories = allCategories.filter(c => c.activiteId === activiteActive.id);

  const ouvrirModaleCreation = () => {
    setProduitEnEdition(null);
    setModaleOuverte(true);
  };

  const ouvrirModaleEdition = (produit) => {
    setProduitEnEdition(produit);
    setModaleOuverte(true);
  };

  const fermerModale = () => {
    setModaleOuverte(false);
    setProduitEnEdition(null);
  };

  const preparerSuppression = (produit) => {
    setModaleConfirmation({
      isOpen: true,
      produit,
      title: `Supprimer le produit ?`,
      message: `Êtes-vous sûr de vouloir supprimer "${produit.nom}" ? Cette action est irréversible.`,
      onConfirm: () => executerSuppression(produit.id),
    });
  };

  const executerSuppression = (id) => {
    supprimerProduit(id);
    toast({
      title: "✅ Produit supprimé",
      description: "Le produit a été supprimé avec succès.",
      className: "toast-success"
    });
    setModaleConfirmation({ isOpen: false, produit: null });
  };
  
  const basculerEtatActif = (produit) => {
    modifierProduit(produit.id, { actif: !produit.actif });
    toast({
      title: produit.actif ? "⏸️ Produit désactivé" : "▶️ Produit activé",
      description: `${produit.nom} est maintenant ${produit.actif ? 'inactif' : 'actif'}.`,
      className: "toast-success"
    });
  };

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Gestion des Produits - {activiteActive.nom}</title>
        <meta name="description" content={`Gérez le catalogue de produits pour ${activiteActive.nom}.`} />
      </Helmet>

      <ProductHeader 
        activiteNom={activiteActive.nom}
        totalProduits={produitsActifs.length}
        onNouveauProduit={ouvrirModaleCreation}
      />
      
      <ProductStats produits={produitsActifs} />

      <ProductFilters 
        recherche={recherche}
        setRecherche={setRecherche}
        categorieFiltre={categorieFiltre}
        setCategorieFiltre={setCategorieFiltre}
        stockFiltre={stockFiltre}
        setStockFiltre={setStockFiltre}
        categories={categories}
      />

      <ProductList
        produits={produitsFiltres}
        onModifier={ouvrirModaleEdition}
        onSupprimer={preparerSuppression}
        onToggleActif={basculerEtatActif}
      />

      <ProductModal
        isOpen={modaleOuverte}
        onClose={fermerModale}
        produit={produitEnEdition}
      />

      <ConfirmationModal
        isOpen={modaleConfirmation.isOpen}
        onClose={() => setModaleConfirmation({ isOpen: false, produit: null })}
        onConfirm={modaleConfirmation.onConfirm}
        title={modaleConfirmation.title}
        message={modaleConfirmation.message}
      />
    </div>
  );
};

export default GestionProduits;