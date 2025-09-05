import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ShoppingCart, Package, Target, TrendingUp, Activity } from 'lucide-react';

const icons = {
  DollarSign, ShoppingCart, Package, Target
};

const StatCard = ({ titre, valeur, evolution, couleurEvo, Icone }) => {
  const IconComponent = icons[Icone] || Activity;
  const couleurMap = {
    green: 'text-green-600 dark:text-green-400',
    blue: 'text-blue-600 dark:text-blue-400',
    orange: 'text-orange-600 dark:text-orange-400',
    purple: 'text-purple-600 dark:text-purple-400'
  };

  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{titre}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{valeur}</p>
          <div className={`text-sm flex items-center mt-2 ${couleurMap[couleurEvo]}`}>
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>{evolution}</span>
          </div>
        </div>
        <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <IconComponent className={`w-6 h-6 ${couleurMap[couleurEvo]}`} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;