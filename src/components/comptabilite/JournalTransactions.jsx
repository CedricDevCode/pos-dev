import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowUp } from 'lucide-react';

const JournalTransactions = ({ transactions }) => {
  const [filtre, setFiltre] = useState('tout');

  const transactionsFiltrees = transactions.filter(t => {
    if (filtre === 'tout') return true;
    return t.type === filtre;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border h-full flex flex-col"
    >
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
        <h2 className="text-xl font-semibold">Journal des Transactions</h2>
        <div className="flex items-center gap-2">
          <button onClick={() => setFiltre('tout')} className={`px-3 py-1 rounded-md text-sm ${filtre === 'tout' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Tout</button>
          <button onClick={() => setFiltre('revenu')} className={`px-3 py-1 rounded-md text-sm ${filtre === 'revenu' ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Revenus</button>
          <button onClick={() => setFiltre('depense')} className={`px-3 py-1 rounded-md text-sm ${filtre === 'depense' ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Dépenses</button>
        </div>
      </div>
      <div className="flex-grow overflow-auto">
        <table className="w-full text-left">
          <thead className="sticky top-0 bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="p-3 text-sm font-semibold">Date</th>
              <th className="p-3 text-sm font-semibold">Description</th>
              <th className="p-3 text-sm font-semibold text-right">Montant</th>
            </tr>
          </thead>
          <tbody>
            {transactionsFiltrees.map((t, index) => (
              <tr key={t.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="p-3 text-sm text-gray-600 dark:text-gray-400">{new Date(t.date).toLocaleDateString()}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    {t.type === 'revenu' 
                      ? <ArrowUp className="w-4 h-4 text-green-500" /> 
                      : <ArrowDown className="w-4 h-4 text-red-500" />}
                    <div>
                      <p className="font-medium">{t.description}</p>
                      {t.categorie && <p className="text-xs text-gray-500">{t.categorie}</p>}
                    </div>
                  </div>
                </td>
                <td className={`p-3 font-semibold text-right ${t.type === 'revenu' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {t.type === 'revenu' ? '+' : '-'} {t.montant.toLocaleString()} FCFA
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default JournalTransactions;