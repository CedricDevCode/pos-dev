import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Tag, Plus, Edit, Trash2, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/components/ui/use-toast';
import ConfirmationModal from '@/components/common/ConfirmationModal';

const GestionCategories = () => {
  const { categories, activiteActive, ajouterCategorie, modifierCategorie, supprimerCategorie, produits } = useApp();
  const { toast } = useToast();

  const [modaleOuverte, setModaleOuverte] = useState(false);
  const [modaleConfirmation, setModaleConfirmation] = useState({ isOpen: false, categorie: null });
  const [categorieEnEdition, setCategorieEnEdition] = useState(null);
  const [formData, setFormData] = useState({ nom: '', image: '' });
  const fileInputRef = useRef(null);

  const categoriesAffichees = categories.filter(c => c.activiteId === activiteActive?.id);

  const ouvrirModaleCreation = () => {
    setCategorieEnEdition(null);
    setFormData({ nom: '', image: '' });
    setModaleOuverte(true);
  };

  const ouvrirModaleEdition = (categorie) => {
    setCategorieEnEdition(categorie);
    setFormData({ nom: categorie.nom, image: categorie.image || '' });
    setModaleOuverte(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const soumettre = (e) => {
    e.preventDefault();
    if (!formData.nom.trim()) {
      toast({ title: "❌ Erreur", description: "Le nom de la catégorie est obligatoire.", className: "toast-error" });
      return;
    }
    if (!activiteActive) {
      toast({ title: "❌ Erreur", description: "Veuillez sélectionner une activité.", className: "toast-error" });
      return;
    }

    const donneesCategorie = { nom: formData.nom, image: formData.image, activiteId: activiteActive.id };

    if (categorieEnEdition) {
      modifierCategorie(categorieEnEdition.id, donneesCategorie);
      toast({ title: "✅ Modifiée", description: `Catégorie "${formData.nom}" mise à jour.`, className: "toast-success" });
    } else {
      ajouterCategorie(donneesCategorie);
      toast({ title: "✅ Créée", description: `Catégorie "${formData.nom}" ajoutée.`, className: "toast-success" });
    }
    setModaleOuverte(false);
  };

  const preparerSuppression = (categorie) => {
    setModaleConfirmation({
      isOpen: true,
      categorie: categorie,
      title: `Supprimer la catégorie ?`,
      message: `Êtes-vous sûr de vouloir supprimer "${categorie.nom}" ? Cette action est irréversible.`,
      onConfirm: () => executerSuppression(categorie),
    });
  };

  const executerSuppression = (categorie) => {
    try {
      supprimerCategorie(categorie.id);
      toast({ title: "🗑️ Supprimée", description: `Catégorie "${categorie.nom}" supprimée.`, className: "toast-success" });
    } catch(error) {
       toast({ title: "❌ Suppression impossible", description: error.message, className: "toast-error" });
    }
    setModaleConfirmation({ isOpen: false, categorie: null });
  };

  if (!activiteActive) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <Tag className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Aucune activité sélectionnée</h3>
        <p className="text-gray-500 dark:text-gray-400">Veuillez sélectionner une activité pour gérer ses catégories.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Gestion des Catégories - POS</title>
        <meta name="description" content="Organisez vos produits en catégories pour une gestion simplifiée." />
      </Helmet>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestion des Catégories</h1>
          <p className="text-gray-600 dark:text-gray-400">{activiteActive.nom} • {categoriesAffichees.length} catégories</p>
        </div>
        <Button onClick={ouvrirModaleCreation} className="pos-button">
          <Plus className="w-4 h-4 mr-2" /> Nouvelle Catégorie
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {categoriesAffichees.map((categorie) => {
           const produitsAssocies = produits.filter(p => p.categorie === categorie.nom && p.activiteId === activiteActive.id).length;
          return (
          <motion.div
            key={categorie.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <div className="h-32 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              {categorie.image ? (
                <img src={categorie.image} alt={categorie.nom} className="h-full w-full object-cover" />
              ) : (
                <Tag className="w-12 h-12 text-gray-400" />
              )}
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg truncate">{categorie.nom}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{produitsAssocies} produit(s)</p>
            </div>
             <div className="p-2 bg-gray-50 dark:bg-gray-800/50 flex justify-end items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" onClick={() => ouvrirModaleEdition(categorie)}>
                  <Edit className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => preparerSuppression(categorie)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
            </div>
          </motion.div>
        )})}
      </div>
      
      {categoriesAffichees.length === 0 && (
           <div className="text-center py-12 col-span-full">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Tag className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Aucune catégorie trouvée</h3>
            <p className="text-gray-500 dark:text-gray-400">Commencez par ajouter votre première catégorie.</p>
          </div>
      )}

      <AnimatePresence>
        {modaleOuverte && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="modal-overlay" onClick={() => setModaleOuverte(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="modal-content max-w-md" onClick={(e) => e.stopPropagation()}>
              <form onSubmit={soumettre} className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{categorieEnEdition ? 'Modifier' : 'Nouvelle'} catégorie</h3>
                  <button type="button" onClick={() => setModaleOuverte(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><X className="w-5 h-5" /></button>
                </div>
                
                <div>
                  <label className="form-label">Image de la catégorie</label>
                  <div 
                    className="mt-1 flex justify-center items-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md cursor-pointer hover:border-purple-500"
                    onClick={() => fileInputRef.current.click()}
                  >
                    {formData.image ? (
                       <img src={formData.image} alt="Aperçu" className="max-h-32 rounded-lg" />
                    ) : (
                      <div className="space-y-1 text-center">
                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600 dark:text-gray-400">
                           <p className="pl-1">cliquez pour sélectionner</p>
                        </div>
                      </div>
                    )}
                  </div>
                   <input
                    id="image-upload"
                    name="image"
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                </div>

                <div>
                  <label htmlFor="nomCategorie" className="form-label">Nom de la catégorie *</label>
                  <input
                    id="nomCategorie"
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={(e) => setFormData({...formData, nom: e.target.value})}
                    className="form-input"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-4 pt-4">
                  <Button type="button" variant="outline" onClick={() => setModaleOuverte(false)}>Annuler</Button>
                  <Button type="submit" className="pos-button">{categorieEnEdition ? 'Modifier' : 'Créer'}</Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmationModal
        isOpen={modaleConfirmation.isOpen}
        onClose={() => setModaleConfirmation({ isOpen: false, categorie: null })}
        onConfirm={modaleConfirmation.onConfirm}
        title={modaleConfirmation.title}
        message={modaleConfirmation.message}
      />
    </div>
  );
};

export default GestionCategories;