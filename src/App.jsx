import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import { AppProvider, useApp } from '@/contexts/AppContext';

// Importation des composants de layout
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Importation des pages
import TableauDeBord from '@/pages/TableauDeBord';
import PointDeVente from '@/pages/PointDeVente';
import GestionActivites from '@/pages/GestionActivites';
import GestionProduits from '@/pages/GestionProduits';
import GestionStock from '@/pages/GestionStock';
import Rapports from '@/pages/Rapports';
import GestionUtilisateurs from '@/pages/GestionUtilisateurs';
import Parametres from '@/pages/Parametres';
import Connexion from '@/pages/Connexion';
import GestionCategories from '@/pages/GestionCategories';
import PageNonAutorisee from '@/pages/PageNonAutorisee';
import GestionRetours from '@/pages/GestionRetours';
import Comptabilite from '@/pages/Comptabilite';

/**
 * MainLayout est le composant qui structure l'interface principale de l'application
 * pour les utilisateurs connectés. Il inclut la barre latérale et l'en-tête.
 */
const MainLayout = ({ children }) => {
  const { modeSombre } = useApp();
  const [sidebarOuverte, setSidebarOuverte] = useState(true);
  const [sidebarReduite, setSidebarReduite] = useState(false);
  const location = useLocation();

  // Applique le thème sombre/clair à l'élément racine du document
  useEffect(() => {
    if (modeSombre) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [modeSombre]);
  
  // Vérifie si la page actuelle est le point de vente pour ajuster le padding
  const isPosPage = location.pathname === '/point-de-vente';

  // Réduit la sidebar par défaut sur la page POS
  useEffect(() => {
    if (isPosPage) {
      setSidebarReduite(true);
    } else {
      setSidebarReduite(false);
    }
  }, [isPosPage]);


  // Fonction pour basculer l'état réduit de la sidebar
  const toggleSidebarReduite = () => {
    setSidebarReduite(!sidebarReduite);
  };
  
  return (
    <div className={`flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900 hide-scrollbar`}>
       <AnimatePresence>
        {sidebarOuverte && (
          <motion.div
            initial={{ width: sidebarReduite ? 80 : 320 }}
            animate={{ width: sidebarReduite ? 80 : 320 }}
            exit={{ width: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="flex-shrink-0 z-20"
          >
            <Sidebar onFermer={() => setSidebarOuverte(false)} reduite={sidebarReduite} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          onOuvrirSidebar={() => setSidebarOuverte(true)}
          sidebarOuverte={sidebarOuverte}
          sidebarReduite={sidebarReduite}
          toggleSidebarReduite={toggleSidebarReduite}
        />
        <main className={`flex-1 overflow-auto hide-scrollbar ${isPosPage ? 'p-0' : 'p-4 sm:p-6'}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
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
 * AnimatedRoutes gère le routage de l'application.
 * Il affiche un écran de chargement, la page de connexion ou les routes protégées
 * en fonction de l'état d'authentification de l'utilisateur.
 */
const AnimatedRoutes = () => {
  const { utilisateurConnecte, chargementInitial } = useApp();

  // Affiche un écran de chargement pendant l'initialisation des données
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

  // Définition des rôles autorisés pour chaque page
  const roles = {
    admin: 'administrateur',
    gestionnaire: 'gestionnaire',
    caissier: 'caissier',
    comptable: 'comptable',
  };

  return (
    <Routes>
      <Route path="/connexion" element={!utilisateurConnecte ? <Connexion /> : <Navigate to="/tableau-de-bord" replace />} />
      <Route path="/non-autorise" element={<PageNonAutorisee />} />
      
      <Route path="/*" element={utilisateurConnecte ? (
        <MainLayout>
          <Routes>
            <Route path="/" element={<Navigate to="/tableau-de-bord" replace />} />
            
            <Route path="/tableau-de-bord" element={<ProtectedRoute roles={[roles.admin, roles.gestionnaire, roles.caissier, roles.comptable]}><TableauDeBord /></ProtectedRoute>} />
            <Route path="/point-de-vente" element={<ProtectedRoute roles={[roles.admin, roles.caissier]}><PointDeVente /></ProtectedRoute>} />
            <Route path="/gestion-retours" element={<ProtectedRoute roles={[roles.admin, roles.gestionnaire]}><GestionRetours /></ProtectedRoute>} />
            <Route path="/gestion-activites" element={<ProtectedRoute roles={[roles.admin]}><GestionActivites /></ProtectedRoute>} />
            <Route path="/gestion-produits" element={<ProtectedRoute roles={[roles.admin, roles.gestionnaire]}><GestionProduits /></ProtectedRoute>} />
            <Route path="/gestion-categories" element={<ProtectedRoute roles={[roles.admin, roles.gestionnaire]}><GestionCategories /></ProtectedRoute>} />
            <Route path="/gestion-stock" element={<ProtectedRoute roles={[roles.admin, roles.gestionnaire]}><GestionStock /></ProtectedRoute>} />
            <Route path="/rapports" element={<ProtectedRoute roles={[roles.admin, roles.gestionnaire, roles.comptable]}><Rapports /></ProtectedRoute>} />
            <Route path="/comptabilite" element={<ProtectedRoute roles={[roles.admin, roles.comptable]}><Comptabilite /></ProtectedRoute>} />
            <Route path="/gestion-utilisateurs" element={<ProtectedRoute roles={[roles.admin]}><GestionUtilisateurs /></ProtectedRoute>} />
            <Route path="/parametres" element={<ProtectedRoute roles={[roles.admin]}><Parametres /></ProtectedRoute>} />
            
            <Route path="*" element={<Navigate to="/tableau-de-bord" replace />} />
          </Routes>
        </MainLayout>
      ) : <Navigate to="/connexion" replace />} />
    </Routes>
  );
};

/**
 * Composant racine de l'application.
 * Il enveloppe l'ensemble de l'application avec le AppProvider pour la gestion de l'état global.
 */
function App() {
  return (
    <AppProvider>
        <Helmet>
            <title>POS Multi-Activités - Gestion Complète</title>
            <meta name="description" content="Système de point de vente multi-activités avec gestion des stocks, rapports en temps réel et interface moderne." />
        </Helmet>
        <Router>
            <AnimatedRoutes />
        </Router>
        <Toaster />
    </AppProvider>
  );
}

export default App;