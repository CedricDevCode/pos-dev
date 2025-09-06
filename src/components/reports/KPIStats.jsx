import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, ShoppingCart, Package, Users, BarChart3, Activity } from 'lucide-react';

const StatCard = ({ delay, title, value, evolution, icon, gradient }) => {
  const Icon = icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="stat-card"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          {evolution && <p className="text-sm text-green-600 dark:text-green-400 flex items-center mt-1"><TrendingUp className="w-4 h-4 mr-1" />{evolution}</p>}
        </div>
        <div className={`w-12 h-12 ${gradient} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
};

const KPIStats = ({ stats }) => {
  const kpis = [
    { title: "CA Total", value: `${stats?.chiffresAffairesAujourdhui?.toLocaleString() || 0} FCFA`, evolution: "+12.5%", icon: DollarSign, gradient: "bg-gradient-to-r from-green-500 to-emerald-500" },
    { title: "Nombre de Ventes", value: stats?.nombreVentesAujourdhui || 0, evolution: "+8", icon: ShoppingCart, gradient: "bg-gradient-to-r from-blue-500 to-cyan-500" },
    { title: "Panier Moyen", value: `${stats?.nombreVentesAujourdhui > 0 ? Math.round((stats?.chiffresAffairesAujourdhui || 0) / stats.nombreVentesAujourdhui).toLocaleString() : 0} FCFA`, evolution: "+5.2%", icon: Package, gradient: "bg-gradient-to-r from-purple-500 to-pink-500" },
    { title: "Taux de Conversion", value: "68.5%", evolution: "+2.1%", icon: Users, gradient: "bg-gradient-to-r from-orange-500 to-red-500" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, index) => (
        <StatCard key={kpi.title} delay={0.2 + index * 0.1} {...kpi} />
      ))}
    </div>
  );
};

export default KPIStats;