import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { nom: 'Plats', valeur: 45, couleur: '#8B5CF6' },
    { nom: 'Boissons', valeur: 25, couleur: '#3B82F6' },
    { nom: 'Vêtements', valeur: 20, couleur: '#10B981' },
    { nom: 'Services', valeur: 10, couleur: '#F59E0B' },
];

const CategoryDistributionChart = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold mb-4">Ventes par Catégorie</h3>
        <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie data={data} cx="50%" cy="50%" outerRadius={80} dataKey="valeur" label>
                        {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.couleur} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.9)', border: 'none', borderRadius: '8px' }} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    </div>
);

export default CategoryDistributionChart;