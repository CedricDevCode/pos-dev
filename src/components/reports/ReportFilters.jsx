import React from 'react';
import { Button } from '@/components/ui/button';

const ReportFilters = ({ periode, setPeriode, activiteFiltre, setActiviteFiltre, activites, onExport }) => {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-3">
      {/* Sélecteur de période */}
      <select
        value={periode}
        onChange={(e) => setPeriode(e.target.value)}
        className="px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
      >
        <option value="7jours">7 derniers jours</option>
        <option value="30jours">30 derniers jours</option>
        <option value="90jours">90 derniers jours</option>
        <option value="tous">Tous</option>
      </select>

      {/* Sélecteur d’activité */}
      <select
        value={activiteFiltre}
        onChange={(e) => setActiviteFiltre(e.target.value)}
        className="px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
      >
        <option value="toutes">Toutes les activités</option>
        {activites.map((act) => (
          <option key={act.id} value={act.id}>{act.nom}</option>
        ))}
      </select>

      {/* Boutons d’export */}
      <div className="flex gap-2">
        <Button size="sm" onClick={() => onExport('pdf')} className="bg-blue-600 hover:bg-blue-700 text-white">
          PDF
        </Button>
        <Button size="sm" onClick={() => onExport('excel')} className="bg-green-600 hover:bg-green-700 text-white">
          Excel
        </Button>
      </div>
    </div>
  );
};

export default ReportFilters;
