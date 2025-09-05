import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { nom: 'Thieboudienne', ventes: 45 },
    { nom: 'Yassa Poulet', ventes: 32 },
    { nom: 'Robe Africaine', ventes: 18 },
    { nom: 'Bissap', ventes: 67 },
    { nom: 'Chemise Homme', ventes: 25 }
];

const TopProductsChart = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold mb-4">Top Produits</h3>
        <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis type="number" />
                    <YAxis dataKey="nom" type="category" width={100} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.9)', border: 'none', borderRadius: '8px' }} />
                    <Bar dataKey="ventes" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    </div>
);

export default TopProductsChart;