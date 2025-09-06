import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { nom: 'Thieb', ventes: 45 },
  { nom: 'Yassa', ventes: 32 },
  { nom: 'Robe Afr.', ventes: 18 },
  { nom: 'Bissap', ventes: 67 },
  { nom: 'Chemise', ventes: 25 }
];

const TopProductsChart = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.8 }}
    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
  >
    <div className="flex items-center justify-between mb-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top Produits</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">Produits les plus vendus sur la période</p>
      </div>
    </div>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis type="number" stroke="#6B7280" />
          <YAxis dataKey="nom" type="category" stroke="#6B7280" width={80} />
          <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#F9FAFB' }} />
          <Bar dataKey="ventes" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </motion.div>
);

export default TopProductsChart;