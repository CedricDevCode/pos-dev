import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { Sun, Moon, Bell, Database, Lock, Palette, Store, Save, Upload, Download, X, Check, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const InformationsActivite = () => {
  const { activiteActive, modifierActivite } = useApp();
  const [infos, setInfos] = useState(activiteActive);
  const { toast } = useToast();

  useEffect(() => {
    if (activiteActive) {
      setInfos(activiteActive);
    }
  }, [activiteActive]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInfos(prev => ({ ...prev, [name]: name === 'tauxTaxe' ? parseFloat(value) : value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    modifierActivite(activiteActive.id, infos);
    toast({
      title: "✅ Modifications enregistrées",
      description: `Les informations de ${infos.nom} ont été mises à jour.`,
      className: "toast-success"
    });
  };

  if (!activiteActive) return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Store className="w-6 h-6 text-gray-400" /> Informations de l'activité</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-gray-500">Veuillez sélectionner une activité pour voir ses informations.</p>
      </CardContent>
    </Card>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Store className="w-6 h-6 text-purple-500" /> Informations de l'activité</CardTitle>
        <CardDescription>Ces informations apparaîtront sur les reçus et les rapports.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nom">Nom de l'activité</Label>
              <Input id="nom" name="nom" value={infos.nom} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="type">Type d'activité</Label>
              <Input id="type" name="type" value={infos.type} onChange={handleChange} />
            </div>
          </div>
          <div>
            <Label htmlFor="adresse">Adresse</Label>
            <Input id="adresse" name="adresse" value={infos.adresse || ''} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="telephone">Téléphone</Label>
              <Input id="telephone" name="telephone" value={infos.telephone || ''} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="tauxTaxe">Taux de taxe (%)</Label>
              <Input id="tauxTaxe" name="tauxTaxe" type="number" step="0.1" value={infos.tauxTaxe} onChange={handleChange} />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit"><Save className="w-4 h-4 mr-2" />Enregistrer</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

const ChangePasswordModal = ({ onFermer }) => {
  const { toast } = useToast();
  const [ancienMdp, setAncienMdp] = useState('');
  const [nouveauMdp, setNouveauMdp] = useState('');
  const [confirmerMdp, setConfirmerMdp] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nouveauMdp !== confirmerMdp) {
      toast({ title: "❌ Erreur", description: "Les nouveaux mots de passe ne correspondent pas.", className: "toast-error" });
      return;
    }
    if (nouveauMdp.length < 6) {
      toast({ title: "❌ Erreur", description: "Le nouveau mot de passe doit faire au moins 6 caractères.", className: "toast-error" });
      return;
    }
    // La logique de changement de mot de passe sera ici
    toast({ title: "✅ Succès", description: "Votre mot de passe a été changé (simulation).", className: "toast-success" });
    onFermer();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="modal-overlay" onClick={onFermer}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="modal-content max-w-md" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b">
            <h3 className="text-xl font-semibold">Changer le mot de passe</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="relative">
              <Label htmlFor="ancienMdp">Ancien mot de passe</Label>
              <Input id="ancienMdp" type={showPassword ? "text" : "password"} value={ancienMdp} onChange={(e) => setAncienMdp(e.target.value)} required />
            </div>
            <div className="relative">
              <Label htmlFor="nouveauMdp">Nouveau mot de passe</Label>
              <Input id="nouveauMdp" type={showPassword ? "text" : "password"} value={nouveauMdp} onChange={(e) => setNouveauMdp(e.target.value)} required />
            </div>
            <div className="relative">
              <Label htmlFor="confirmerMdp">Confirmer le mot de passe</Label>
              <Input id="confirmerMdp" type={showPassword ? "text" : "password"} value={confirmerMdp} onChange={(e) => setConfirmerMdp(e.target.value)} required />
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="showPassword" checked={showPassword} onChange={() => setShowPassword(!showPassword)} />
              <Label htmlFor="showPassword">Afficher les mots de passe</Label>
            </div>
          </div>
          <div className="p-6 flex justify-end space-x-4 bg-gray-50 dark:bg-gray-800/50 border-t">
            <Button type="button" variant="outline" onClick={onFermer}>Annuler</Button>
            <Button type="submit">Changer</Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

const Parametres = () => {
  const { toast } = useToast();
  const { modeSombre, basculerModeSombre, sauvegarderDonnees, chargerDonnees } = useApp();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [notificationsActives, setNotificationsActives] = useState(true);

  const handleBackup = () => {
    const data = localStorage.getItem('pos-donnees');
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sauvegarde-pos-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "✅ Sauvegarde téléchargée", description: "Vos données ont été sauvegardées localement.", className: "toast-success" });
  };

  const handleRestore = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (data.utilisateurs && data.produits) {
            localStorage.setItem('pos-donnees', JSON.stringify(data));
            chargerDonnees();
            toast({ title: "✅ Restauration réussie", description: "Les données ont été restaurées. L'application va se recharger.", className: "toast-success" });
            setTimeout(() => window.location.reload(), 2000);
          } else {
            throw new Error("Format de fichier invalide.");
          }
        } catch (error) {
          toast({ title: "❌ Erreur de restauration", description: "Le fichier de sauvegarde est invalide ou corrompu.", className: "toast-error" });
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-8">
      <Helmet>
        <title>Paramètres - POS Multi-Activités</title>
        <meta name="description" content="Configurez les paramètres généraux de votre application de gestion." />
      </Helmet>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Paramètres</h1>
        <p className="text-gray-600 dark:text-gray-400">Gérez les configurations globales de votre application et de vos activités.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <InformationsActivite />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card as={motion.div} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Palette className="w-6 h-6 text-yellow-500" /> Apparence</CardTitle>
            <CardDescription>Personnalisez l'interface.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <span className="font-medium">Mode Sombre</span>
              <button onClick={basculerModeSombre} className="p-2 rounded-full bg-gray-200 dark:bg-gray-600">
                {modeSombre ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-purple-600" />}
              </button>
            </div>
          </CardContent>
        </Card>

        <Card as={motion.div} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bell className="w-6 h-6 text-blue-500" /> Notifications</CardTitle>
            <CardDescription>Gérez vos alertes.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <span className="font-medium">Alertes de stock faible</span>
              <button onClick={() => setNotificationsActives(!notificationsActives)} className="p-2 rounded-full bg-gray-200 dark:bg-gray-600">
                {notificationsActives ? <Check className="w-5 h-5 text-green-500" /> : <X className="w-5 h-5 text-red-500" />}
              </button>
            </div>
          </CardContent>
        </Card>

        <Card as={motion.div} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Lock className="w-6 h-6 text-red-500" /> Sécurité</CardTitle>
            <CardDescription>Mots de passe et accès.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setShowPasswordModal(true)} className="w-full">Changer mon mot de passe</Button>
          </CardContent>
        </Card>

        <Card as={motion.div} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Database className="w-6 h-6 text-green-500" /> Données</CardTitle>
            <CardDescription>Sauvegardez ou restaurez.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <Button onClick={handleBackup} variant="outline" className="flex-1">
                <Download className="w-4 h-4 mr-2" /> Sauvegarder
              </Button>
              <Button as="label" variant="destructive" className="flex-1 cursor-pointer">
                <Upload className="w-4 h-4 mr-2" /> Restaurer
                <input type="file" accept=".json" onChange={handleRestore} className="hidden" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <AnimatePresence>
        {showPasswordModal && <ChangePasswordModal onFermer={() => setShowPasswordModal(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default Parametres;