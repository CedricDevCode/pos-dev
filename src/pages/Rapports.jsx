import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { BarChart3, TrendingUp, ShoppingCart, Users, DollarSign } from 'lucide-react';
import { useApp } from '@/hooks/useApp';
import { useToast } from '@/components/ui/use-toast';

import ReportFilters from '@/components/reports/ReportFilters';
import SalesEvolutionChart from '@/components/reports/SalesEvolutionChart';
import CategoryDistributionChart from '@/components/reports/CategoryDistributionChart';
import TopProductsChart from '@/components/reports/TopProductsChart';
import ActivityComparisonChart from '@/components/reports/ActivityComparisonChart';
import ReportInsights from '@/components/reports/ReportInsights';

const Rapports = () => {
  const { activites, activiteActive, isLoading, error } = useApp();
  const { toast } = useToast();
  
  const [periodeSelectionnee, setPeriodeSelectionnee] = useState('7jours');
  const [activiteFiltre, setActiviteFiltre] = useState(
    activiteActive ? activiteActive.id.toString() : 'toutes'
  );
  const [kpiData, setKpiData] = useState(null);
  const [kpiLoading, setKpiLoading] = useState(true);

  // Charger les données KPI
  useEffect(() => {
    const fetchKpiData = async () => {
      setKpiLoading(true);
      try {
        // Simuler un appel API
        const response = await fetchKpisFromAPI(periodeSelectionnee, activiteFiltre);
        setKpiData(response);
      } catch (err) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les données",
          variant: "destructive"
        });
      } finally {
        setKpiLoading(false);
      }
    };

    fetchKpiData();
  }, [periodeSelectionnee, activiteFiltre, toast]);

  const handleGenerateReport = (format) => {
    toast({
      title: `📄 Export ${format.toUpperCase()}`,
      description: "🚧 Cette fonctionnalité n'est pas encore implémentée.",
      className: "toast-warning"
    });
  };

  // Composant de chargement simplifié
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-16">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );

  // Squelette pour les KPIs
  const KpiSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="p-1.5 rounded-md bg-gray-200 dark:bg-gray-700">
              <div className="h-3.5 w-3.5"></div>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              <div className="ml-1.5 h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            </div>
            <div className="mt-0.5 h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          </div>
        </div>
      ))}
    </div>
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="text-red-500 text-lg">Erreur: {error}</div>
      </div>
    );
  }

  if (!activiteActive && activiteFiltre !== 'toutes') {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
          <BarChart3 className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Aucune activité sélectionnée
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm">
          Veuillez sélectionner une activité pour visualiser ses rapports.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Rapports et Analyses - POS</title>
        <meta name="description" content="Analysez les performances de vos activités." />
      </Helmet>

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Rapports et Analyses</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-0.5 text-sm">Suivi des performances en temps réel</p>
        </div>
        <ReportFilters
          periode={periodeSelectionnee}
          setPeriode={setPeriodeSelectionnee}
          activiteFiltre={activiteFiltre}
          setActiviteFiltre={setActiviteFiltre}
          activites={activites}
          onExport={handleGenerateReport}
        />
      </motion.div>

      {/* KPIs */}
      {kpiLoading ? (
        <KpiSkeleton />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {/* KPI 1 - Chiffre d'affaires */}
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-100 dark:border-gray-700"
            role="region"
            aria-label="Chiffre d'affaires"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">CA Total</h3>
              <div className="p-1.5 rounded-md bg-blue-50 dark:bg-blue-900/20">
                <DollarSign className="h-3.5 w-3.5 text-blue-500" />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline">
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {kpiData?.caTotal || '767€'}
                </p>
                <span className="ml-1.5 text-xs font-medium text-green-500 flex items-center">
                  <TrendingUp className="h-2.5 w-2.5 mr-0.5" /> 
                  {kpiData?.evolutionCA || '+8%'}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">vs période précédente</p>
            </div>
          </div>

          {/* KPI 2 - Panier moyen */}
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-100 dark:border-gray-700"
            role="region"
            aria-label="Panier moyen"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">Panier Moyen</h3>
              <div className="p-1.5 rounded-md bg-green-50 dark:bg-green-900/20">
                <ShoppingCart className="h-3.5 w-3.5 text-green-500" />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline">
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {kpiData?.panierMoyen || '52€'}
                </p>
                <span className="ml-1.5 text-xs font-medium text-green-500 flex items-center">
                  <TrendingUp className="h-2.5 w-2.5 mr-0.5" /> 
                  {kpiData?.evolutionPanier || '+5.2%'}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">vs période précédente</p>
            </div>
          </div>

          {/* KPI 3 - Taux de conversion */}
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-100 dark:border-gray-700"
            role="region"
            aria-label="Taux de conversion"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">Taux de Conversion</h3>
              <div className="p-1.5 rounded-md bg-purple-50 dark:bg-purple-900/20">
                <Users className="h-3.5 w-3.5 text-purple-500" />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline">
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {kpiData?.tauxConversion || '68.5%'}
                </p>
                <span className="ml-1.5 text-xs font-medium text-green-500 flex items-center">
                  <TrendingUp className="h-2.5 w-2.5 mr-0.5" /> 
                  {kpiData?.evolutionConversion || '+2.1%'}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">vs période précédente</p>
            </div>
          </div>

          {/* KPI 4 - Nouveaux clients */}
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-100 dark:border-gray-700"
            role="region"
            aria-label="Nouveaux clients"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">Nouveaux Clients</h3>
              <div className="p-1.5 rounded-md bg-orange-50 dark:bg-orange-900/20">
                <Users className="h-3.5 w-3.5 text-orange-500" />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline">
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {kpiData?.nouveauxClients || '124'}
                </p>
                <span className="ml-1.5 text-xs font-medium text-green-500 flex items-center">
                  <TrendingUp className="h-2.5 w-2.5 mr-0.5" /> 
                  {kpiData?.evolutionClients || '+12%'}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">vs période précédente</p>
            </div>
          </div>
        </div>
      )}

      {/* Graphiques avec les props de filtrage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SalesEvolutionChart 
          periode={periodeSelectionnee} 
          activiteId={activiteFiltre !== 'toutes' ? activiteFiltre : null} 
        />
        <CategoryDistributionChart 
          periode={periodeSelectionnee} 
          activiteId={activiteFiltre !== 'toutes' ? activiteFiltre : null} 
        />
      </div>

      {/* Autres composants avec props de filtrage */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <TopProductsChart 
          periode={periodeSelectionnee} 
          activiteId={activiteFiltre !== 'toutes' ? activiteFiltre : null} 
        />
      </div>

      {activites.length > 1 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
          <ActivityComparisonChart 
            periode={periodeSelectionnee}
          />
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <ReportInsights 
          periode={periodeSelectionnee} 
          activiteId={activiteFiltre !== 'toutes' ? activiteFiltre : null} 
        />
      </div>
    </div>
  );
};

// Fonction helper pour récupérer les données
async function fetchKpisFromAPI(period, activityId) {
  // Simuler un délai de chargement
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Retourner des données factices pour la démo
  return {
    caTotal: '767€',
    evolutionCA: '+8%',
    panierMoyen: '52€',
    evolutionPanier: '+5.2%',
    tauxConversion: '68.5%',
    evolutionConversion: '+2.1%',
    nouveauxClients: '124',
    evolutionClients: '+12%'
  };
}

export default Rapports;