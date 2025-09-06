import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Package, BarChart3, Users } from 'lucide-react';

const actions = [
  { label: 'Nouvelle Vente', Icon: ShoppingCart, to: '/point-de-vente', color: 'purple' },
  { label: 'Ajouter Produit', Icon: Package, to: '/gestion-produits', color: 'green' },
  { label: 'Voir Rapports', Icon: BarChart3, to: '/rapports', color: 'blue' },
  { label: 'Gérer Équipe', Icon: Users, to: '/gestion-utilisateurs', color: 'orange' },
];

const ActionButton = ({ label, Icon, to, color }) => {
  const colorClasses = {
    purple: 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-900/50',
    green: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50',
    blue: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50',
    orange: 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 hover:bg-orange-200 dark:hover:bg-orange-900/50',
  };

  return (
    <Link to={to} className={`flex flex-col items-center justify-center p-4 rounded-lg transition-colors ${colorClasses[color]}`}>
      <Icon className="w-8 h-8 mb-2" />
      <span className="text-sm font-medium text-center text-gray-800 dark:text-gray-200">{label}</span>
    </Link>
  );
};

const QuickActions = () => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 h-full">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Actions Rapides</h3>
    <div className="grid grid-cols-2 gap-4">
      {actions.map(action => (
        <ActionButton key={action.label} {...action} />
      ))}
    </div>
  </div>
);

export default QuickActions;