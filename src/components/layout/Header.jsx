import React from 'react';
import { motion } from 'framer-motion';
import { 
  Menu, 
  Sun, 
  Moon, 
  Bell, 
  Search,
  ChevronDown,
  LogOut,
  User,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/hooks/useApp';
import { useToast } from '@/components/ui/use-toast';

const Header = ({ 
  onOuvrirSidebar, 
  sidebarOuverte, 
  modeSombre, 
  basculerModeSombre, 
  utilisateur, 
  activiteActive 
}) => {
  const { deconnecterUtilisateur, activites, changerActiviteActive } = useApp();
  const { toast } = useToast();
  const [menuUtilisateurOuvert, setMenuUtilisateurOuvert] = React.useState(false);
  const [menuActivitesOuvert, setMenuActivitesOuvert] = React.useState(false);

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

  return (
    // Changement principal: suppression de fixed et ajustement des styles
    <header className="sticky top-0 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-4 py-2 h-14 z-50">
      <div className="h-full flex items-center justify-between max-w-[1400px] mx-auto">
        <div className="flex items-center space-x-3">
          {!sidebarOuverte && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onOuvrirSidebar}
              className="lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </Button>
          )}

          <div className="relative">
            <button
              onClick={() => setMenuActivitesOuvert(!menuActivitesOuvert)}
              className="flex items-center space-x-3 px-3 py-1.5 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              {activiteActive && (
                <>
                  <img src={activiteActive.logo} alt={activiteActive.nom} className="w-6 h-6 rounded object-cover" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{activiteActive.nom}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{activiteActive.type}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </>
              )}
            </button>

            {menuActivitesOuvert && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
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
                      <img src={activite.logo} alt={activite.nom} className="w-8 h-8 rounded object-cover" />
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium">{activite.nom}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{activite.type}</p>
                      </div>
                      {activite.id === activiteActive?.id && <div className="w-2 h-2 bg-purple-500 rounded-full" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-2 bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-1.5 min-w-[300px]">
            <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher produits, ventes, clients..."
              className="flex-1 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
              onClick={() => toast({
                title: "🔍 Recherche",
                description: "🚧 Fonctionnalité non implémentée pour le moment.",
                className: "toast-warning"
              })}
            />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" onClick={basculerModeSombre}>
            {modeSombre ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />}
          </Button>

          <Button variant="ghost" size="icon" onClick={() => toast({ title: "🔔 Notifications", description: "Non implémenté", className: "toast-warning" })}>
            <Bell className="w-5 h-5" />
            <div className="notification-dot">3</div>
          </Button>

          <div className="relative">
            <button onClick={() => setMenuUtilisateurOuvert(!menuUtilisateurOuvert)} className="flex items-center space-x-3 px-2 py-1 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <img src={utilisateur.avatar} alt={utilisateur.nom} className="w-8 h-8 rounded-full object-cover" />
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{utilisateur.nom}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{utilisateur.role}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>

            {menuUtilisateurOuvert && (
              <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
                <div className="p-2">
                  <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{utilisateur.nom}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{utilisateur.email}</p>
                  </div>

                  <button onClick={() => { setMenuUtilisateurOuvert(false); toast({ title: "👤 Profil", description: "Non implémenté", className: "toast-warning" }); }} className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Mon Profil</span>
                  </button>

                  <button onClick={() => { setMenuUtilisateurOuvert(false); toast({ title: "⚙️ Paramètres", description: "Non implémenté", className: "toast-warning" }); }} className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <Settings className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Paramètres</span>
                  </button>

                  <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                    <button onClick={gererDeconnexion} className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-red-600 dark:text-red-400">
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">Se déconnecter</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* fond cliquable pour fermer menus */}
      {(menuUtilisateurOuvert || menuActivitesOuvert) && (
        <div className="fixed inset-0 z-40" onClick={() => { setMenuUtilisateurOuvert(false); setMenuActivitesOuvert(false); }} />
      )}
    </header>
  );
};

export default Header;