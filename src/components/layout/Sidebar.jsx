// Sidebar.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Store, 
  Package, 
  BarChart3, 
  Users, 
  Settings,
  X,
  Activity,
  Warehouse,
  Tag
} from 'lucide-react';

const Sidebar = ({ onFermer, activiteActive, setSidebarOuverte }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const elementsNavigation = [
    { nom: 'Tableau de Bord', chemin: '/tableau-de-bord', icone: LayoutDashboard, description: "Vue d'ensemble des activités" },
    { nom: 'Point de Vente', chemin: '/point-de-vente', icone: ShoppingCart, description: 'Interface de caisse' },
    { nom: 'Gestion Activités', chemin: '/gestion-activites', icone: Activity, description: 'Gérer vos activités' },
    { nom: 'Gestion Produits', chemin: '/gestion-produits', icone: Package, description: 'Catalogue produits' },
    { nom: 'Gestion Catégories', chemin: '/gestion-categories', icone: Tag, description: 'Gestion des catégories' },
    { nom: 'Gestion Stock', chemin: '/gestion-stock', icone: Warehouse, description: 'Inventaire et stocks' },
    { nom: 'Rapports', chemin: '/rapports', icone: BarChart3, description: 'Analyses et statistiques' },
    { nom: 'Utilisateurs', chemin: '/gestion-utilisateurs', icone: Users, description: 'Gestion des utilisateurs' },
    { nom: 'Paramètres', chemin: '/parametres', icone: Settings, description: 'Configuration système' }
  ];

  const handleNavigation = (element) => {
    // Si on va vers Point de Vente : fermer / rétracter la sidebar.
    if (element.chemin === '/point-de-vente') {
      if (typeof setSidebarOuverte === 'function') {
        setSidebarOuverte(false);
      } else if (typeof onFermer === 'function') {
        onFermer();
      }
    }
    // Navigue ensuite (toujours)
    navigate(element.chemin);
  };

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      exit={{ x: -300 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="w-56 sm:w-64 lg:w-72 bg-white dark:bg-gray-800 shadow-xl border-r border-gray-200 dark:border-gray-700 flex flex-col h-full"
    >
      {/* header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Store className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">POS Multi</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Activités</p>
            </div>
          </div>

          <button
            onClick={() => (typeof setSidebarOuverte === 'function' ? setSidebarOuverte(false) : onFermer && onFermer())}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors lg:hidden"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {activiteActive && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center space-x-3">
              <img src={activiteActive.logo} alt={activiteActive.nom} className="w-8 h-8 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{activiteActive.nom}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{activiteActive.type}</p>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>
          </div>
        )}
      </div>

      {/* navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {elementsNavigation.map((element) => {
          const estActif = location.pathname === element.chemin;
          const Icone = element.icone;

          return (
            <button
              key={element.chemin}
              onClick={() => handleNavigation(element)}
              className={`
                group flex items-center space-x-3 px-4 py-3 rounded-lg w-full text-left transition-all duration-200
                ${estActif ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}
              `}
            >
              <Icone className={`w-5 h-5 ${estActif ? 'text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'}`} />
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${estActif ? 'text-white' : ''}`}>{element.nom}</p>
                <p className={`text-xs ${estActif ? 'text-purple-100' : 'text-gray-500 dark:text-gray-400'}`}>{element.description}</p>
              </div>
              {estActif && (
                <motion.div layoutId="activeIndicator" className="w-1 h-8 bg-white rounded-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <p className="text-xs font-medium text-green-700 dark:text-green-400">Système opérationnel</p>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Toutes les fonctionnalités sont disponibles</p>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
