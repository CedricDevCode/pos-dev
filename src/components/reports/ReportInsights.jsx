import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Package, BarChart3 } from 'lucide-react';

const InsightCard = ({ icon: Icon, title, text, color }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
    <div className="flex items-center space-x-2 mb-2">
      <Icon className={`w-5 h-5 text-${color}-500`} />
      <span className="font-medium text-gray-900 dark:text-white">{title}</span>
    </div>
    <p className="text-sm text-gray-600 dark:text-gray-400">{text}</p>
  </div>
);

const ReportInsights = ({ stats }) => {
  const insights = [
    { icon: TrendingUp, title: "Tendance Positive", text: "Vos ventes ont augmenté de 12.5% par rapport à la période précédente. Continuez sur cette lancée !", color: "green" },
    { icon: Package, title: "Stock à Surveiller", text: `${stats?.produitsEnRupture || 0} produit${(stats?.produitsEnRupture || 0) > 1 ? 's' : ''} en stock faible. Pensez à réapprovisionner.`, color: "orange" },
    { icon: BarChart3, title: "Opportunité", text: "Le weekend génère 40% de vos ventes. Considérez des promotions spéciales pour ces jours.", color: "blue" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.0 }}
      className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl border border-purple-200 dark:border-purple-800 p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📊 Insights et Recommandations</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {insights.map((insight) => (
          <InsightCard key={insight.title} {...insight} />
        ))}
      </div>
    </motion.div>
  );
};

export default ReportInsights;