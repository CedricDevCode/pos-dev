import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';

const OpenRegisterModal = ({ onFermer, onOuvrir }) => {
  const [soldeInitial, setSoldeInitial] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onOuvrir(parseFloat(soldeInitial) || 0);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="modal-overlay"
    >
      <motion.div
        initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 50 }}
        className="modal-content max-w-sm" onClick={e => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <header className="p-6 flex justify-between items-center border-b">
            <h3 className="text-xl font-semibold">Ouvrir la Caisse</h3>
            <button type="button" onClick={onFermer} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
              <X className="w-5 h-5" />
            </button>
          </header>

          <div className="p-6 space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Saisissez le montant initial du fonds de caisse pour commencer votre session.
            </p>
            <div>
              <label htmlFor="soldeInitial" className="form-label">Fonds de caisse (FCFA)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="soldeInitial"
                  type="number"
                  value={soldeInitial}
                  onChange={(e) => setSoldeInitial(e.target.value)}
                  className="form-input pl-10"
                  placeholder="0"
                  required
                  autoFocus
                />
              </div>
            </div>
          </div>

          <footer className="p-6 flex justify-end space-x-4 border-t">
            <Button type="button" variant="outline" onClick={onFermer}>Annuler</Button>
            <Button type="submit" className="pos-button">Ouvrir la session</Button>
          </footer>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default OpenRegisterModal;