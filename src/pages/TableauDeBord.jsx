
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useApp } from '@/contexts/AppContext';

import StatCard from '@/components/dashboard/StatCard';
import SalesChart from '@/components/dashboard/SalesChart';
import ActivityChart from '@/components/dashboard/ActivityChart';
import StockAlerts from '@/components/dashboard/StockAlerts';
import QuickActions from '@/components/dashboard/QuickActions';

const TableauDeBord = () => {
  const { obtenirStatistiques, activiteActive } = useApp();
  const [statistiques, setStatistiques] = useState(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    const chargerStatistiques = async () => {
      try {
        setChargement(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const stats = obtenirStatistiques();
        setStatistiques(stats);
        
        setChargement(false);
      } catch (error) {
        console.error('Erreur de chargement des statistiques:', error);
        setChargement(false);
      }
    };

    chargerStatistiques();
  }, [obtenirStatistiques, activiteActive]);

  if (chargement) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="loading-spinner w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const kpiCards = [
    {
      titre: "CA Aujourd'hui",
      valeur: `${statistiques?.chiffresAffairesAujourdhui?.toLocaleString() || 0} FCFA`,
      evolution: '+12.5% vs hier',
      couleurEvo: 'green',
      Icone: 'DollarSign'
    },
    {
      titre: "Ventes Aujourd'hui",
      valeur: statistiques?.nombreVentesAujourdhui || 0,
      evolution: '+8 vs hier',
      couleurEvo: 'blue',
      Icone: 'ShoppingCart'
    },
    {
      titre: 'Alertes Stock',
      valeur: statistiques?.produitsEnRupture || 0,
      evolution: 'Attention requise',
      couleurEvo: 'orange',
      Icone: 'Package'
    },
    {
      titre: 'Objectif Mensuel',
      valeur: '68%',
      evolution: '2.1M / 3M FCFA',
      couleurEvo: 'purple',
      Icone: 'Target'
    }
  ];

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Tableau de Bord - POS Multi-Activités</title>
        <meta name="description" content="Vue d'ensemble de vos activités commerciales avec statistiques en temps réel, graphiques de performance et indicateurs clés." />
      </Helmet>

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tableau de Bord</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Vue d'ensemble pour {activiteActive?.nom || 'toutes les activités'}.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((card, index) => (
          <motion.div
            key={card.titre}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatCard {...card} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <motion.div
          className="lg:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <SalesChart />
        </motion.div>
        <motion.div
          className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <ActivityChart data={statistiques?.ventesParActivite || []} />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <QuickActions />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          {statistiques?.produitsStockFaible?.length > 0 && (
            <StockAlerts produits={statistiques.produitsStockFaible} />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default TableauDeBord;
