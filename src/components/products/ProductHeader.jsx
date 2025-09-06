import React from 'react';
import { motion } from 'framer-motion';
import { Package, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ProductHeader = ({ activiteNom, totalProduits, onNouveauProduit }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between mb-6"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Gestion des Produits
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Gérez le catalogue de produits pour l'activité : <span className="font-semibold text-purple-600 dark:text-purple-400">{activiteNom}</span>. Vous avez <span className="font-semibold">{totalProduits}</span> produits.
        </p>
      </div>
      <Button onClick={onNouveauProduit} className="mt-4 sm:mt-0 bg-purple-600 hover:bg-purple-700 text-white">
        <Plus className="mr-2 h-4 w-4" /> Ajouter un produit
      </Button>
    </motion.div>
  );
};

export default ProductHeader;