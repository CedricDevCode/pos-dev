import React from 'react';
import { TrendingUp, Calendar, DollarSign, Percent, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Composant BeneficeNetCard - Affiche les bénéfices nets et indicateurs financiers
 * @param {Object} benefices - Les données de bénéfices à afficher
 * @param {string} periode - La période sélectionnée pour l'analyse
 * @param {Function} onPeriodeChange - Callback pour changer la période
 */
const BeneficeNetCard = ({ benefices, periode, onPeriodeChange }) => {
  // Définition des périodes disponibles pour l'analyse
  const periodes = [
    { value: 'today', label: 'Aujourd\'hui' },
    { value: 'week', label: 'Cette semaine' },
    { value: 'month', label: 'Ce mois' }
  ];

  /**
   * Formate un nombre avec des séparateurs de milliers
   * @param {number} number - Le nombre à formater
   * @returns {string} Le nombre formaté avec séparateurs
   */
  const formatNumber = (number) => {
    return new Intl.NumberFormat('fr-FR').format(number);
  };

  /**
   * Détermine la couleur en fonction de la valeur du bénéfice
   * @param {number} value - La valeur du bénéfice
   * @returns {string} La classe de couleur Tailwind appropriée
   */
  const getBeneficeColor = (value) => {
    if (value > 0) return 'text-green-600 dark:text-green-400';
    if (value < 0) return 'text-red-600 dark:text-red-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  /**
   * Détermine l'icône en fonction de la valeur du bénéfice
   * @param {number} value - La valeur du bénéfice
   * @returns {JSX.Element} L'icône appropriée
   */
  const getBeneficeIcon = (value) => {
    if (value > 0) return <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />;
    if (value < 0) return <TrendingUp className="w-5 h-5 text-red-600 dark:text-red-400 transform rotate-180" />;
    return <TrendingUp className="w-5 h-5 text-gray-400" />;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 h-full">
      {/* En-tête de la carte avec titre et sélecteur de période */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 rounded-lg">
            {getBeneficeIcon(benefices.beneficeNet)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Bénéfice Net</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Performance financière</p>
          </div>
        </div>
        
        {/* Sélecteur de période */}
        <div className="relative">
          <select
            value={periode}
            onChange={(e) => onPeriodeChange(e.target.value)}
            className="text-xs bg-gray-100 dark:bg-gray-700 border-0 rounded-lg px-3 py-2 pr-8 appearance-none focus:ring-2 focus:ring-green-500 focus:outline-none transition-colors"
          >
            {periodes.map(p => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
          <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Affichage principal du bénéfice net */}
      <div className="mb-6">
        <div className="flex items-end gap-2">
          <span className={getBeneficeColor(benefices.beneficeNet) + " text-3xl font-bold"}>
            {formatNumber(benefices.beneficeNet)} FCFA
          </span>
          {benefices.margeBrute !== 0 && (
            <span className={`text-sm font-medium ${benefices.margeBrute >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {benefices.margeBrute > 0 ? '+' : ''}{benefices.margeBrute}%
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {benefices.beneficeNet >= 0 ? 'Gain' : 'Perte'} nette sur la période
        </p>
      </div>

      {/* Grille des indicateurs financiers */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Chiffre d'affaires */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">CA Total</span>
          </div>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {formatNumber(benefices.chiffreAffaires)} FCFA
          </p>
        </div>

        {/* Coût total */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <ShoppingCart className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Coûts</span>
          </div>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {formatNumber(benefices.coutTotal)} FCFA
          </p>
        </div>

        {/* Marge brute */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Percent className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Marge Brute</span>
          </div>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {benefices.margeBrute}%
          </p>
        </div>

        {/* Nombre de ventes */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <ShoppingCart className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Transactions</span>
          </div>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {benefices.nombreVentes}
          </p>
        </div>
      </div>

      {/* Indicateur de performance */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">Performance</span>
          <div className={`text-sm font-medium ${getBeneficeColor(benefices.beneficeNet)}`}>
            {benefices.beneficeNet >= 0 ? '✅ Excellente' : '⚠️ À améliorer'}
          </div>
        </div>
        
        {/* Barre de progression indicative */}
        <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
            style={{ 
              width: `${Math.min(Math.max((benefices.margeBrute + 100) / 2, 0), 100)}%` 
            }}
          ></div>
        </div>
      </div>

      {/* Message contextuel selon la performance */}
      {benefices.nombreVentes > 0 && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-xs text-blue-700 dark:text-blue-300 text-center">
            {benefices.beneficeNet > 0 ? (
              <>📈 <strong>Excellent!</strong> Votre marge de {benefices.margeBrute}% est très positive.</>
            ) : benefices.beneficeNet < 0 ? (
              <>📉 <strong>Attention:</strong> Les coûts dépassent le chiffre d'affaires.</>
            ) : (
              <>⚖️ <strong>Équilibre:</strong> Les revenus couvrent juste les coûts.</>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default BeneficeNetCard;