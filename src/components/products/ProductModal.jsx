import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const ProductModal = ({ isOpen, onClose, onSubmit, produitToEdit, categories }) => {
  const { toast } = useToast();
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    nom: '', description: '', prix: '', cout: '', stock: '', stockMin: '',
    categorie: '', image: '', actif: true
  });

  useEffect(() => {
    if (produitToEdit) {
      setFormData({
        nom: produitToEdit.nom,
        description: produitToEdit.description,
        prix: produitToEdit.prix.toString(),
        cout: produitToEdit.cout.toString(),
        stock: produitToEdit.stock.toString(),
        stockMin: produitToEdit.stockMin.toString(),
        categorie: produitToEdit.categorie,
        image: produitToEdit.image,
        actif: produitToEdit.actif
      });
      setImagePreview(produitToEdit.image || '');
    } else {
      setFormData({
        nom: '', description: '', prix: '', cout: '', stock: '', stockMin: '',
        categorie: '', image: '', actif: true
      });
      setImagePreview('');
      setSelectedFile(null);
    }
  }, [produitToEdit, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      toast({ title: "❌ Erreur", description: "Veuillez sélectionner une image valide." });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "❌ Erreur", description: "L'image ne doit pas dépasser 2MB." });
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result;
      setImagePreview(base64);
      setFormData(prev => ({ ...prev, image: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nom.trim()) {
      toast({ title: "❌ Erreur", description: "Le nom du produit est obligatoire." });
      return;
    }
    const finalData = {
      ...formData,
      prix: parseFloat(formData.prix) || 0,
      cout: parseFloat(formData.cout) || 0,
      stock: parseInt(formData.stock) || 0,
      stockMin: parseInt(formData.stockMin) || 0,
    };
    onSubmit(finalData);
  };

  const triggerFileInput = () => fileInputRef.current?.click();
  const removeImage = () => {
    setSelectedFile(null);
    setImagePreview('');
    setFormData(prev => ({ ...prev, image: '' }));
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
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6 border-b border-gray-200 dark:border-gray-700 pb-3">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {produitToEdit ? 'Modifier' : 'Nouveau'} Produit
          </h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 bg-gray-50 dark:bg-gray-800 p-5 rounded-xl shadow-inner">
              <InputField label="Nom *" name="nom" value={formData.nom} onChange={handleChange} required />
              <TextAreaField label="Description" name="description" value={formData.description} onChange={handleChange} />

              <div className="flex flex-col">
                <label className="mb-1 text-gray-700 dark:text-gray-300 font-medium">Catégorie</label>
                <div className="relative">
                  <select
                    name="categorie"
                    value={formData.categorie}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.filter(c => c.actif).map(c => (
                      <option key={c.id} value={c.nom}>{c.nom}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="mb-1 text-gray-700 dark:text-gray-300 font-medium">Image</label>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                <div className="flex flex-col items-center space-y-3">
                  <Button type="button" variant="outline" onClick={triggerFileInput} className="w-full flex items-center justify-center gap-2">
                    <Upload className="w-4 h-4" />
                    {selectedFile ? "Changer l'image" : "Sélectionner une image"}
                  </Button>
                  {imagePreview && (
                    <div className="relative mt-2">
                      <img src={imagePreview} alt="Aperçu" className="w-28 h-28 rounded-lg object-cover shadow-md border border-gray-200 dark:border-gray-700" />
                      <button type="button" onClick={removeImage} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4 bg-gray-50 dark:bg-gray-800 p-5 rounded-xl shadow-inner">
              <InputField label="Prix de vente (FCFA) *" name="prix" type="number" value={formData.prix} onChange={handleChange} required />
              <InputField label="Coût d'achat (FCFA)" name="cout" type="number" value={formData.cout} onChange={handleChange} />
              <InputField label="Stock" name="stock" type="number" value={formData.stock} onChange={handleChange} />
              <InputField label="Stock Min" name="stockMin" type="number" value={formData.stockMin} onChange={handleChange} />
              <div className="flex items-center mt-3">
                <input type="checkbox" name="actif" id="actifCheck" checked={formData.actif} onChange={handleChange} className="w-5 h-5 text-purple-600 border-gray-300 rounded" />
                <label htmlFor="actifCheck" className="ml-2 text-gray-700 dark:text-gray-300 cursor-pointer">Produit actif</label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-4">
            <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white transition-colors" disabled={isUploading}>
              {isUploading ? 'Traitement...' : (produitToEdit ? 'Modifier' : 'Créer')}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

const InputField = ({ label, name, value, onChange, type='text', required }) => (
  <div className="flex flex-col">
    <label className="mb-1 text-gray-700 dark:text-gray-300 font-medium">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
  </div>
);

const TextAreaField = ({ label, name, value, onChange }) => (
  <div className="flex flex-col">
    <label className="mb-1 text-gray-700 dark:text-gray-300 font-medium">{label}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      rows="3"
      className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
  </div>
);

export default ProductModal;
