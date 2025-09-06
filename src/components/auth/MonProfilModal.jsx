import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Key, Camera, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

/**
 * Modale permettant à un utilisateur non-admin de modifier son propre profil.
 */
const MonProfilModal = ({ utilisateur, onFermer, onSauvegarder }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nom: utilisateur.nom,
    email: utilisateur.email,
    motDePasse: '',
    avatar: utilisateur.avatar
  });
  const fileInputRef = useRef(null);

  const gererChangement = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const soumettre = (e) => {
    e.preventDefault();
    if (!formData.nom.trim() || !formData.email.trim()) {
      toast({ title: "❌ Erreur", description: "Le nom et l'email sont obligatoires.", className: "toast-error" });
      return;
    }

    const donneesMaj = { ...utilisateur, ...formData };
    if (!formData.motDePasse) {
        delete donneesMaj.motDePasse;
    }

    onSauvegarder(donneesMaj);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="modal-overlay"
      onClick={onFermer}
    >
      <motion.div
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        className="modal-content max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={soumettre} className="flex flex-col h-full">
          <header className="p-6 flex justify-between items-center border-b">
            <h3 className="text-xl font-semibold">Modifier mon profil</h3>
            <button type="button" onClick={onFermer} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
              <X className="w-5 h-5" />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
             <div className="flex flex-col items-center space-y-4">
                <div className="relative group">
                  <img src={formData.avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700" />
                  <button type="button" onClick={() => fileInputRef.current.click()} className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-8 h-8 text-white" />
                  </button>
                </div>
                <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />
             </div>
             
            <div>
              <label className="form-label flex items-center gap-2"><User className="w-4 h-4 text-gray-500"/>Nom complet *</label>
              <input type="text" name="nom" value={formData.nom} onChange={gererChangement} className="form-input" required />
            </div>
            <div>
              <label className="form-label flex items-center gap-2"><Mail className="w-4 h-4 text-gray-500"/>Email *</label>
              <input type="email" name="email" value={formData.email} onChange={gererChangement} className="form-input" required />
            </div>
             <div>
              <label className="form-label flex items-center gap-2"><Key className="w-4 h-4 text-gray-500"/>Nouveau mot de passe</label>
              <input type="password" name="motDePasse" value={formData.motDePasse} onChange={gererChangement} className="form-input" placeholder="Laisser vide pour ne pas changer" />
            </div>
          </div>

          <footer className="p-6 flex justify-end space-x-4 border-t">
            <Button type="button" variant="outline" onClick={onFermer}>Annuler</Button>
            <Button type="submit" className="pos-button">Enregistrer</Button>
          </footer>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default MonProfilModal;