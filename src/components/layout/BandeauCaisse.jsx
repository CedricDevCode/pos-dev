import React from 'react';
import { useApp } from '@/hooks/useApp';
import { Button } from '@/components/ui/button';
import { Unlock, Lock } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const BandeauCaisse = () => {
  const { caisseStatus, fermerCaisse } = useApp();
  const location = useLocation();
  
  // Afficher le bandeau seulement sur certaines pages
  const pagesAvecBandeau = ['/point-de-vente', '/dashboard']; // Ajoutez les pages où le bandeau doit apparaître
  
  if (!caisseStatus.estOuverte || !pagesAvecBandeau.includes(location.pathname)) {
    return null;
  }

  const handleArretCaisse = () => {
    // Vous pouvez ouvrir une modal de confirmation ici
    if (window.confirm('Êtes-vous sûr de vouloir fermer la caisse ?')) {
      fermerCaisse();
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-40 p-3 text-center text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
      <div className="container mx-auto flex items-center justify-center">
        <Unlock className="w-4 h-4 mr-2" />
        <span>Caisse ouverte à {new Date(caisseStatus.dateOuverture).toLocaleTimeString()} - Solde: {caisseStatus.solde.toLocaleString()} FCFA</span>
        <Button 
          variant="ghost" 
          size="sm" 
          className="ml-4 !text-green-800 dark:!text-green-300"
          onClick={handleArretCaisse}
        >
          <Lock className="w-4 h-4 mr-1" />
          Arrêt de caisse
        </Button>
      </div>
    </div>
  );
};

export default BandeauCaisse;