import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

const GestionUtilisateurs = () => {
    const { toast } = useToast();

    const handleNotImplemented = () => {
        toast({
            title: "🚧 Section en construction",
            description: "Cette fonctionnalité n'est pas encore disponible, mais elle arrive bientôt ! 🚀",
            className: "toast-warning"
        });
    };

    return (
        <div className="space-y-6">
            <Helmet>
                <title>Gestion des Utilisateurs - POS Multi-Activités</title>
                <meta name="description" content="Gérez les comptes et les rôles des utilisateurs de votre application." />
            </Helmet>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestion des Utilisateurs</h1>
                <p className="text-gray-600 dark:text-gray-400">Gérez les accès et les permissions de votre équipe.</p>
            </motion.div>
            
            <motion.div 
                className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
            >
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Page en cours de développement</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Cette section est actuellement en construction. Revenez bientôt pour découvrir de nouvelles fonctionnalités !
                </p>
                <Button onClick={handleNotImplemented} className="pos-button">
                    Inviter un nouvel utilisateur
                </Button>
            </motion.div>
        </div>
    );
};

export default GestionUtilisateurs;