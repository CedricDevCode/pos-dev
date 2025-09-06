import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useApp } from '@/contexts/AppContext';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VueEnsemble from '@/components/comptabilite/VueEnsemble';
import JournalTransactions from '@/components/comptabilite/JournalTransactions';
import GestionDepenses from '@/components/comptabilite/GestionDepenses';

const Comptabilite = () => {
  const { ventes, depenses } = useApp();

  const transactions = useMemo(() => {
    const transactionsVentes = ventes.map(v => ({
      id: `vente-${v.id}`,
      type: 'revenu',
      date: v.date,
      description: `Vente #${v.numero}`,
      montant: v.total,
    }));
    const transactionsDepenses = depenses.map(d => ({
      id: `depense-${d.id}`,
      type: 'depense',
      date: d.date,
      description: d.description,
      montant: d.montant,
      categorie: d.categorie,
    }));

    return [...transactionsVentes, ...transactionsDepenses]
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [ventes, depenses]);

  return (
    <div className="space-y-6 h-full flex flex-col">
      <Helmet>
        <title>Comptabilité - POS Multi-Activités</title>
        <meta name="description" content="Suivi financier, gestion des revenus, dépenses et bilan comptable." />
      </Helmet>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Centre de Comptabilité</h1>
        <p className="text-gray-600 dark:text-gray-400">Votre tableau de bord financier complet.</p>
      </motion.div>
      
      <Tabs defaultValue="vue-ensemble" className="flex-grow flex flex-col">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="vue-ensemble">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="journal">Journal des Transactions</TabsTrigger>
          <TabsTrigger value="depenses">Gestion des Dépenses</TabsTrigger>
        </TabsList>
        <div className="flex-grow mt-4 overflow-y-auto">
          <TabsContent value="vue-ensemble" className="h-full">
            <VueEnsemble transactions={transactions} />
          </TabsContent>
          <TabsContent value="journal" className="h-full">
            <JournalTransactions transactions={transactions} />
          </TabsContent>
          <TabsContent value="depenses" className="h-full">
            <GestionDepenses />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Comptabilite;