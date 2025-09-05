import React from 'react';
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
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold mb-4">Évolution des Ventes</h3>
        <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="jour" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.9)', border: 'none', borderRadius: '8px' }} />
                    <Line yAxisId="left" type="monotone" dataKey="chiffresAffaires" name="CA (FCFA)" stroke="#8B5CF6" strokeWidth={2} />
                    <Line yAxisId="right" type="monotone" dataKey="ventes" name="Ventes" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    </div>
);

export default SalesEvolutionChart;