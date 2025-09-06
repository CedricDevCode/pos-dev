import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Landmark } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StatCard = ({ label, valeur, evolution, icone, couleur, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="stat-card p-6"
  >
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>
      {React.createElement(icone, { className: `w-5 h-5 text-${couleur}-500` })}
    </div>
    <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">{valeur}</p>
    {evolution && (
      <p className={`text-sm mt-1 flex items-center text-${couleur}-600 dark:text-${couleur}-400`}>
        <TrendingUp className="w-4 h-4 mr-1" />
        {evolution}
      </p>
    )}
  </motion.div>
);

const VueEnsemble = ({ transactions }) => {
  const stats = useMemo(() => {
    const revenus = transactions.filter(t => t.type === 'revenu').reduce((acc, t) => acc + t.montant, 0);
    const depenses = transactions.filter(t => t.type === 'depense').reduce((acc, t) => acc + t.montant, 0);
    const beneficeNet = revenus - depenses;
    const marge = revenus > 0 ? (beneficeNet / revenus) * 100 : 0;
    
    return { revenus, depenses, beneficeNet, marge };
  }, [transactions]);
  
  const chartData = useMemo(() => {
    const dataByMonth = {};
    transactions.forEach(t => {
      const month = new Date(t.date).toLocaleString('default', { month: 'short', year: '2-digit' });
      if (!dataByMonth[month]) {
        dataByMonth[month] = { month, revenus: 0, depenses: 0 };
      }
      if (t.type === 'revenu') dataByMonth[month].revenus += t.montant;
      if (t.type === 'depense') dataByMonth[month].depenses += t.montant;
    });
    
    // Pour s'assurer de l'ordre, on pourrait trier ici, mais pour l'exemple on le garde simple
    return Object.values(dataByMonth).reverse(); 
  }, [transactions]);

  const kpis = [
    { label: 'Revenus Totaux', valeur: `${stats.revenus.toLocaleString()} FCFA`, evolution: '+8.2%', icone: TrendingUp, couleur: 'green', delay: 0.1 },
    { label: 'Dépenses Totales', valeur: `${stats.depenses.toLocaleString()} FCFA`, evolution: '+2.1%', icone: TrendingDown, couleur: 'red', delay: 0.2 },
    { label: 'Bénéfice Net', valeur: `${stats.beneficeNet.toLocaleString()} FCFA`, evolution: '+11.5%', icone: DollarSign, couleur: 'blue', delay: 0.3 },
    { label: 'Marge Bénéficiaire', valeur: `${stats.marge.toFixed(2)}%`, icone: BarChart3, couleur: 'purple', delay: 0.4 },
  ];
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map(kpi => <StatCard key={kpi.label} {...kpi} />)}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border h-[400px]"
      >
        <h2 className="text-xl font-semibold mb-4">Flux de trésorerie (Revenus vs Dépenses)</h2>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis dataKey="month" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#F9FAFB' }}/>
            <Area type="monotone" dataKey="revenus" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} name="Revenus" />
            <Area type="monotone" dataKey="depenses" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} name="Dépenses" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default VueEnsemble;