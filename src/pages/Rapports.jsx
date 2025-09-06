import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useApp } from '@/contexts/AppContext';

import ReportHeader from '@/components/reports/ReportHeader';
import ReportFilters from '@/components/reports/ReportFilters';
import KPIStats from '@/components/reports/KPIStats';
import SalesEvolutionChart from '@/components/reports/SalesEvolutionChart';
import CategoryDistributionChart from '@/components/reports/CategoryDistributionChart';
import TopProductsChart from '@/components/reports/TopProductsChart';
import ActivityComparisonChart from '@/components/reports/ActivityComparisonChart';
import ReportInsights from '@/components/reports/ReportInsights';

import { generatePdf, generateExcel } from '@/lib/reportGenerator';
import { useToast } from '@/components/ui/use-toast';


const Rapports = () => {
  const { activiteActive, activites, obtenirStatistiques } = useApp();
  const { toast } = useToast();

  const [periodeSelectionnee, setPeriodeSelectionnee] = useState('7jours');
  const [typeRapport, setTypeRapport] = useState('ventes');
  const [activiteFiltre, setActiviteFiltre] = useState('toutes');

  const statistiques = obtenirStatistiques();

  const handleExport = (format) => {
    if (format === 'pdf') {
      generatePdf();
    } else if (format === 'excel') {
      generateExcel();
    }
    toast({
      title: `📄 Export ${format.toUpperCase()} initié`,
      description: `Le fichier va être téléchargé.`,
      className: "toast-success"
    });
  };
  
  return (
    <div className="space-y-6">
      <Helmet>
        <title>Rapports et Analyses - POS</title>
        <meta name="description" content="Analysez les performances de vos activités avec des rapports détaillés, graphiques interactifs et statistiques en temps réel." />
      </Helmet>

      <ReportHeader onExport={handleExport} />

      <ReportFilters 
        periode={periodeSelectionnee}
        setPeriode={setPeriodeSelectionnee}
        typeRapport={typeRapport}
        setTypeRapport={setTypeRapport}
        activiteFiltre={activiteFiltre}
        setActiviteFiltre={setActiviteFiltre}
        activites={activites}
      />

      <KPIStats stats={statistiques} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesEvolutionChart />
        <CategoryDistributionChart />
      </div>

      <TopProductsChart />
      
      {activites.length > 1 && (
        <ActivityComparisonChart />
      )}
      
      <ReportInsights stats={statistiques} />
    </div>
  );
};

export default Rapports;