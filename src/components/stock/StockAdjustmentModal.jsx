import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Plus, Minus, FileText } from 'lucide-react';

const StockAdjustmentModal = ({
  isOpen,
  onClose,
  onConfirm,
  productName,
  type,
}) => {
  const [quantite, setQuantite] = useState('');
  const [motif, setMotif] = useState('');

  const isEntry = type === 'entree';
  const title = isEntry ? 'Ajouter du Stock' : 'Retirer du Stock';
  const Icon = isEntry ? Plus : Minus;
  const iconColor = isEntry ? 'text-green-500' : 'text-red-500';

  const handleSubmit = (e) => {
    e.preventDefault();
    const quantiteNum = parseInt(quantite);
    if (!isNaN(quantiteNum) && quantiteNum > 0) {
      onConfirm(quantiteNum, motif);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modal-overlay"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="modal-content max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSubmit} className="flex flex-col h-full">
              <header className="p-6 border-b flex justify-between items-center">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Icon className={`w-6 h-6 ${iconColor}`} />
                  {title}
                </h3>
                <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                  <X className="w-5 h-5" />
                </button>
              </header>

              <div className="p-6 space-y-4 flex-1">
                <p className="text-gray-700 dark:text-gray-300">
                  Produit: <span className="font-bold">{productName}</span>
                </p>
                <div>
                  <label htmlFor="quantite" className="form-label flex items-center gap-2">
                    Quantité
                  </label>
                  <input
                    id="quantite"
                    type="number"
                    value={quantite}
                    onChange={(e) => setQuantite(e.target.value)}
                    className="form-input"
                    placeholder="Ex: 10"
                    min="1"
                    required
                    autoFocus
                  />
                </div>
                <div>
                  <label htmlFor="motif" className="form-label flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    Motif (optionnel)
                  </label>
                  <textarea
                    id="motif"
                    value={motif}
                    onChange={(e) => setMotif(e.target.value)}
                    className="form-input"
                    rows="3"
                    placeholder="Ex: Réception de commande, inventaire, perte..."
                  />
                </div>
              </div>

              <footer className="p-6 flex justify-end gap-4 bg-gray-50 dark:bg-gray-800/50 border-t">
                <Button type="button" variant="outline" onClick={onClose}>
                  Annuler
                </Button>
                <Button type="submit" className={isEntry ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}>
                  Confirmer
                </Button>
              </footer>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StockAdjustmentModal;