
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const HoldCartNameModal = ({ onFermer, onConfirmer, defaultName }) => {
  const [nom, setNom] = useState(defaultName || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nom.trim()) {
      onConfirmer(nom.trim());
    }
  };

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
        className="modal-content max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-6 flex justify-between items-center border-b dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Nommer la vente en attente
          </h3>
          <button onClick={onFermer} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <X className="w-5 h-5" />
          </button>
        </header>
        
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <label htmlFor="cart-name" className="form-label">
              Donnez un nom à cette vente pour la retrouver facilement.
            </label>
            <Input
              id="cart-name"
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Ex: Client en chemise bleue"
              className="mt-2"
              autoFocus
            />
          </div>

          <footer className="p-6 flex justify-end gap-4 border-t dark:border-gray-700">
            <Button type="button" variant="outline" onClick={onFermer}>
              Annuler
            </Button>
            <Button type="submit" className="pos-button" disabled={!nom.trim()}>
              <Save className="w-4 h-4 mr-2" />
              Sauvegarder
            </Button>
          </footer>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default HoldCartNameModal;
