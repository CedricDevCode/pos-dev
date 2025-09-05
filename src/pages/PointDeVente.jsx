import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from '@/components/ui/use-toast';
import { Search } from 'lucide-react';
import ProductGrid from '@/components/pos/ProductGrid';
import Cart from '@/components/pos/Cart';
import PaymentModal from '@/components/pos/PaymentModal';
import ReceiptModal from '@/components/pos/ReceiptModal';

const PointDeVente = () => {
  const { 
    produits, 
    activiteActive, 
    ajouterVente, 
    panier, 
    ajouterAuPanier, 
    modifierQuantitePanier, 
    viderPanier, 
    finaliserVente 
  } = useAppContext();
  const { toast } = useToast();

  const [recherche, setRecherche] = useState('');
  const [categorieFiltre, setCategorieFiltre] = useState('');
  const [modalePaiementOuverte, setModalePaiementOuverte] = useState(false);
  const [modaleRecuOuverte, setModaleRecuOuverte] = useState(false);
  const [derniereVente, setDerniereVente] = useState(null);

  const rechercheInputRef = useRef(null);

  const produitsFiltres = useMemo(() => {
    return produits.filter(
      p =>
        p.activiteId === activiteActive?.id &&
        p.actif &&
        p.nom.toLowerCase().includes(recherche.toLowerCase()) &&
        (categorieFiltre === '' || p.categorie === categorieFiltre)
    );
  }, [produits, activiteActive, recherche, categorieFiltre]);

  const categories = useMemo(() => [...new Set(produits.filter(p => p.activiteId === activiteActive?.id).map(p => p.categorie))], [produits, activiteActive]);

  const handleAjouterAuPanier = useCallback(
    (produit) => {
      const result = ajouterAuPanier(produit);
      if (!result.success) {
        toast({ title: "⚠️", description: result.message, className: "toast-warning" });
      }
    },
    [ajouterAuPanier, toast]
  );

  const handleModifierQuantite = useCallback(
    (id, quantite) => {
      const result = modifierQuantitePanier(id, quantite);
      if (!result.success) {
        toast({ title: "⚠️", description: result.message, className: "toast-warning" });
      }
    },
    [modifierQuantitePanier, toast]
  );

  const handleFinaliserVente = useCallback(
    (paiement) => {
      const venteCree = finaliserVente(paiement);
      if (venteCree) {
        setDerniereVente(venteCree);
        setModalePaiementOuverte(false);
        setModaleRecuOuverte(true);
        toast({ title: "✅ Vente finalisée !", description: `Vente ${venteCree.id} enregistrée.`, className: "toast-success" });
      }
    },
    [finaliserVente, toast]
  );

  // Bloquer le scroll global de la page
  useEffect(() => {
    // Désactiver le scroll global
    document.body.style.overflow = 'hidden';
    
    // Nettoyer lors du démontage du composant
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    const gererRaccourcis = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        rechercheInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', gererRaccourcis);
    return () => window.removeEventListener('keydown', gererRaccourcis);
  }, []);

  if (!activiteActive) {
    return (
      <div className="flex items-center justify-center h-screen w-screen text-center overflow-hidden">
        <div>
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">Aucune activité sélectionnée</h2>
          <p className="mt-2 text-gray-500">Veuillez sélectionner une activité pour commencer à vendre.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col xl:flex-row gap-6 relative overflow-hidden">
      <Helmet>
        <title>Point de Vente - POS</title>
        <meta name="description" content="Interface de caisse moderne pour enregistrer les ventes, gérer le panier et traiter les paiements en FCFA." />
      </Helmet>

      {/* Section produits avec scroll interne */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Header fixe */}
        <div className="flex-shrink-0 p-6 pb-0">
          <header className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Point de Vente</h1>
            <p className="text-gray-600 dark:text-gray-400">Activité : {activiteActive.nom}</p>
          </header>

          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                ref={rechercheInputRef}
                type="text"
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                placeholder="Rechercher... (Ctrl+F)"
                className="w-full pl-10 pr-4 py-2 form-input"
              />
            </div>
            <select
              value={categorieFiltre}
              onChange={(e) => setCategorieFiltre(e.target.value)}
              className="form-input sm:max-w-xs"
            >
              <option value="">Toutes catégories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Zone scrollable pour les produits */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <ProductGrid produits={produitsFiltres} onAjouterAuPanier={handleAjouterAuPanier} />
        </div>
      </div>

      {/* Section Cart avec scroll interne */}
      <motion.div 
        className="w-full xl:w-[400px] xl:max-w-md flex-shrink-0 relative h-full overflow-hidden"
        animate={{ x: modalePaiementOuverte ? -200 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <Cart
          panier={panier}
          onModifierQuantite={handleModifierQuantite}
          onViderPanier={viderPanier}
          onPaiement={() => setModalePaiementOuverte(true)}
          tauxTaxe={activiteActive?.tauxTaxe}
        />
      </motion.div>

      {/* PaymentModal à droite avec scroll interne */}
      <AnimatePresence>
        {modalePaiementOuverte && (
          <motion.div
            initial={{ x: 500, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 500, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute top-0 right-0 h-full xl:w-[400px] z-50 overflow-hidden"
          >
            <PaymentModal
              panier={panier}
              tauxTaxe={activiteActive?.tauxTaxe}
              onFermer={() => setModalePaiementOuverte(false)}
              onFinaliser={handleFinaliserVente}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ReceiptModal */}
      <AnimatePresence>
        {modaleRecuOuverte && derniereVente && (
          <ReceiptModal
            vente={derniereVente}
            activite={activiteActive}
            onFermer={() => setModaleRecuOuverte(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default PointDeVente;