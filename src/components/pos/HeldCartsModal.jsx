
import React from 'react';
import { motion } from 'framer-motion';
import { X, Archive, Play, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeldCartsModal = ({ ventesEnAttente, onFermer, onReprendre, onSupprimer }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="modal-overlay"
      onClick={onFermer}
    >
      <motion.div
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        className="modal-content max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-6 flex justify-between items-center border-b dark:border-gray-700">
          <h3 className="text-xl font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
            <Archive className="w-6 h-6 text-purple-500" />
            Ventes en attente
          </h3>
          <button onClick={onFermer} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <X className="w-5 h-5" />
          </button>
        </header>

        <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
          {ventesEnAttente.length > 0 ? (
            ventesEnAttente.map((vente) => (
              <div key={vente.id} className="p-4 rounded-lg border dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50">
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">{vente.nom}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {vente.panier.length} article{vente.panier.length > 1 ? 's' : ''} • Total: {vente.panier.reduce((t, i) => t + i.prix * i.quantite, 0).toLocaleString()} FCFA
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-600" onClick={() => onSupprimer(vente.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <Button size="sm" onClick={() => onReprendre(vente.id)} className="pos-button">
                    <Play className="w-4 h-4 mr-2" /> Reprendre
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <Archive className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">Aucune vente en attente.</p>
            </div>
          )}
        </div>

        <footer className="p-6 flex justify-end border-t dark:border-gray-700">
          <Button onClick={onFermer} variant="outline">Fermer</Button>
        </footer>
      </motion.div>
    </motion.div>
  );
};

export default HeldCartsModal;
