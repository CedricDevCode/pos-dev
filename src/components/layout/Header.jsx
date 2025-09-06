import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  Sun, 
  Moon, 
  Bell, 
  Search,
  ChevronDown,
  LogOut,
  User,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  AlertTriangle,
  Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/components/ui/use-toast';
import ProfileModal from '@/components/auth/ProfileModal';

const Header = ({ 
  onOuvrirSidebar, 
  sidebarOuverte,
  sidebarReduite,
  toggleSidebarReduite
}) => {
  const { 
    deconnecterUtilisateur, 
    activites, 
    changerActiviteActive, 
    activiteActive, 
    utilisateurConnecte, 
    modeSombre, 
    basculerModeSombre,
    produits
  } = useApp();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [menuUtilisateurOuvert, setMenuUtilisateurOuvert] = useState(false);
  const [menuActivitesOuvert, setMenuActivitesOuvert] = useState(false);
  const [menuNotificationsOuvert, setMenuNotificationsOuvert] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const gererDeconnexion = () => {
    deconnecterUtilisateur();
    toast({
      title: "👋 À bientôt !",
      description: "Vous avez été déconnecté avec succès.",
      className: "toast-success"
    });
  };

  const changerActivite = (activite) => {
    changerActiviteActive(activite);
    setMenuActivitesOuvert(false);
    toast({
      title: "🔄 Activité changée",
      description: `Vous travaillez maintenant sur ${activite.nom}`,
      className: "toast-success"
    });
  };

  const notifications = useMemo(() => {
    if (!activiteActive) return [];
    return produits
      .filter(p => p.activiteId === activiteActive.id && p.stock <= p.stockMin)
      .map(p => ({
        id: p.id,
        type: 'stock',
        message: `Stock faible pour ${p.nom}`,
        details: `Stock restant: ${p.stock} (min: ${p.stockMin})`
      }));
  }, [produits, activiteActive]);

  const closeAllMenus = () => {
    setMenuUtilisateurOuvert(false);
    setMenuActivitesOuvert(false);
    setMenuNotificationsOuvert(false);
  };

  const handleProfileClick = () => {
    closeAllMenus();
    setProfileModalOpen(true);
  };
  
  const hasRole = (roles) => roles.includes(utilisateurConnecte.role);

  return (
    <>
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 md:space-x-4">
            {!sidebarOuverte && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onOuvrirSidebar}
              >
                <Menu className="w-5 h-5" />
              </Button>
            )}
            {sidebarOuverte && (
               <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSidebarReduite}
                  className="hidden lg:inline-flex"
                >
                  {sidebarReduite ? <ChevronsRight className="w-5 h-5" /> : <ChevronsLeft className="w-5 h-5" />}
               </Button>
            )}

            <div className="relative">
              <button
                onClick={() => setMenuActivitesOuvert(!menuActivitesOuvert)}
                className="flex items-center space-x-2 md:space-x-3 px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                {activiteActive ? (
                  <>
                    <img
                      src={activiteActive.logo}
                      alt={activiteActive.nom}
                      className="w-6 h-6 rounded object-cover"
                    />
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {activiteActive.nom}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        {activiteActive.type}
                      </p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </>
                ) : (
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Sélectionner</span>
                )}
              </button>

              <AnimatePresence>
              {menuActivitesOuvert && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50"
                >
                  <div className="p-2">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3 py-2">
                      Changer d'activité
                    </p>
                    {activites.map((activite) => (
                      <button
                        key={activite.id}
                        onClick={() => changerActivite(activite)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                          activite.id === activiteActive?.id
                            ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <img
                          src={activite.logo}
                          alt={activite.nom}
                          className="w-8 h-8 rounded object-cover"
                        />
                        <div className="flex-1 text-left">
                          <p className="text-sm font-medium">{activite.nom}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                            {activite.type}
                          </p>
                        </div>
                        {activite.id === activiteActive?.id && (
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
              </AnimatePresence>
            </div>

            <div className="hidden lg:flex items-center space-x-2 bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2 min-w-[300px]">
              <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher produits, ventes, clients..."
                className="flex-1 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
                onClick={() => toast({
                  title: "🔍 Recherche",
                  description: "🚧 Cette fonctionnalité n'est pas encore implémentée—mais n'hésitez pas à la demander dans votre prochain prompt ! 🚀",
                  className: "toast-warning"
                })}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={basculerModeSombre}
              className="relative"
            >
              {modeSombre ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
            </Button>

            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setMenuNotificationsOuvert(!menuNotificationsOuvert)}
              >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && <div className="notification-dot">{notifications.length}</div>}
              </Button>
              <AnimatePresence>
                {menuNotificationsOuvert && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50"
                  >
                    <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                      <h4 className="font-semibold text-gray-800 dark:text-white">Notifications</h4>
                    </div>
                    <div className="max-h-80 overflow-y-auto p-2">
                      {notifications.length > 0 ? (
                        notifications.map(notif => (
                          <Link to="/gestion-stock" onClick={closeAllMenus} key={notif.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                              <AlertTriangle className="w-4 h-4 text-orange-500" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{notif.message}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{notif.details}</p>
                            </div>
                          </Link>
                        ))
                      ) : (
                        <div className="text-center p-6">
                          <Package className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600" />
                          <p className="mt-2 text-sm text-gray-500">Aucune nouvelle notification</p>
                        </div>
                      )}
                    </div>
                     {hasRole(['administrateur']) && (
                        <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                            <Button variant="link" size="sm" className="w-full" onClick={() => { closeAllMenus(); navigate('/parametres'); }}>
                            Gérer les notifications
                            </Button>
                        </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative">
              <button
                onClick={() => setMenuUtilisateurOuvert(!menuUtilisateurOuvert)}
                className="flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <img
                  src={utilisateurConnecte.avatar}
                  alt={utilisateurConnecte.nom}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {utilisateurConnecte.nom}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {utilisateurConnecte.role}
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>

              <AnimatePresence>
              {menuUtilisateurOuvert && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50"
                >
                  <div className="p-2">
                    <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {utilisateurConnecte.nom}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {utilisateurConnecte.email}
                      </p>
                    </div>
                    
                    <button onClick={handleProfileClick} className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Mon Profil</span>
                    </button>
                    
                    {hasRole(['administrateur']) && (
                        <Link to="/parametres" onClick={closeAllMenus} className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <Settings className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Paramètres</span>
                        </Link>
                    )}
                    
                    <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                      <button
                        onClick={gererDeconnexion}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-red-600 dark:text-red-400"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">Se déconnecter</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {(menuUtilisateurOuvert || menuActivitesOuvert || menuNotificationsOuvert) && (
          <div
            className="fixed inset-0 z-40"
            onClick={closeAllMenus}
          />
        )}
      </header>
      <ProfileModal 
        isOpen={profileModalOpen} 
        onClose={() => setProfileModalOpen(false)}
      />
    </>
  );
};

export default Header;