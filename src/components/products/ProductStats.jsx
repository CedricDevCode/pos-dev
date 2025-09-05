import React from 'react';
import { motion } from 'framer-motion';
import { Package, Eye, AlertTriangle, X } from 'lucide-react';

const ProductStats = ({ produits }) => {
  const statistiques = {
    total: produits.length,
    actifs: produits.filter(p => p.actif).length,
    stockFaible: produits.filter(p => p.stock <= p.stockMin && p.stock > 0).length,
    rupture: produits.filter(p => p.stock === 0).length
  };

  const statCards = [
    { 
      title: 'Total Produits', 
      value: statistiques.total, 
      Icon: Package, 
      color: 'blue',
      bgColor: 'bg-blue-500',
      gradient: 'from-blue-500 to-blue-400'
    },
    { 
      title: 'Produits Actifs', 
      value: statistiques.actifs, 
      Icon: Eye, 
      color: 'green',
      bgColor: 'bg-green-500',
      gradient: 'from-green-500 to-green-400'
    },
    { 
      title: 'Stock Faible', 
      value: statistiques.stockFaible, 
      Icon: AlertTriangle, 
      color: 'orange',
      bgColor: 'bg-orange-500',
      gradient: 'from-orange-500 to-orange-400'
    },
    { 
      title: 'En Rupture', 
      value: statistiques.rupture, 
      Icon: X, 
      color: 'red',
      bgColor: 'bg-red-500',
      gradient: 'from-red-500 to-red-400'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {statCards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
            </div>
            <div className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center`}>
              <card.Icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// EXPORT PAR DÉFAUT AJOUTÉ ICI
export default ProductStats;