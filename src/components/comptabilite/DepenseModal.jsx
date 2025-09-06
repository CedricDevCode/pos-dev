import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign, Calendar, Tag, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/components/ui/use-toast';

const categoriesDepenses = [
  'Fournitures',
  'Salaire',
  'Loyer',
  'Marketing',
  'Services Publics',
  'Maintenance',
  'Autre',
];

const DepenseModal = ({ isOpen, onClose, depense }) => {
  const { ajouterDepense, modifierDepense } = useApp();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    description: '',
    montant: '',
    categorie: 'Autre',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (depense) {
      setFormData({
        description: depense.description,
        montant: depense.montant,
        categorie: depense.categorie,
        date: new Date(depense.date).toISOString().split('T')[0],
      });
    } else {
      setFormData({
        description: '',
        montant: '',
        categorie: 'Autre',
        date: new Date().toISOString().split('T')[0],
      });
    }
  }, [depense, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataDepense = { ...formData, montant: parseFloat(formData.montant) };
    
    if (depense) {
      modifierDepense({ ...dataDepense, id: depense.id });
      toast({ title: '✅ Dépense modifiée', description: 'La dépense a été mise à jour.', className: 'toast-success' });
    } else {
      ajouterDepense(dataDepense);
      toast({ title: '✅ Dépense ajoutée', description: 'La nouvelle dépense a été enregistrée.', className: 'toast-success' });
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modal-overlay"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="modal-content w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSubmit}>
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="text-xl font-semibold">{depense ? 'Modifier la dépense' : 'Ajouter une dépense'}</h3>
                <button type="button" onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="form-label flex items-center gap-2"><FileText className="w-4 h-4 text-gray-500" />Description *</label>
                  <input type="text" name="description" value={formData.description} onChange={handleChange} className="form-input" required />
                </div>
                <div>
                  <label className="form-label flex items-center gap-2"><DollarSign className="w-4 h-4 text-gray-500" />Montant (FCFA) *</label>
                  <input type="number" name="montant" value={formData.montant} onChange={handleChange} className="form-input" required min="0" />
                </div>
                <div>
                  <label className="form-label flex items-center gap-2"><Tag className="w-4 h-4 text-gray-500" />Catégorie</label>
                  <select name="categorie" value={formData.categorie} onChange={handleChange} className="form-input">
                    {categoriesDepenses.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-500" />Date *</label>
                  <input type="date" name="date" value={formData.date} onChange={handleChange} className="form-input" required />
                </div>
              </div>

              <div className="p-6 flex justify-end space-x-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
                <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
                <Button type="submit" className="pos-button">Enregistrer</Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DepenseModal;