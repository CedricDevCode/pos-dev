import React from "react";
import { motion } from "framer-motion";
import { DollarSign, ShoppingCart, BarChart3, Users, TrendingUp, ArrowUp, ArrowDown } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

const ReportKPIs = () => {
  const { obtenirStatistiques } = useApp();
  const statistiques = obtenirStatistiques();

  const kpis = [
    {
      title: "CA Total",
      value: `${statistiques?.chiffresAffairesAujourdhui?.toLocaleString() || 0} FCFA`,
      evolution: "+12.5%",
      evolutionValue: 12.5,
      Icon: DollarSign,
      color: "green",
      trend: "up",
    },
    {
      title: "Ventes",
      value: statistiques?.nombreVentesAujourdhui || 0,
      evolution: "+8",
      evolutionValue: 8,
      Icon: ShoppingCart,
      color: "blue",
      trend: "up",
    },
    {
      title: "Panier Moyen",
      value: `${
        statistiques?.nombreVentesAujourdhui > 0
          ? Math.round(
              statistiques.chiffresAffairesAujourdhui / statistiques.nombreVentesAujourdhui
            ).toLocaleString()
          : 0
      } FCFA`,
      evolution: "+5.2%",
      evolutionValue: 5.2,
      Icon: BarChart3,
      color: "purple",
      trend: "up",
    },
    {
      title: "Taux Conv.",
      value: "68.5%",
      evolution: "+2.1%",
      evolutionValue: 2.1,
      Icon: Users,
      color: "orange",
      trend: "up",
    },
  ];

  const colorClasses = {
    green: {
      bg: "bg-green-50 dark:bg-green-900/20",
      icon: "bg-green-500",
      text: "text-green-700 dark:text-green-300",
      trend: "text-green-600 dark:text-green-400",
    },
    blue: {
      bg: "bg-blue-50 dark:bg-blue-900/20",
      icon: "bg-blue-500",
      text: "text-blue-700 dark:text-blue-300",
      trend: "text-blue-600 dark:text-blue-400",
    },
    purple: {
      bg: "bg-purple-50 dark:bg-purple-900/20",
      icon: "bg-purple-500",
      text: "text-purple-700 dark:text-purple-300",
      trend: "text-purple-600 dark:text-purple-400",
    },
    orange: {
      bg: "bg-orange-50 dark:bg-orange-900/20",
      icon: "bg-orange-500",
      text: "text-orange-700 dark:text-orange-300",
      trend: "text-orange-600 dark:text-orange-400",
    },
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 p-4">
      {kpis.map((kpi, index) => {
        const colors = colorClasses[kpi.color];
        
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ 
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
            className={`${colors.bg} rounded-2xl p-6 cursor-pointer border border-transparent hover:border-${kpi.color}-200 dark:hover:border-${kpi.color}-800 transition-all duration-300 group`}
          >
            <div className="flex flex-col h-full">
              {/* Header avec icône et titre */}
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${colors.icon} bg-opacity-10 group-hover:bg-opacity-20 transition-all duration-300`}>
                  <kpi.Icon className={`w-5 h-5 ${colors.text}`} />
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${colors.trend} bg-white dark:bg-gray-800 bg-opacity-50`}>
                  {kpi.evolution}
                </span>
              </div>

              {/* Valeur principale */}
              <div className="mb-2">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {kpi.value}
                </h3>
              </div>

              {/* Titre et indicateur de tendance */}
              <div className="flex items-center justify-between mt-auto">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {kpi.title}
                </p>
                <div className={`flex items-center ${colors.trend}`}>
                  {kpi.trend === "up" ? (
                    <ArrowUp className="w-3 h-3 mr-1" />
                  ) : (
                    <ArrowDown className="w-3 h-3 mr-1" />
                  )}
                </div>
              </div>

              {/* Barre de progression */}
              <div className="mt-3">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full ${colors.icon}`}
                    style={{ width: `${Math.min(kpi.evolutionValue * 2, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ReportKPIs;