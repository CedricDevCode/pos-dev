import React from 'react';
import { motion } from 'framer-motion';
import { Package, AlertTriangle, TrendingDown, BarChart3 } from 'lucide-react';

const StockStats = ({ produits }) => {
  const statistiques = {
    total: produits.length,
    stockFaible: produits.filter(p => p.stock <= p.stockMin && p.stock > 0).length,
    rupture: produits.filter(p => p.stock === 0).length,
    valeurStock: produits.reduce((total, p) => total + (p.stock * p.cout), 0)
  };

  const statCards = [
    { title: 'Produits en Stock', value: statistiques.total, Icon: Package, color: 'blue' },
    { title: 'Alertes Stock', value: statistiques.stockFaible, Icon: AlertTriangle, color: 'orange' },
    { title: 'En Rupture', value: statistiques.rupture, Icon: TrendingDown, color: 'red' },
    { title: 'Valeur du Stock', value: `${statistiques.valeurStock.toLocaleString()} FCFA`, Icon: BarChart3, color: 'green' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {statCards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="stat-card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
            </div>
            <div className={`w-12 h-12 bg-gradient-to-r from-${card.color}-500 to-${card.color}-400 rounded-lg flex items-center justify-center`}>
              <card.Icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StockStats;