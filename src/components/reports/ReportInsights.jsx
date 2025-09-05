import React from 'react';
import { TrendingUp, Package, BarChart3 } from 'lucide-react';
import { useApp } from '@/hooks/useApp';

const ReportInsights = () => {
    const { obtenirStatistiques } = useApp();
    const stats = obtenirStatistiques();

    const insights = [
        {
            title: "Tendance Positive", Icon: TrendingUp, color: "green",
            text: `Vos ventes ont augmenté de 12.5% par rapport à la période précédente. Continuez sur cette lancée !`
        },
        {
            title: "Stock à Surveiller", Icon: Package, color: "orange",
            text: `${stats.produitsEnRupture} produit(s) en stock faible. Pensez à réapprovisionner.`
        },
        {
            title: "Opportunité Weekend", Icon: BarChart3, color: "blue",
            text: `Le weekend génère 40% de vos ventes. Considérez des promotions spéciales.`
        }
    ];

    return (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl border border-purple-200 dark:border-purple-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📊 Insights et Recommandations</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {insights.map((insight, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                            <insight.Icon className={`w-5 h-5 text-${insight.color}-500`} />
                            <span className="font-medium text-gray-900 dark:text-white">{insight.title}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{insight.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReportInsights;