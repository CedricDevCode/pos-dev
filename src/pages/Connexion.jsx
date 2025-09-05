import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Eye, EyeOff, Store, Lock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/hooks/useApp';
import { useToast } from '@/components/ui/use-toast';

const Connexion = () => {
  const { connecterUtilisateur } = useApp();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    email: '',
    motDePasse: ''
  });
  const [motDePasseVisible, setMotDePasseVisible] = useState(false);
  const [chargement, setChargement] = useState(false);

  // Gestion de la soumission du formulaire
  const gererSoumission = async (e) => {
    e.preventDefault();
    setChargement(true);

    try {
      // Simulation d'un délai de connexion
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const connexionReussie = connecterUtilisateur(formData.email, formData.motDePasse);
      
      if (connexionReussie) {
        toast({
          title: "🎉 Connexion réussie !",
          description: "Bienvenue dans votre système POS multi-activités.",
          className: "toast-success"
        });
      } else {
        toast({
          title: "❌ Erreur de connexion",
          description: "Email ou mot de passe incorrect. Veuillez réessayer.",
          className: "toast-error"
        });
      }
    } catch (error) {
      toast({
        title: "❌ Erreur système",
        description: "Une erreur est survenue lors de la connexion.",
        className: "toast-error"
      });
    } finally {
      setChargement(false);
    }
  };

  // Gestion des changements dans les champs
  const gererChangement = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Connexion rapide avec les comptes de démonstration
  const connexionRapide = (email, motDePasse) => {
    setFormData({ email, motDePasse });
    setTimeout(() => {
      connecterUtilisateur(email, motDePasse);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <Helmet>
        <title>Connexion - POS Multi-Activités</title>
        <meta name="description" content="Connectez-vous à votre système de point de vente multi-activités pour gérer vos commerces, restaurants et services." />
        <meta property="og:title" content="Connexion - POS Multi-Activités" />
        <meta property="og:description" content="Accédez à votre tableau de bord POS pour gérer toutes vos activités commerciales." />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Logo et titre */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl"
          >
            <Store className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">
            POS Multi-Activités
          </h1>
          <p className="text-purple-200">
            Connectez-vous pour accéder à votre système de gestion
          </p>
        </div>

        {/* Formulaire de connexion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20"
        >
          <form onSubmit={gererSoumission} className="space-y-6">
            {/* Champ email */}
            <div>
              <label className="form-label text-white">
                Adresse email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={gererChangement}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="votre@email.com"
                  required
                />
              </div>
            </div>

            {/* Champ mot de passe */}
            <div>
              <label className="form-label text-white">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={motDePasseVisible ? 'text' : 'password'}
                  name="motDePasse"
                  value={formData.motDePasse}
                  onChange={gererChangement}
                  className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Votre mot de passe"
                  required
                />
                <button
                  type="button"
                  onClick={() => setMotDePasseVisible(!motDePasseVisible)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {motDePasseVisible ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Bouton de connexion */}
            <Button
              type="submit"
              disabled={chargement}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {chargement ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="loading-spinner w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Connexion...</span>
                </div>
              ) : (
                'Se connecter'
              )}
            </Button>
          </form>

          {/* Comptes de démonstration */}
          <div className="mt-8 pt-6 border-t border-white/20">
            <p className="text-sm text-purple-200 text-center mb-4">
              Comptes de démonstration
            </p>
            <div className="space-y-2">
              <button
                onClick={() => connexionRapide('admin@pos.com', 'admin123')}
                className="w-full text-left p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/10"
              >
                <div className="text-white text-sm font-medium">👨‍💼 Administrateur</div>
                <div className="text-purple-200 text-xs">admin@pos.com • Accès complet</div>
              </button>
              <button
                onClick={() => connexionRapide('marie@pos.com', 'marie123')}
                className="w-full text-left p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/10"
              >
                <div className="text-white text-sm font-medium">👩‍💼 Caissière</div>
                <div className="text-purple-200 text-xs">marie@pos.com • Point de vente</div>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Informations supplémentaires */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center mt-6"
        >
          <p className="text-purple-200 text-sm">
            Système sécurisé • Données chiffrées • Sauvegarde automatique
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Connexion;