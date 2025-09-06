import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Activity } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ReportFilters = ({
  periode, setPeriode,
  typeRapport, setTypeRapport,
  activiteFiltre, setActiviteFiltre,
  activites
}) => {
  const { toast } = useToast();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="form-label">Période</label>
          <select value={periode} onChange={(e) => setPeriode(e.target.value)} className="form-input">
            <option value="7jours">7 derniers jours</option>
            <option value="30jours">30 derniers jours</option>
            <option value="3mois">3 derniers mois</option>
            <option value="annee">Cette année</option>
          </select>
        </div>
        <div>
          <label className="form-label">Type de rapport</label>
          <select value={typeRapport} onChange={(e) => setTypeRapport(e.target.value)} className="form-input">
            <option value="ventes">Ventes</option>
            <option value="produits">Produits</option>
            <option value="activites">Activités</option>
            <option value="stock">Stock</option>
          </select>
        </div>
        <div>
          <label className="form-label">Activité</label>
          <select value={activiteFiltre} onChange={(e) => setActiviteFiltre(e.target.value)} className="form-input">
            <option value="toutes">Toutes les activités</option>
            {activites.map(activite => (
              <option key={activite.id} value={activite.id}>{activite.nom}</option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <Button onClick={() => toast({ title: "🔄 Actualisation", description: "Données mises à jour avec succès.", className: "toast-success" })} className="w-full pos-button">
            <Activity className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ReportFilters;