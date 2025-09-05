import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Package, TrendingUp } from 'lucide-react';
import { useApp } from '@/hooks/useApp';
import { useToast } from '@/components/ui/use-toast';

import StockStats from '@/components/stock/StockStats';
import StockAlerts from '@/components/stock/StockAlerts';
import StockFilters from '@/components/stock/StockFilters';
import StockTable from '@/components/stock/StockTable';

const GestionStock = () => {
  const { produits, activiteActive, modifierProduit } = useApp();
  const { toast } = useToast();

  // ✅ valeurs par défaut fixées
  const [recherche, setRecherche] = useState('');
  const [categorieFiltre, setCategorieFiltre] = useState('toutes');
  const [stockFiltre, setStockFiltre] = useState('tous');

  // Filtres appliqués aux produits
  const produitsFiltres = useCallback(() => {
    return produits.filter((produit) => {
      if (!activiteActive || produit.activiteId !== activiteActive.id) return false;

      const correspondRecherche = produit.nom
        .toLowerCase()
        .includes(recherche.toLowerCase());

      const correspondCategorie =
        categorieFiltre === 'toutes' || produit.categorie === categorieFiltre;

      let correspondStock = true;
      if (stockFiltre === 'faible') {
        correspondStock = produit.stock <= produit.stockMin && produit.stock > 0;
      } else if (stockFiltre === 'rupture') {
        correspondStock = produit.stock === 0;
      } else if (stockFiltre === 'normal') {
        correspondStock = produit.stock > produit.stockMin;
      }

      return correspondRecherche && correspondCategorie && correspondStock;
    });
  }, [produits, activiteActive, recherche, categorieFiltre, stockFiltre]);

  // Liste des catégories pour l’activité active
  const categories = [
    ...new Set(
      produits
        .filter((p) => p.activiteId === activiteActive?.id)
        .map((p) => p.categorie)
    ),
  ].filter((c) => c && c.trim() !== ''); // ✅ on filtre les vides

  // Gestion des mouvements de stock
  const gererMouvementStock = (produit, type) => {
    const quantiteStr = prompt(
      `Quantité à ${type === 'entree' ? 'ajouter' : 'retirer'} pour "${
        produit.nom
      }":`
    );
    if (quantiteStr === null) return;

    const quantite = parseInt(quantiteStr);

    if (isNaN(quantite) || quantite <= 0) {
      toast({
        title: '❌ Quantité invalide',
        description: 'Veuillez saisir une quantité valide.',
        className: 'toast-error',
      });
      return;
    }

    const nouvelleQuantite =
      type === 'entree'
        ? produit.stock + quantite
        : Math.max(0, produit.stock - quantite);

    modifierProduit(produit.id, { stock: nouvelleQuantite });

    toast({
      title: type === 'entree' ? '📦 Stock ajouté' : '📤 Stock retiré',
      description: `${produit.nom}: ${quantite} unité(s) ${
        type === 'entree' ? 'ajoutée(s)' : 'retirée(s)'
      }. Nouveau stock : ${nouvelleQuantite}`,
      className: 'toast-success',
    });
  };

  // Ajustement rapide du stock
  const ajustementRapide = (produit, nouvelleQuantite) => {
    if (isNaN(nouvelleQuantite) || nouvelleQuantite < 0) {
      toast({
        title: '❌ Quantité invalide',
        description: 'Veuillez entrer une valeur numérique positive.',
        className: 'toast-error',
      });
      return;
    }

    modifierProduit(produit.id, { stock: nouvelleQuantite });
    toast({
      title: '✅ Stock ajusté',
      description: `${produit.nom}: stock mis à jour à ${nouvelleQuantite}`,
      className: 'toast-success',
    });
  };

  // Cas où aucune activité n’est sélectionnée
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
          Veuillez sélectionner une activité pour gérer son stock.
        </p>
      </div>
    );
  }

  // Calculs dérivés
  const produitsActivite = produits.filter(
    (p) => p.activiteId === activiteActive.id
  );
  const produitsStockFaible = produitsActivite.filter(
    (p) => p.stock <= p.stockMin && p.stock > 0
  );
  const produitsEnRupture = produitsActivite.filter((p) => p.stock === 0);

  const valeurTotaleStock = produitsActivite.reduce(
    (total, p) => total + (p.cout || 0) * p.stock,
    0
  );
  const potentielVente = produitsActivite.reduce(
    (total, p) => total + p.prix * p.stock,
    0
  );
  const margePotentielle = produitsActivite.reduce(
    (total, p) => total + (p.prix - (p.cout || 0)) * p.stock,
    0
  );

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Gestion du Stock - POS</title>
        <meta
          name="description"
          content="Suivez et gérez vos stocks en temps réel."
        />
      </Helmet>

      {/* En-tête */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Gestion du Stock
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {activiteActive.nom}
        </p>
      </motion.div>

      {/* Statistiques principales */}
      <StockStats produits={produitsActivite} />

      {/* Performance du stock */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800"
      >
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Performance du stock
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-600 dark:text-gray-400">
              Valeur totale du stock
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {valeurTotaleStock.toLocaleString()} FCFA
            </p>
          </div>

          <div>
            <p className="text-gray-600 dark:text-gray-400">Potentiel de vente</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {potentielVente.toLocaleString()} FCFA
            </p>
          </div>

          <div>
            <p className="text-gray-600 dark:text-gray-400">Marge potentielle</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {margePotentielle.toLocaleString()} FCFA
            </p>
          </div>
        </div>
      </motion.div>

      {/* Alertes de stock */}
      {(produitsStockFaible.length > 0 || produitsEnRupture.length > 0) && (
        <StockAlerts
          produitsFaibles={produitsStockFaible}
          produitsRupture={produitsEnRupture}
          onMouvement={gererMouvementStock}
        />
      )}

      {/* Filtres */}
      <StockFilters
        recherche={recherche}
        setRecherche={setRecherche}
        categorieFiltre={categorieFiltre}
        setCategorieFiltre={setCategorieFiltre}
        stockFiltre={stockFiltre}
        setStockFiltre={setStockFiltre}
        categories={categories}
      />

      {/* Tableau */}
      <StockTable
        produits={produitsFiltres()}
        onMouvement={gererMouvementStock}
        onAjustement={ajustementRapide}
        recherche={recherche}
      />
    </div>
  );
};

export default GestionStock;
