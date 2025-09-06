import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Plus, Edit, Trash2, User, Mail, Key, Shield, ToggleLeft, ToggleRight, X, MoreVertical, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/components/ui/use-toast';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Composant pour la gestion des utilisateurs (création, modification, suppression).
 */
const GestionUtilisateurs = () => {
  const { utilisateurs, setUtilisateurs, modifierUtilisateur: modifierUtilisateurContexte } = useApp();
  const { toast } = useToast();

  const [modaleOuverte, setModaleOuverte] = useState(false);
  const [modaleConfirmation, setModaleConfirmation] = useState({ isOpen: false, utilisateur: null });
  const [utilisateurEnEdition, setUtilisateurEnEdition] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    role: 'caissier',
    motDePasse: '',
    confirmMotDePasse: '',
    actif: true,
    avatar: ''
  });
  const fileInputRef = useRef(null);

  const roles = [
    { value: 'administrateur', label: 'Administrateur' },
    { value: 'gestionnaire', label: 'Gestionnaire' },
    { value: 'caissier', label: 'Caissier' },
    { value: 'comptable', label: 'Comptable' }
  ];

  const ouvrirModaleCreation = () => {
    setUtilisateurEnEdition(null);
    setFormData({ nom: '', email: '', role: 'caissier', motDePasse: '', confirmMotDePasse: '', actif: true, avatar: `https://avatar.vercel.sh/nouvel-utilisateur.png` });
    setModaleOuverte(true);
  };

  const ouvrirModaleEdition = (utilisateur) => {
    setUtilisateurEnEdition(utilisateur);
    setFormData({ ...utilisateur, motDePasse: '', confirmMotDePasse: '' });
    setModaleOuverte(true);
  };

  const gererChangement = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
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

    if (formData.motDePasse && formData.motDePasse !== formData.confirmMotDePasse) {
      toast({ title: "❌ Erreur", description: "Les mots de passe ne correspondent pas.", className: "toast-error" });
      return;
    }

    if (utilisateurEnEdition) {
      modifierUtilisateurContexte(utilisateurEnEdition.id, formData);
      toast({ title: "✅ Modifié", description: `Utilisateur ${formData.nom} mis à jour.`, className: "toast-success" });
    } else {
      if (!formData.motDePasse) {
        toast({ title: "❌ Erreur", description: "Le mot de passe est obligatoire pour un nouvel utilisateur.", className: "toast-error" });
        return;
      }
      const nouvelUtilisateur = { ...formData, id: Date.now(), dateCreation: new Date().toISOString() };
      delete nouvelUtilisateur.confirmMotDePasse;
      setUtilisateurs([...utilisateurs, nouvelUtilisateur]);
      toast({ title: "✅ Créé", description: `Utilisateur ${formData.nom} ajouté.`, className: "toast-success" });
    }
    setModaleOuverte(false);
  };

  const basculerEtatActif = (utilisateur) => {
    modifierUtilisateurContexte(utilisateur.id, { actif: !utilisateur.actif });
    toast({
      title: utilisateur.actif ? "⏸️ Désactivé" : "▶️ Activé",
      description: `L'utilisateur ${utilisateur.nom} est maintenant ${utilisateur.actif ? 'inactif' : 'actif'}.`,
      className: "toast-success"
    });
  };

  const preparerSuppression = (utilisateur) => {
    setModaleConfirmation({
      isOpen: true,
      utilisateur,
      title: `Supprimer l'utilisateur ?`,
      message: `Êtes-vous sûr de vouloir supprimer "${utilisateur.nom}" ? Cette action est irréversible.`,
      onConfirm: () => executerSuppression(utilisateur.id),
    });
  };

  const executerSuppression = (id) => {
    setUtilisateurs(utilisateurs.filter(u => u.id !== id));
    toast({ title: "🗑️ Supprimé", description: "L'utilisateur a été supprimé.", className: "toast-success" });
    setModaleConfirmation({ isOpen: false, utilisateur: null });
  };


  return (
    <div className="space-y-6">
      <Helmet>
        <title>Gestion des Utilisateurs - POS</title>
        <meta name="description" content="Gérez les comptes et les rôles des utilisateurs de votre application." />
      </Helmet>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestion des Utilisateurs</h1>
          <p className="text-gray-600 dark:text-gray-400">{utilisateurs.length} utilisateurs enregistrés</p>
        </div>
        <Button onClick={ouvrirModaleCreation} className="pos-button">
          <Plus className="w-4 h-4 mr-2" /> Nouvel Utilisateur
        </Button>
      </motion.div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Utilisateur</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Rôle</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date de création</th>
                <th className="px-6 py-3 text-right font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {utilisateurs.map((utilisateur) => (
                <tr key={utilisateur.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-4">
                      <img src={utilisateur.avatar} alt={utilisateur.nom} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{utilisateur.nom}</p>
                        <p className="text-gray-500 dark:text-gray-400">{utilisateur.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300 capitalize">{utilisateur.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${utilisateur.actif ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'}`}>
                      {utilisateur.actif ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">{new Date(utilisateur.dateCreation).toLocaleDateString('fr-FR')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-5 h-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => ouvrirModaleEdition(utilisateur)}>
                          <Edit className="mr-2 h-4 w-4" /> Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => basculerEtatActif(utilisateur)}>
                          {utilisateur.actif ? <ToggleLeft className="mr-2 h-4 w-4" /> : <ToggleRight className="mr-2 h-4 w-4" />}
                          {utilisateur.actif ? 'Désactiver' : 'Activer'}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => preparerSuppression(utilisateur)} className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400">
                          <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {modaleOuverte && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="modal-overlay" onClick={() => setModaleOuverte(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="modal-content max-w-3xl" onClick={(e) => e.stopPropagation()}>
              <form onSubmit={soumettre} className="flex flex-col h-full">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold">{utilisateurEnEdition ? 'Modifier le profil' : 'Nouvel utilisateur'}</h3>
                    <button type="button" onClick={() => setModaleOuverte(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"><X className="w-5 h-5" /></button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-1 flex flex-col items-center space-y-4">
                    <div className="relative group">
                      <img src={formData.avatar} alt="Avatar" className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700" />
                      <button type="button" onClick={() => fileInputRef.current.click()} className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="w-8 h-8 text-white" />
                      </button>
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />
                    <p className="text-center text-sm text-gray-500">Cliquez sur l'image pour la changer.</p>
                  </div>
                  <div className="md:col-span-2 space-y-4">
                    <div><label className="form-label flex items-center gap-2"><User className="w-4 h-4 text-gray-500"/>Nom complet *</label><input type="text" name="nom" value={formData.nom} onChange={gererChangement} className="form-input" required /></div>
                    <div><label className="form-label flex items-center gap-2"><Mail className="w-4 h-4 text-gray-500"/>Email *</label><input type="email" name="email" value={formData.email} onChange={gererChangement} className="form-input" required /></div>
                    <div><label className="form-label flex items-center gap-2"><Shield className="w-4 h-4 text-gray-500"/>Rôle</label><select name="role" value={formData.role} onChange={gererChangement} className="form-input">{roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}</select></div>
                    <div><label className="form-label flex items-center gap-2"><Key className="w-4 h-4 text-gray-500"/>Mot de passe</label><input type="password" name="motDePasse" value={formData.motDePasse} onChange={gererChangement} className="form-input" placeholder={utilisateurEnEdition ? 'Laisser vide pour ne pas changer' : ''} /></div>
                    <div><label className="form-label flex items-center gap-2"><Key className="w-4 h-4 text-gray-500"/>Confirmer le mot de passe</label><input type="password" name="confirmMotDePasse" value={formData.confirmMotDePasse} onChange={gererChangement} className="form-input" /></div>
                    <div className="flex items-center space-x-2 pt-2"><input type="checkbox" name="actif" id="actif" checked={formData.actif} onChange={gererChangement} className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500" /><label htmlFor="actif" className="text-sm text-gray-700 dark:text-gray-300">Utilisateur actif</label></div>
                  </div>
                </div>
                <div className="p-6 flex justify-end space-x-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
                  <Button type="button" variant="outline" onClick={() => setModaleOuverte(false)}>Annuler</Button>
                  <Button type="submit" className="pos-button">{utilisateurEnEdition ? 'Enregistrer les modifications' : 'Créer l\'utilisateur'}</Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmationModal
        isOpen={modaleConfirmation.isOpen}
        onClose={() => setModaleConfirmation({ isOpen: false, utilisateur: null })}
        onConfirm={modaleConfirmation.onConfirm}
        title={modaleConfirmation.title}
        message={modaleConfirmation.message}
      />
    </div>
  );
};

export default GestionUtilisateurs;