import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { jour: 'Lun', ventes: 12, chiffresAffaires: 45000 },
  { jour: 'Mar', ventes: 19, chiffresAffaires: 67000 },
  { jour: 'Mer', ventes: 15, chiffresAffaires: 52000 },
  { jour: 'Jeu', ventes: 22, chiffresAffaires: 78000 },
  { jour: 'Ven', ventes: 28, chiffresAffaires: 95000 },
  { jour: 'Sam', ventes: 35, chiffresAffaires: 125000 },
  { jour: 'Dim', ventes: 18, chiffresAffaires: 63000 }
];

const SalesEvolutionChart = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.6 }}
    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
  >
    <div className="flex items-center justify-between mb-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Évolution des Ventes</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">Chiffre d'affaires et nombre de ventes</p>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-purple-500 rounded-full"></div><span className="text-sm text-gray-600 dark:text-gray-400">CA</span></div>
        <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-blue-500 rounded-full"></div><span className="text-sm text-gray-600 dark:text-gray-400">Ventes</span></div>
      </div>
    </div>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis dataKey="jour" stroke="#6B7280" />
          <YAxis yAxisId="left" stroke="#6B7280" />
          <YAxis yAxisId="right" orientation="right" stroke="#6B7280" />
          <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#F9FAFB' }} />
          <Line yAxisId="left" type="monotone" dataKey="chiffresAffaires" stroke="#8B5CF6" strokeWidth={3} dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }} name="Chiffre d'affaires (FCFA)" />
          <Line yAxisId="right" type="monotone" dataKey="ventes" stroke="#3B82F6" strokeWidth={3} dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }} name="Nombre de ventes" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </motion.div>
);

export default SalesEvolutionChart;