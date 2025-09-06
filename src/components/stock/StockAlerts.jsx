import React from 'react';
import { AlertCircle, PackageX, ChevronsRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const StockAlerts = ({ produits, onReapprovisionner }) => {
  const produitsEnFaibleStock = produits.filter(p => p.stock > 0 && p.stock <= p.stockMin);
  const produitsEnRupture = produits.filter(p => p.stock === 0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 },
  };

  if (produitsEnFaibleStock.length === 0 && produitsEnRupture.length === 0) {
    return null; // Ne rien afficher si pas d'alertes
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid gap-4 md:grid-cols-2"
    >
      {produitsEnRupture.length > 0 && (
        <motion.div variants={itemVariants}>
          <Alert variant="destructive">
            <PackageX className="h-4 w-4" />
            <AlertTitle>Produits en rupture de stock ({produitsEnRupture.length})</AlertTitle>
            <AlertDescription>
              <ul className="mt-2 space-y-1 text-sm">
                {produitsEnRupture.slice(0, 3).map(p => (
                  <li key={p.id} className="flex justify-between items-center">
                    <span>{p.nom}</span>
                    <Button variant="link" size="sm" className="h-auto p-0 text-destructive" onClick={() => onReapprovisionner(p)}>
                      Réapprovisionner <ChevronsRight className="h-3 w-3 ml-1"/>
                    </Button>
                  </li>
                ))}
                {produitsEnRupture.length > 3 && (
                   <li className="text-xs text-gray-500 dark:text-gray-400 pt-1">
                     et {produitsEnRupture.length - 3} autres...
                   </li>
                )}
              </ul>
            </AlertDescription>
          </Alert>
        </motion.div>
      )}
      
      {produitsEnFaibleStock.length > 0 && (
        <motion.div variants={itemVariants}>
          <Alert variant="warning">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Produits en stock faible ({produitsEnFaibleStock.length})</AlertTitle>
            <AlertDescription>
              <ul className="mt-2 space-y-1 text-sm">
                {produitsEnFaibleStock.slice(0, 3).map(p => (
                   <li key={p.id} className="flex justify-between items-center">
                   <span>{p.nom} <span className="text-xs text-yellow-600">({p.stock} restants)</span></span>
                   <Button variant="link" size="sm" className="h-auto p-0 text-yellow-700 dark:text-yellow-400" onClick={() => onReapprovisionner(p)}>
                     Réapprovisionner <ChevronsRight className="h-3 w-3 ml-1"/>
                   </Button>
                 </li>
                ))}
                {produitsEnFaibleStock.length > 3 && (
                  <li className="text-xs text-gray-500 dark:text-gray-400 pt-1">
                    et {produitsEnFaibleStock.length - 3} autres...
                  </li>
                )}
              </ul>
            </AlertDescription>
          </Alert>
        </motion.div>
      )}
    </motion.div>
  );
};

export default StockAlerts;