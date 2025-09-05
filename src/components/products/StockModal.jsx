import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const StockModal = ({ isOpen, onClose, produit, onSubmit }) => {
  const { toast } = useToast();
  const [stock, setStock] = useState(produit?.stock || 0);

  useEffect(() => {
    if (produit) setStock(produit.stock);
  }, [produit]);

  if (!isOpen || !produit) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (stock < 0) {
      toast({ title: "❌ Erreur", description: "Le stock doit être >= 0", className: "toast-error" });
      return;
    }
    onSubmit(produit.id, stock);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6 border-b border-gray-200 dark:border-gray-700 pb-3">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            Régulariser le stock
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <p className="text-gray-700 dark:text-gray-300">
            Produit: <strong>{produit.nom}</strong>
          </p>

          <div className="flex flex-col">
            <label className="mb-2 text-gray-700 dark:text-gray-300 font-medium">Stock actuel</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(parseInt(e.target.value) || 0)}
              min="0"
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white transition-colors">
              Régulariser
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default StockModal;
