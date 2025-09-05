// Import des dépendances React et des bibliothèques nécessaires
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import { AppProvider } from '@/contexts/AppContext';
import { useApp } from '@/hooks/useApp';
import { ArrowLeft } from 'lucide-react';

// Import des composants d'interface
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import BandeauCaisse from '@/components/layout/BandeauCaisse'; // Import du nouveau composant

// Import des pages de l'application
import TableauDeBord from '@/pages/TableauDeBord';
import GestionActivites from '@/pages/GestionActivites';
import GestionProduits from '@/pages/GestionProduits';
import GestionCategories from '@/pages/GestionCategories';
import GestionStock from '@/pages/GestionStock';
import Rapports from '@/pages/Rapports';
import GestionUtilisateurs from '@/pages/GestionUtilisateurs';
import Parametres from '@/pages/Parametres';
import Connexion from '@/pages/Connexion';
import PointDeVente from '@/pages/PointDeVente';

/**
 * Composant MainLayout
 */
const MainLayout = ({ children, sidebarOuverte, setSidebarOuverte }) => {
  const { modeSombre, utilisateurConnecte, activiteActive, basculerModeSombre } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  // Applique le mode sombre
  useEffect(() => {
    if (modeSombre) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [modeSombre]);

  // Ferme automatiquement la sidebar en mode Point de Vente
  useEffect(() => {
    if (location.pathname === "/point-de-vente") {
      setSidebarOuverte(false);
    } else {
      setSidebarOuverte(true);
    }
  }, [location.pathname, setSidebarOuverte]);

  return (
    <div className={`flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900`}>
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOuverte && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="flex-shrink-0"
          >
            <Sidebar onFermer={() => setSidebarOuverte(false)} activiteActive={activiteActive} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contenu */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header uniquement si pas en mode Point de Vente */}
        {location.pathname !== "/point-de-vente" && (
          <Header
            onOuvrirSidebar={() => setSidebarOuverte(true)}
            sidebarOuverte={sidebarOuverte}
            modeSombre={modeSombre}
            basculerModeSombre={basculerModeSombre}
            utilisateur={utilisateurConnecte}
            activiteActive={activiteActive}
          />
        )}

        {/* Bandeau de caisse global */}
        <BandeauCaisse />

        <main className="flex-1 overflow-y-auto p-6 pt-16"> {/* Ajout de pt-16 pour l'espace du bandeau */}
          {/* Bouton retour visible uniquement dans Point de Vente */}
          {location.pathname === "/point-de-vente" && (
            <button
              onClick={() => {
                setSidebarOuverte(true);
                navigate("/tableau-de-bord");
              }}
              className="flex items-center space-x-2 px-4 py-2 mb-4 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Retour au Tableau de bord</span>
            </button>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

/**
 * Composant AnimatedRoutes
 */
const AnimatedRoutes = ({ sidebarOuverte, setSidebarOuverte }) => {
  const { utilisateurConnecte, chargementInitial } = useApp();

  if (chargementInitial) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center text-white"
        >
          <div className="loading-spinner w-16 h-16 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold mb-2">Initialisation du POS</h2>
          <p className="text-purple-200">Chargement des données en cours...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/connexion"
        element={!utilisateurConnecte ? <Connexion /> : <Navigate to="/tableau-de-bord" replace />}
      />

      <Route
        path="/*"
        element={
          utilisateurConnecte ? (
            <MainLayout sidebarOuverte={sidebarOuverte} setSidebarOuverte={setSidebarOuverte}>
              <Routes>
                <Route path="/" element={<Navigate to="/tableau-de-bord" replace />} />
                <Route path="/tableau-de-bord" element={<TableauDeBord />} />
                <Route path="/point-de-vente" element={<PointDeVente />} />
                <Route path="/gestion-activites" element={<GestionActivites />} />
                <Route path="/gestion-produits" element={<GestionProduits />} />
                <Route path="/gestion-categories" element={<GestionCategories />} />
                <Route path="/gestion-stock" element={<GestionStock />} />
                <Route path="/rapports" element={<Rapports />} />
                <Route path="/gestion-utilisateurs" element={<GestionUtilisateurs />} />
                <Route path="/parametres" element={<Parametres />} />
              </Routes>
            </MainLayout>
          ) : (
            <Navigate to="/connexion" replace />
          )
        }
      />
    </Routes>
  );
};

/**
 * Composant principal App
 */
function App() {
  const [sidebarOuverte, setSidebarOuverte] = useState(true);

  return (
    <AppProvider>
      <Helmet>
        <title>POS Multi-Activités - Gestion Complète</title>
        <meta
          name="description"
          content="Système de point de vente multi-activités avec gestion des stocks, rapports en temps réel et interface moderne."
        />
      </Helmet>

      <Router>
        <AnimatedRoutes sidebarOuverte={sidebarOuverte} setSidebarOuverte={setSidebarOuverte} />
      </Router>

      <Toaster />
    </AppProvider>
  );
}

export default App;