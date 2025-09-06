import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  Tag,
  Undo,
  Calculator
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const Sidebar = ({ onFermer, reduite }) => {
  const location = useLocation();
  const { utilisateurConnecte } = useApp();

  const roles = {
    admin: 'administrateur',
    gestionnaire: 'gestionnaire',
    caissier: 'caissier',
    comptable: 'comptable',
  };

  const elementsNavigation = [
    { nom: 'Tableau de Bord', chemin: '/tableau-de-bord', icone: LayoutDashboard, description: 'Vue d\'ensemble', roles: [roles.admin, roles.gestionnaire, roles.caissier, roles.comptable] },
    { nom: 'Point de Vente', chemin: '/point-de-vente', icone: ShoppingCart, description: 'Interface de caisse', roles: [roles.admin, roles.caissier] },
    { nom: 'Retours', chemin: '/gestion-retours', icone: Undo, description: 'Gérer les retours', roles: [roles.admin, roles.gestionnaire] },
    { nom: 'Gestion Activités', chemin: '/gestion-activites', icone: Activity, description: 'Gérer vos activités', roles: [roles.admin] },
    { nom: 'Gestion Produits', chemin: '/gestion-produits', icone: Package, description: 'Catalogue produits', roles: [roles.admin, roles.gestionnaire] },
    { nom: 'Catégories', chemin: '/gestion-categories', icone: Tag, description: 'Organiser produits', roles: [roles.admin, roles.gestionnaire] },
    { nom: 'Gestion Stock', chemin: '/gestion-stock', icone: Warehouse, description: 'Inventaire et stocks', roles: [roles.admin, roles.gestionnaire] },
    { nom: 'Rapports', chemin: '/rapports', icone: BarChart3, description: 'Analyses et stats', roles: [roles.admin, roles.gestionnaire, roles.comptable] },
    { nom: 'Comptabilité', chemin: '/comptabilite', icone: Calculator, description: 'Suivi financier', roles: [roles.admin, roles.comptable] },
    { nom: 'Utilisateurs', chemin: '/gestion-utilisateurs', icone: Users, description: 'Gestion des accès', roles: [roles.admin] },
    { nom: 'Paramètres', chemin: '/parametres', icone: Settings, description: 'Configuration', roles: [roles.admin] }
  ];

  const elementsNavigationFiltres = elementsNavigation.filter(element => 
    element.roles.includes(utilisateurConnecte.role)
  );
  
  const variantsTitre = {
    reduit: { opacity: 0, width: 0, marginLeft: 0, marginRight: 0 },
    etendu: { opacity: 1, width: 'auto', marginLeft: '0.75rem', marginRight: '0.75rem' }
  };
  
  return (
    <motion.div
      className="bg-white dark:bg-gray-800 shadow-xl border-r border-gray-200 dark:border-gray-700 flex flex-col h-full overflow-hidden"
    >
      <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Store className="w-6 h-6 text-white" />
          </div>
          <AnimatePresence>
          {!reduite && (
            <motion.div
              variants={variantsTitre}
              initial="reduit"
              animate="etendu"
              exit="reduit"
              transition={{ ease: "easeInOut", duration: 0.2 }}
              className="overflow-hidden whitespace-nowrap"
            >
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">POS Multi</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Activités</p>
            </motion.div>
          )}
          </AnimatePresence>
        </div>
        <button
          onClick={onFermer}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors lg:hidden"
        >
          <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {elementsNavigationFiltres.map((element) => {
          const estActif = location.pathname.startsWith(element.chemin);
          const Icone = element.icone;

          return (
            <Link
              key={element.chemin}
              to={element.chemin}
              title={element.nom}
              className={`
                group flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                ${estActif 
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }
                ${reduite ? 'justify-center' : ''}
              `}
            >
              <Icone className={`w-6 h-6 flex-shrink-0 ${estActif ? 'text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'}`} />
              <AnimatePresence>
                {!reduite && (
                  <motion.div 
                    variants={variantsTitre}
                    initial="reduit"
                    animate="etendu"
                    exit="reduit"
                    transition={{ ease: "easeInOut", duration: 0.2 }}
                    className="flex-1 min-w-0 overflow-hidden whitespace-nowrap"
                  >
                    <p className={`text-sm font-medium ${estActif ? 'text-white' : ''}`}>
                      {element.nom}
                    </p>
                    <p className={`text-xs ${estActif ? 'text-purple-100' : 'text-gray-500 dark:text-gray-400'}`}>
                      {element.description}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
         <AnimatePresence>
          {!reduite && (
            <motion.div
              variants={variantsTitre}
              initial="reduit"
              animate="etendu"
              exit="reduit"
              transition={{ ease: "easeInOut", duration: 0.2 }}
              className="overflow-hidden whitespace-nowrap"
            >
              <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-xs font-medium text-green-700 dark:text-green-400">
                    Système opérationnel
                  </p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Toutes les fonctionnalités sont disponibles
                </p>
              </div>
            </motion.div>
          )}
          </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Sidebar;