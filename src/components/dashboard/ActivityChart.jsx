import React, { useContext, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { AppContext } from '@/contexts/AppContext';

const ActivityChart = () => {
  const { activites, ventes } = useContext(AppContext);

  // Calcul des ventes mensuelles par activité
  const data = useMemo(() => {
    const maintenant = new Date();
    const moisActuel = maintenant.getMonth();
    const anneeActuelle = maintenant.getFullYear();

    return activites.map((act) => {
      const ventesActivite = ventes.filter((v) => {
        const d = new Date(v.dateVente);
        return v.activiteId === act.id && d.getMonth() === moisActuel && d.getFullYear() === anneeActuelle;
      });

      const chiffresAffaires = ventesActivite.reduce((total, v) => total + v.total, 0);

      return {
        activite: act.nom,
        chiffresAffaires,
      };
    });
  }, [activites, ventes]);

  return (
    <>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
        Ventes par Activité
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Répartition mensuelle
      </p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <XAxis type="number" hide />
            <YAxis
              dataKey="activite"
              type="category"
              width={80}
              tick={{ fontSize: 12 }}
              stroke="currentColor"
            />
            <Tooltip
              cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }}
              contentStyle={{
                backgroundColor: 'rgba(31, 41, 55, 0.8)',
                borderColor: 'rgba(139, 92, 246, 0.5)',
                borderRadius: '0.5rem',
                color: 'white',
              }}
              formatter={(value) => [`${value.toLocaleString()} FCFA`, 'Chiffre d’Affaires']}
            />
            <Bar dataKey="chiffresAffaires" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default ActivityChart;
