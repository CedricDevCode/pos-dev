import React from 'react';
import { motion } from 'framer-motion';
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { nom: 'Plats', valeur: 45, couleur: '#8B5CF6' },
  { nom: 'Boissons', valeur: 25, couleur: '#3B82F6' },
  { nom: 'Vêtements F.', valeur: 20, couleur: '#10B981' },
  { nom: 'Vêtements H.', valeur: 15, couleur: '#F59E0B' },
  { nom: 'Services', valeur: 10, couleur: '#EF4444' }
];

const CategoryDistributionChart = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.7 }}
    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
  >
    <div className="flex items-center justify-between mb-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Ventes par Catégorie</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">Répartition des ventes</p>
      </div>
    </div>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} fill="#8884d8" dataKey="valeur" paddingAngle={5} label={({ nom, percent }) => `${nom} ${(percent * 100).toFixed(0)}%`}>
            {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.couleur} />)}
          </Pie>
          <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#F9FAFB' }} />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  </motion.div>
);

export default CategoryDistributionChart;