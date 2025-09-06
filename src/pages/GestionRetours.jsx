import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Undo, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/components/ui/use-toast';

const GestionRetours = () => {
  const { ventes, retours, ajouterRetour, activiteActive } = useApp();
  const { toast } = useToast();

  const [rechercheVente, setRechercheVente] = useState('');
  const [venteSelectionnee, setVenteSelectionnee] = useState(null);
  const [articlesARetourner, setArticlesARetourner] = useState([]);

  const ventesFiltrees = ventes.filter(v => 
    v.numero.toLowerCase().includes(rechercheVente.toLowerCase()) &&
    (!activiteActive || v.activiteId === activiteActive.id)
  );

  const selectionnerVente = (vente) => {
    setVenteSelectionnee(vente);
    setArticlesARetourner(vente.articles.map(a => ({ ...a, quantiteRetour: 0 })));
  };

  const updateQuantiteRetour = (produitId, quantite) => {
    const articleOriginal = venteSelectionnee.articles.find(a => a.produitId === produitId);
    const qteNum = parseInt(quantite, 10);
    if (qteNum >= 0 && qteNum <= articleOriginal.quantite) {
      setArticlesARetourner(articlesARetourner.map(a => 
        a.produitId === produitId ? { ...a, quantiteRetour: qteNum } : a
      ));
    }
  };

  const articlesRetournes = useMemo(() => articlesARetourner.filter(a => a.quantiteRetour > 0), [articlesARetourner]);
  const totalRetour = useMemo(() => articlesRetournes.reduce((acc, item) => acc + (item.prix * item.quantiteRetour), 0), [articlesRetournes]);

  const finaliserRetour = () => {
    if (articlesRetournes.length === 0) {
      toast({ title: "❌ Aucun article sélectionné", description: "Veuillez spécifier la quantité pour au moins un article à retourner.", className: "toast-error" });
      return;
    }

    const nouveauRetour = {
      id: Date.now(),
      numeroVenteOriginale: venteSelectionnee.numero,
      date: new Date().toISOString(),
      articles: articlesRetournes.map(a => ({ produitId: a.produitId, nom: a.nom, quantite: a.quantiteRetour, prix: a.prix })),
      totalRembourse: totalRetour,
    };
    
    ajouterRetour(nouveauRetour);

    toast({ title: "✅ Retour enregistré", description: `Un remboursement de ${totalRetour.toLocaleString()} FCFA a été effectué.`, className: "toast-success" });
    setVenteSelectionnee(null);
    setArticlesARetourner([]);
    setRechercheVente('');
  };

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Gestion des Retours - POS</title>
        <meta name="description" content="Gérez facilement les retours de produits et les remboursements." />
      </Helmet>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestion des Retours</h1>
        <p className="text-gray-600 dark:text-gray-400">Traitez les retours de produits et les remboursements clients.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section Recherche de Vente */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border">
          <h2 className="text-xl font-semibold mb-4">1. Rechercher une vente</h2>
          <div className="flex gap-2">
            <Input 
              type="text"
              placeholder="Numéro de la vente (ex: V-2024-XXXX)"
              value={rechercheVente}
              onChange={(e) => setRechercheVente(e.target.value)}
            />
            <Button><Search className="w-4 h-4" /></Button>
          </div>
          <div className="mt-4 max-h-60 overflow-y-auto space-y-2">
            {ventesFiltrees.map(vente => (
              <div 
                key={vente.numero} 
                onClick={() => selectionnerVente(vente)}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${venteSelectionnee?.numero === vente.numero ? 'bg-purple-100 dark:bg-purple-900/50 border-purple-400' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
              >
                <p className="font-semibold">{vente.numero}</p>
                <p className="text-sm text-gray-500">{new Date(vente.date).toLocaleString()}</p>
                <p className="text-sm font-bold">{vente.total.toLocaleString()} FCFA</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Section Traitement du Retour */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border">
          <h2 className="text-xl font-semibold mb-4">2. Traiter le retour</h2>
          {venteSelectionnee ? (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="font-bold">Vente: {venteSelectionnee.numero}</p>
                <p className="text-sm text-gray-500">Date: {new Date(venteSelectionnee.date).toLocaleString()}</p>
              </div>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {articlesARetourner.map(article => (
                  <div key={article.produitId} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{article.nom}</p>
                      <p className="text-sm text-gray-500">Acheté: {article.quantite} | Prix: {article.prix.toLocaleString()} FCFA</p>
                    </div>
                    <div className="w-24">
                      <Input 
                        type="number"
                        min="0"
                        max={article.quantite}
                        value={article.quantiteRetour}
                        onChange={(e) => updateQuantiteRetour(article.produitId, e.target.value)}
                        className="text-center"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total à rembourser:</span>
                  <span className="text-red-500">
                    {totalRetour.toLocaleString()} FCFA
                  </span>
                </div>
                <Button 
                  onClick={finaliserRetour} 
                  className="w-full mt-4" 
                  variant="destructive"
                  disabled={articlesRetournes.length === 0}
                >
                  <Undo className="w-4 h-4 mr-2" />
                  Valider le retour
                </Button>
                {articlesRetournes.length === 0 && (
                    <p className="text-center text-sm text-yellow-600 dark:text-yellow-400 mt-2">
                        Veuillez indiquer une quantité pour au moins un article à retourner.
                    </p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">Sélectionnez une vente pour commencer.</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Historique des Retours */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border">
        <h2 className="text-xl font-semibold mb-4">Historique des retours</h2>
        <div className="max-h-96 overflow-y-auto">
          {retours.length > 0 ? (
            <table className="w-full">
              <thead className="table-header">
                <tr>
                  <th className="px-4 py-2 text-left">Vente Originale</th>
                  <th className="px-4 py-2 text-left">Date Retour</th>
                  <th className="px-4 py-2 text-left">Montant Remboursé</th>
                  <th className="px-4 py-2 text-left">Articles</th>
                </tr>
              </thead>
              <tbody>
                {retours.map(retour => (
                  <tr key={retour.id} className="table-row">
                    <td className="table-cell">{retour.numeroVenteOriginale}</td>
                    <td className="table-cell">{new Date(retour.date).toLocaleString()}</td>
                    <td className="table-cell text-red-500 font-semibold">{retour.totalRembourse.toLocaleString()} FCFA</td>
                    <td className="table-cell">{retour.articles.map(a => `${a.nom} (x${a.quantite})`).join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-500 py-8">Aucun retour enregistré.</p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default GestionRetours;