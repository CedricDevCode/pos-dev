import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const CategorieModal = ({ isOpen, onClose, onSubmit, categorieToEdit }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    actif: true
  });

  useEffect(() => {
    if (categorieToEdit) {
      setFormData({
        nom: categorieToEdit.nom,
        description: categorieToEdit.description || '',
        actif: categorieToEdit.actif
      });
    } else {
      setFormData({
        nom: '',
        description: '',
        actif: true
      });
    }
  }, [categorieToEdit, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.nom.trim()) {
      toast({ 
        title: "❌ Erreur", 
        description: "Le nom de la catégorie est obligatoire.", 
        className: "toast-error" 
      });
      return;
    }

    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6 border-b border-gray-200 dark:border-gray-700 pb-3">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {categorieToEdit ? 'Modifier' : 'Nouvelle'} Catégorie
          </h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label className="mb-1 text-gray-700 dark:text-gray-300 font-medium">Nom *</label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-gray-700 dark:text-gray-300 font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex items-center">
            <input 
              type="checkbox" 
              name="actif" 
              id="actifCheck" 
              checked={formData.actif} 
              onChange={handleChange} 
              className="w-5 h-5 text-purple-600 border-gray-300 rounded" 
            />
            <label htmlFor="actifCheck" className="ml-2 text-gray-700 dark:text-gray-300 cursor-pointer">
              Catégorie active
            </label>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white transition-colors">
              {categorieToEdit ? 'Modifier' : 'Créer'}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default CategorieModal;