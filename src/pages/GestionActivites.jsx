import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Store, 
  MapPin, 
  Phone, 
  Calendar,
  Activity,
  Settings,
  BarChart3,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/hooks/useApp';
import { useToast } from '@/components/ui/use-toast';
import StatsActivite from '@/components/statistiques/StatsActivite'; // <-- chemin mis à jour

const GestionActivites = () => {
  const { activites, ajouterActivite, modifierActivite, changerActiviteActive, ventes } = useApp();
  const { toast } = useToast();
  
  const [modaleOuverte, setModaleOuverte] = useState(false);
  const [statsOuvertes, setStatsOuvertes] = useState(false);
  const [activiteEnEdition, setActiviteEnEdition] = useState(null);
  const [activitePourStats, setActivitePourStats] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    type: 'commerce',
    logo: '',
    devise: 'FCFA',
    tauxTaxe: 18,
    adresse: '',
    telephone: '',
    description: ''
  });

  const typesActivites = [
    { value: 'commerce', label: 'Commerce', icon: Store, color: 'blue' },
    { value: 'restauration', label: 'Restauration', icon: Activity, color: 'green' },
    { value: 'services', label: 'Services', icon: Settings, color: 'purple' }
  ];

  const logosParDefaut = {
    commerce: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&h=100&fit=crop',
    restauration: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=100&h=100&fit=crop',
    services: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop'
  };

  // Ouvrir la modale création
  const ouvrirModaleCreation = () => {
    setActiviteEnEdition(null);
    setFormData({
      nom: '', type: 'commerce', logo: '', devise: 'FCFA', tauxTaxe: 18,
      adresse: '', telephone: '', description: ''
    });
    setModaleOuverte(true);
  };

  // Ouvrir la modale édition
  const ouvrirModaleEdition = (activite) => {
    setActiviteEnEdition(activite);
    setFormData({
      nom: activite.nom,
      type: activite.type,
      logo: activite.logo,
      devise: activite.devise,
      tauxTaxe: activite.tauxTaxe,
      adresse: activite.adresse,
      telephone: activite.telephone,
      description: activite.description || ''
    });
    setModaleOuverte(true);
  };

  // Ouvrir StatsActivite
  const ouvrirStats = (activite) => {
    setActivitePourStats(activite);
    setStatsOuvertes(true);
  };

  // Fermer StatsActivite
  const fermerStats = () => {
    setStatsOuvertes(false);
    setActivitePourStats(null);
  };

  // Gestion des changements de formulaire
  const gererChangement = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'tauxTaxe' ? parseFloat(value) || 0 : value
    }));

    if (name === 'type' && !formData.logo) {
      setFormData(prev => ({ ...prev, logo: logosParDefaut[value] }));
    }
  };

  // Soumettre le formulaire
  const soumettre = (e) => {
    e.preventDefault();
    if (!formData.nom.trim()) {
      toast({ title: "❌ Erreur", description: "Le nom est obligatoire", className: "toast-error" });
      return;
    }
    const donneesActivite = { ...formData, logo: formData.logo || logosParDefaut[formData.type] };
    if (activiteEnEdition) {
      modifierActivite(activiteEnEdition.id, donneesActivite);
      toast({ title: "✅ Modifiée", description: `${formData.nom} mise à jour.`, className: "toast-success" });
    } else {
      ajouterActivite(donneesActivite);
      toast({ title: "✅ Créée", description: `${formData.nom} ajoutée.`, className: "toast-success" });
    }
    setModaleOuverte(false);
  };

  // Supprimer activité
  const supprimerActivite = (activite) => {
    if (window.confirm(`Supprimer "${activite.nom}" ?`)) {
      toast({ title: "🗑️ Suppression", description: "Non implémenté.", className: "toast-warning" });
    }
  };

  const obtenirInfosType = (type) => typesActivites.find(t => t.value === type) || typesActivites[0];

  return (
    <div className="space-y-6 p-6">
      <Helmet>
        <title>Gestion des Activités - POS</title>
        <meta name="description" content="Gérez toutes vos activités commerciales : restaurants, boutiques, services." />
      </Helmet>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestion des Activités</h1>
          <p className="text-gray-600 dark:text-gray-400">{activites.length} activités configurées</p>
        </div>
        <Button onClick={ouvrirModaleCreation} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
          <Plus className="w-4 h-4 mr-2" /> Nouvelle Activité
        </Button>
      </motion.div>

      {/* Liste des activités */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activites.map((activite) => {
          const infosType = obtenirInfosType(activite.type);
          const IconeType = infosType.icon;
          return (
            <motion.div 
              key={activite.id} 
              whileHover={{ scale: 1.02 }} 
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <img src={activite.logo} alt={activite.nom} className="w-12 h-12 rounded-lg object-cover" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{activite.nom}</h3>
                    <div className="flex items-center space-x-2">
                      <IconeType className={`w-4 h-4 text-${infosType.color}-500`} />
                      <span className={`text-sm text-${infosType.color}-600 dark:text-${infosType.color}-400 capitalize`}>{infosType.label}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => ouvrirModaleEdition(activite)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><Edit className="w-4 h-4 text-gray-500" /></button>
                  <button onClick={() => supprimerActivite(activite)} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><Trash2 className="w-4 h-4 text-red-500" /></button>
                </div>
              </div>
              <div className="space-y-3 mb-4">
                {activite.adresse && <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400"><MapPin className="w-4 h-4" /><span>{activite.adresse}</span></div>}
                {activite.telephone && <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400"><Phone className="w-4 h-4" /><span>{activite.telephone}</span></div>}
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400"><Calendar className="w-4 h-4" /><span>Créée le {new Date(activite.dateCreation).toLocaleDateString('fr-FR')}</span></div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4 text-sm">
                <div className="flex justify-between"><span>Devise:</span><span className="font-medium">{activite.devise}</span></div>
                <div className="flex justify-between mt-1"><span>Taxe:</span><span className="font-medium">{activite.tauxTaxe}%</span></div>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => { changerActiviteActive(activite); toast({ title: "🔄 Changée", description: `Activité active: ${activite.nom}` }); }} className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-3 py-2 rounded-lg text-sm flex-1">
                  Sélectionner
                </button>
                <button 
                  onClick={() => ouvrirStats(activite)} 
                  className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-3 py-2 rounded-lg text-sm flex-1 flex items-center justify-center"
                >
                  <BarChart3 className="w-4 h-4 mr-1" />Stats
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Modal formulaire création / édition */}
      <AnimatePresence>
        {modaleOuverte && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setModaleOuverte(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }} 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={soumettre} className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{activiteEnEdition ? 'Modifier' : 'Nouvelle'} activité</h3>
                  <button type="button" onClick={() => setModaleOuverte(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom *</label>
                      <input type="text" name="nom" value={formData.nom} onChange={gererChangement} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                      <select name="type" value={formData.type} onChange={gererChangement} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                        {typesActivites.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Logo (URL)</label>
                      <input type="url" name="logo" value={formData.logo} onChange={gererChangement} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                      <textarea name="description" value={formData.description} onChange={gererChangement} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" rows="3" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Adresse</label>
                      <input type="text" name="adresse" value={formData.adresse} onChange={gererChangement} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Téléphone</label>
                      <input type="tel" name="telephone" value={formData.telephone} onChange={gererChangement} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Devise</label>
                      <select name="devise" value={formData.devise} onChange={gererChangement} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                        <option>FCFA</option>
                        <option>EUR</option>
                        <option>USD</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Taxe (%)</label>
                      <input type="number" name="tauxTaxe" value={formData.tauxTaxe} onChange={gererChangement} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" min="0" max="100" step="0.1" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-4 mt-8">
                  <button type="button" onClick={() => setModaleOuverte(false)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                    Annuler
                  </button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
                    {activiteEnEdition ? 'Modifier' : 'Créer'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal StatsActivite */}
      <AnimatePresence>
        {statsOuvertes && activitePourStats && (
          <StatsActivite
            activite={activitePourStats}
            ventes={ventes}
            open={statsOuvertes}
            onClose={fermerStats}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default GestionActivites;
