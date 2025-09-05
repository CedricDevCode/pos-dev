import React, { useContext, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AppContext } from '@/contexts/AppContext';

const SalesChart = () => {
  const { ventes } = useContext(AppContext);

  // Préparer les données des 7 derniers jours
  const data = useMemo(() => {
    const jours = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const aujourdHui = new Date();

    // Initialiser 7 jours avec zéro vente
    const dernieresVentes = Array.from({ length: 7 }).map((_, i) => {
      const date = new Date(aujourdHui);
      date.setDate(aujourdHui.getDate() - (6 - i));
      return {
        name: jours[date.getDay()],
        dateCle: date.toDateString(),
        Ventes: 0,
      };
    });

    // Ajouter les vraies ventes
    ventes.forEach((vente) => {
      const dateVente = new Date(vente.dateVente).toDateString();
      const jour = dernieresVentes.find((j) => j.dateCle === dateVente);
      if (jour) {
        jour.Ventes += vente.total;
      }
    });

    return dernieresVentes;
  }, [ventes]);

  return (
    <>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
        Évolution des Ventes
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Derniers 7 jours</p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
            <XAxis dataKey="name" stroke="currentColor" fontSize={12} />
            <YAxis stroke="currentColor" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(31, 41, 55, 0.8)',
                borderColor: 'rgba(139, 92, 246, 0.5)',
                borderRadius: '0.5rem',
                color: 'white',
              }}
            />
            <Line
              type="monotone"
              dataKey="Ventes"
              stroke="#8B5CF6"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default SalesChart;
