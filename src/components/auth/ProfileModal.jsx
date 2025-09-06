import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Key, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/components/ui/use-toast';

const ProfileModal = ({ isOpen, onClose }) => {
  const { utilisateurConnecte, setUtilisateurs } = useApp();
  const { toast } = useToast();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    motDePasse: '',
    confirmationMotDePasse: '',
    avatar: '',
  });

  useEffect(() => {
    if (utilisateurConnecte) {
      setFormData({
        nom: utilisateurConnecte.nom,
        email: utilisateurConnecte.email,
        motDePasse: '',
        confirmationMotDePasse: '',
        avatar: utilisateurConnecte.avatar,
      });
    }
  }, [utilisateurConnecte, isOpen]);

  if (!utilisateurConnecte) return null;

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
    if (formData.motDePasse && formData.motDePasse !== formData.confirmationMotDePasse) {
      toast({ title: "❌ Erreur", description: "Les mots de passe ne correspondent pas.", className: "toast-error" });
      return;
    }

    setUtilisateurs(prevUsers => 
      prevUsers.map(u => {
        if (u.id === utilisateurConnecte.id) {
          const updatedUser = {
            ...u,
            nom: formData.nom,
            email: formData.email,
            avatar: formData.avatar,
          };
          if (formData.motDePasse) {
            updatedUser.motDePasse = formData.motDePasse;
          }
          return updatedUser;
        }
        return u;
      })
    );
    
    toast({ title: "✅ Profil mis à jour", description: "Vos informations ont été enregistrées.", className: "toast-success" });
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
            className="modal-content w-full max-w-lg max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={soumettre} className="flex flex-col h-full">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">Mon Profil</h3>
                  <button type="button" onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="relative group">
                        <img src={formData.avatar} alt="Avatar" className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700" />
                        <button type="button" onClick={() => fileInputRef.current.click()} className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Camera className="w-8 h-8 text-white" />
                        </button>
                      </div>
                      <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />
                      <p className="text-center text-sm text-gray-500 mt-2">Changer</p>
                    </div>
                    <div className="w-full space-y-4">
                      <div>
                        <label className="form-label flex items-center gap-2"><User className="w-4 h-4 text-gray-500" />Nom complet *</label>
                        <input type="text" name="nom" value={formData.nom} onChange={gererChangement} className="form-input" required />
                      </div>
                      <div>
                        <label className="form-label flex items-center gap-2"><Mail className="w-4 h-4 text-gray-500" />Email *</label>
                        <input type="email" name="email" value={formData.email} onChange={gererChangement} className="form-input" required />
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-6 space-y-4">
                    <p className="text-base font-semibold">Changer le mot de passe</p>
                    <div>
                      <label className="form-label flex items-center gap-2"><Key className="w-4 h-4 text-gray-500" />Nouveau mot de passe</label>
                      <input type="password" name="motDePasse" value={formData.motDePasse} onChange={gererChangement} className="form-input" placeholder="Laisser vide pour ne pas changer" />
                    </div>
                    <div>
                      <label className="form-label flex items-center gap-2"><Key className="w-4 h-4 text-gray-500" />Confirmer le mot de passe</label>
                      <input type="password" name="confirmationMotDePasse" value={formData.confirmationMotDePasse} onChange={gererChangement} className="form-input" />
                    </div>
                  </div>
              </div>
              <div className="p-6 flex justify-end space-x-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
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

export default ProfileModal;