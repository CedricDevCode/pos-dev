import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const LoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e) => {
    e.preventDefault();
    toast({
      title: 'Connexion réussie !',
      description: 'Redirection vers le tableau de bord...',
    });
    // Simule une redirection après une connexion réussie
    setTimeout(() => {
      navigate('/tableau-de-bord');
    }, 1500);
  };
  
  const handleNotImplemented = () => {
    toast({
      title: '🚧 Fonctionnalité non implémentée',
      description: "Cette fonctionnalité n'est pas encore disponible. Vous pouvez la demander dans votre prochain prompt ! 🚀",
      variant: 'destructive',
    });
  };

  return (
    <>
      <Helmet>
        <title>Connexion - Votre Application</title>
        <meta name="description" content="Page de connexion pour accéder à votre espace de gestion." />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <Card className="w-full max-w-sm bg-slate-800/50 border-purple-500/20 text-white backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-300">
                Bienvenue
              </CardTitle>
              <CardDescription className="text-center text-slate-300 pt-2">
                Connectez-vous pour gérer vos activités
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="exemple@email.com"
                    required
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    placeholder="********"
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-purple-500"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold">
                  Se connecter
                </Button>
                <Button variant="link" className="text-purple-300" onClick={handleNotImplemented}>
                  Mot de passe oublié ?
                </Button>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default LoginPage;