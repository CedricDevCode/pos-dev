// Cart.jsx
import React, { useMemo, useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Plus, Minus, Trash2, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CartItem = ({ item, onModifierQuantite }) => (
  <motion.div
    layout
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -50 }}
    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
  >
    <img
      src={item.image}
      alt={item.nom}
      className="w-14 h-14 rounded-md object-cover flex-shrink-0"
    />
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium truncate text-gray-800 dark:text-gray-200">{item.nom}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{item.prix.toLocaleString()} FCFA</p>
      <div className="flex items-center space-x-2 mt-1">
        <button
          onClick={() => onModifierQuantite(item.id, item.quantite - 1)}
          className="p-1 rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500"
        >
          <Minus className="w-3 h-3" />
        </button>
        <span className="text-sm font-semibold w-6 text-center">{item.quantite}</span>
        <button
          onClick={() => onModifierQuantite(item.id, item.quantite + 1)}
          className="p-1 rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>
    </div>
    <div className="text-right">
      <p className="font-semibold text-gray-800 dark:text-gray-200">
        {(item.prix * item.quantite).toLocaleString()} FCFA
      </p>
      <button
        onClick={() => onModifierQuantite(item.id, 0)}
        className="text-red-500 hover:text-red-700 text-xs mt-1"
      >
        Retirer
      </button>
    </div>
  </motion.div>
);

const Cart = ({ panier, onModifierQuantite, onViderPanier, onPaiement, tauxTaxe = 18 }) => {
  const { sousTotal, montantTaxe, totalGeneral } = useMemo(() => {
    const sousTotal = panier.reduce((total, item) => total + item.prix * item.quantite, 0);
    const montantTaxe = (sousTotal * tauxTaxe) / 100;
    const totalGeneral = sousTotal + montantTaxe;
    return { sousTotal, montantTaxe, totalGeneral };
  }, [panier, tauxTaxe]);

  // Références pour le défilement
  const articlesContainerRef = useRef(null);
  const prevPanierLengthRef = useRef(panier.length);
  const [shouldScroll, setShouldScroll] = useState(false);

  // Vérifier si le défilement est nécessaire
  useEffect(() => {
    if (articlesContainerRef.current && panier.length > prevPanierLengthRef.current) {
      const container = articlesContainerRef.current;
      const isAtBottom = container.scrollHeight - container.scrollTop === container.clientHeight;
      
      // Si l'utilisateur n'est pas déjà en bas, on active le défilement automatique
      if (!isAtBottom) {
        setShouldScroll(true);
      }
    }
    
    prevPanierLengthRef.current = panier.length;
  }, [panier.length]);

  // Effectuer le défilement après le rendu
  useEffect(() => {
    if (shouldScroll && articlesContainerRef.current) {
      articlesContainerRef.current.scrollTo({
        top: articlesContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
      setShouldScroll(false);
    }
  }, [shouldScroll]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col h-full max-h-full overflow-hidden">
      <header className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-800 dark:text-gray-200">
          <ShoppingCart className="w-5 h-5" />
          Panier ({panier.length})
        </h2>
        {panier.length > 0 && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onViderPanier}
            className="text-red-500 hover:bg-red-100/50 dark:hover:bg-red-900/20"
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        )}
      </header>

      {/* Conteneur des articles avec défilement vertical - utilise l'espace disponible */}
      <div 
        ref={articlesContainerRef}
        className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600"
      >
        <AnimatePresence>
          {panier.length > 0 ? (
            panier.map(item => (
              <CartItem key={item.id} item={item} onModifierQuantite={onModifierQuantite} />
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="text-center py-10"
            >
              <ShoppingCart className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500">Le panier est vide.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {panier.length > 0 && (
        <footer className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
          <div className="space-y-1 text-sm">
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Sous-total</span>
              <span>{sousTotal.toLocaleString()} FCFA</span>
            </div>
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Taxe ({tauxTaxe}%)</span>
              <span>{montantTaxe.toLocaleString()} FCFA</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-800 dark:text-gray-200 pt-1 border-t border-gray-200 dark:border-gray-600 mt-1">
              <span>Total</span>
              <span className="text-purple-600 dark:text-purple-400">{totalGeneral.toLocaleString()} FCFA</span>
            </div>
          </div>
          <Button onClick={onPaiement} className="w-full pos-button">
            <CreditCard className="w-5 h-5 mr-2" />
            Payer
          </Button>
        </footer>
      )}
    </div>
  );
};

export default Cart;