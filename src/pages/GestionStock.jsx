import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { 
  Package,
  Download,
  Upload,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/components/ui/use-toast';
import StockStats from '@/components/stock/StockStats.jsx';
import StockAlerts from '@/components/stock/StockAlerts.jsx';
import StockFilters from '@/components/stock/StockFilters.jsx';
import StockList from '@/components/stock/StockList.jsx';
import StockAdjustmentModal from '@/components/stock/StockAdjustmentModal.jsx';

const GestionStock = () => {
  const { produits, activiteActive, modifierProduit, categories: allCategories } = useApp();
  const { toast } = useToast();
  
  const [recherche, setRecherche] = useState('');
  const [categorieFiltre, setCategorieFiltre] = useState('');
  const [stockFiltre, setStockFiltre] = useState('tous');
  
  const [modaleAjustement, setModaleAjustement] = useState({
    isOpen: false,
    produit: null,
    type: 'entree'
  });

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
          Veuillez sélectionner une activité pour gérer son stock
        </p>
      </div>
    );
  }

  const produitsActifs = produits.filter(p => p.activiteId === activiteActive.id);

  const produitsAffiches = produitsActifs.filter(produit => {
    const correspondRecherche = produit.nom.toLowerCase().includes(recherche.toLowerCase());
    const correspondCategorie = !categorieFiltre || produit.categorie === categorieFiltre;
    
    let correspondStock = true;
    if (stockFiltre === 'faible') correspondStock = produit.stock <= produit.stockMin;
    else if (stockFiltre === 'rupture') correspondStock = produit.stock === 0;
    else if (stockFiltre === 'normal') correspondStock = produit.stock > produit.stockMin;
    
    return correspondRecherche && correspondCategorie && correspondStock;
  });

  const categories = allCategories.filter(c => c.activiteId === activiteActive.id);

  const ouvrirModaleAjustement = (produit, type) => {
    setModaleAjustement({ isOpen: true, produit, type });
  };

  const fermerModaleAjustement = () => {
    setModaleAjustement({ isOpen: false, produit: null, type: 'entree' });
  };

  const confirmerAjustement = (quantite, motif) => {
    const { produit, type } = modaleAjustement;
    if (!produit) return;

    const nouvelleQuantite = type === 'entree' 
      ? produit.stock + quantite 
      : Math.max(0, produit.stock - quantite);

    modifierProduit(produit.id, { stock: nouvelleQuantite });
    
    toast({
      title: type === 'entree' ? "📦 Stock ajouté" : "📤 Stock retiré",
      description: `${produit.nom}: ${quantite} unité(s) ${type === 'entree' ? 'ajoutée(s)' : 'retirée(s)'}. Motif: ${motif || 'Aucun'}`,
      className: "toast-success"
    });
  };

  const ajustementRapide = (produit, nouvelleQuantite) => {
    if (nouvelleQuantite < 0) return;
    modifierProduit(produit.id, { stock: nouvelleQuantite });
    toast({
      title: "✅ Stock ajusté",
      description: `${produit.nom}: stock mis à jour à ${nouvelleQuantite}`,
      className: "toast-success"
    });
  };

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Gestion du Stock - {activiteActive.nom}</title>
        <meta name="description" content={`Suivi des stocks pour ${activiteActive.nom}.`} />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Gestion du Stock
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {activiteActive.nom} • Suivi en temps réel de votre inventaire
          </p>
        </div>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <Button
            onClick={() => toast({ title: "🚧 Fonctionnalité à venir", description: "L'import de stock sera bientôt disponible.", className: "toast-warning" })}
            variant="outline"
          >
            <Upload className="w-4 h-4 mr-2" /> Importer
          </Button>
          <Button
            onClick={() => toast({ title: "🚧 Fonctionnalité à venir", description: "L'export de stock sera bientôt disponible.", className: "toast-warning" })}
            variant="outline"
          >
            <Download className="w-4 h-4 mr-2" /> Exporter
          </Button>
        </div>
      </motion.div>

      <StockStats produits={produitsActifs} />
      <StockAlerts produits={produitsActifs} onReapprovisionner={(p) => ouvrirModaleAjustement(p, 'entree')} />
      
      <StockFilters 
        recherche={recherche}
        setRecherche={setRecherche}
        categorieFiltre={categorieFiltre}
        setCategorieFiltre={setCategorieFiltre}
        stockFiltre={stockFiltre}
        setStockFiltre={setStockFiltre}
        categories={categories.map(c => c.nom)}
      />
      
      <StockList
        produits={produitsAffiches}
        onAjustementRapide={ajustementRapide}
        onOuvrirModale={ouvrirModaleAjustement}
      />

      <StockAdjustmentModal
        isOpen={modaleAjustement.isOpen}
        onClose={fermerModaleAjustement}
        onConfirm={confirmerAjustement}
        productName={modaleAjustement.produit?.nom}
        type={modaleAjustement.type}
      />
    </div>
  );
};

export default GestionStock;