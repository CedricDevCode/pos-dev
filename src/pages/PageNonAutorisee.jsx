import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Lock, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

/**
 * Page affichée lorsque l'utilisateur tente d'accéder à une ressource
 * pour laquelle il n'a pas les autorisations nécessaires.
 */
const PageNonAutorisee = () => {
  return (
    <>
      <Helmet>
        <title>Accès Refusé - POS</title>
        <meta name="description" content="Page indiquant un accès non autorisé." />
      </Helmet>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-center p-4">
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 120, damping: 10 }}
          className="bg-white dark:bg-gray-800 p-8 sm:p-12 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 max-w-lg w-full"
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <Lock className="h-10 w-10 text-red-500" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">
            Accès Refusé
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
            Désolé, vous n'avez pas les autorisations nécessaires pour accéder à cette page.
          </p>
          <Button asChild className="pos-button">
            <Link to="/tableau-de-bord">
              <Home className="mr-2 h-4 w-4" />
              Retourner au Tableau de Bord
            </Link>
          </Button>
        </motion.div>
      </div>
    </>
  );
};

export default PageNonAutorisee;