import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { useApp } from "@/hooks/useApp";
import { DollarSign, ShoppingCart, Package, Target } from "lucide-react";

import SalesChart from "@/components/dashboard/SalesChart";
import ActivityChart from "@/components/dashboard/ActivityChart";
import StockAlerts from "@/components/dashboard/StockAlerts";
import QuickActions from "@/components/dashboard/QuickActions";

const TableauDeBord = () => {
  const { obtenirStatistiques, activiteActive } = useApp();
  const [statistiques, setStatistiques] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    const charger = async () => {
      try {
        setChargement(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        const stats = obtenirStatistiques();
        setStatistiques(stats);
        setChargement(false);
      } catch (e) {
        console.error("Erreur:", e);
        setErreur("Impossible de charger les statistiques");
        setChargement(false);
      }
    };
    charger();
  }, [obtenirStatistiques, activiteActive]);

  const couleurClasses = {
    green: "text-green-600",
    blue: "text-blue-600",
    orange: "text-orange-600",
    purple: "text-purple-600",
  };

  const kpiCards = [
    {
      titre: "CA Aujourd'hui",
      valeur: `${statistiques?.chiffresAffairesAujourdhui?.toLocaleString() || 0} FCFA`,
      evolution: statistiques
        ? `${(
            ((statistiques.chiffresAffairesAujourdhui -
              statistiques.chiffresAffairesHier) /
              (statistiques.chiffresAffairesHier || 1)) *
            100
          ).toFixed(1)}% vs hier`
        : "",
      couleurEvo: "green",
      Icone: DollarSign,
      background: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      titre: "Ventes Aujourd'hui",
      valeur: statistiques?.nombreVentesAujourdhui || 0,
      evolution: statistiques
        ? `${statistiques.nombreVentesAujourdhui - statistiques.nombreVentesHier
          } vs hier`
        : "",
      couleurEvo: "blue",
      Icone: ShoppingCart,
      background: "bg-green-100 dark:bg-green-900/30",
    },
    {
      titre: "Alertes Stock",
      valeur: statistiques?.produitsEnRupture || 0,
      evolution: "Attention requise",
      couleurEvo: "orange",
      Icone: Package,
      background: "bg-orange-100 dark:bg-orange-900/30",
    },
    {
      titre: "Objectif Mensuel",
      valeur: `${statistiques?.progressionObjectif || 0}%`,
      evolution: `${statistiques?.caMois?.toLocaleString() || 0} / ${statistiques?.objectifMensuel?.toLocaleString() || 0} FCFA`,
      couleurEvo: "purple",
      Icone: Target,
      background: "bg-blue-100 dark:bg-blue-900/30",
    },
  ];

  if (chargement) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="loading-spinner w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (erreur) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-500 text-center">
          <p>{erreur}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Tableau de Bord - POS Multi-Activités</title>
      </Helmet>

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Tableau de Bord
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Vue d'ensemble pour {activiteActive?.nom || "toutes les activités"}.
        </p>
      </motion.div>

      {/* KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((card, i) => (
          <motion.div
            key={card.titre}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`${card.background} relative p-6 rounded-xl shadow-md hover:shadow-xl`}
          >
            <div className="absolute bottom-3 right-3 text-gray-400/40">
              <card.Icone className="w-12 h-12" />
            </div>
            <div className="relative z-10">
              <h4 className="text-sm font-medium text-gray-600">{card.titre}</h4>
              <p className="text-2xl font-bold text-gray-900 mt-2">{card.valeur}</p>
              <span className={`text-sm font-medium ${couleurClasses[card.couleurEvo]}`}>
                {card.evolution}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <motion.div className="lg:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <SalesChart />
        </motion.div>
        <motion.div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <ActivityChart data={statistiques?.ventesParActivite || []} />
        </motion.div>
      </div>

      {/* Actions rapides + Alertes */}
      <div className="grid grid-cols-1 lg:grid-cols- gap-6">
        <QuickActions />
        {statistiques?.produitsStockFaible?.length > 0 && (
          <StockAlerts produits={statistiques.produitsStockFaible} />
        )}
      </div>
    </div>
  );
};

export default TableauDeBord;
