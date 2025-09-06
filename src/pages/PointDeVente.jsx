
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/components/ui/use-toast';
import { Search, Package, LogOut, Unlock, Archive, List, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ProductGrid from '@/components/pos/ProductGrid';
import Cart from '@/components/pos/Cart';
import PaymentModal from '@/components/pos/PaymentModal';
import ReceiptModal from '@/components/pos/ReceiptModal';
import OpenRegisterModal from '@/components/pos/OpenRegisterModal';
import CloseRegisterModal from '@/components/pos/CloseRegisterModal';
import HeldCartsModal from '@/components/pos/HeldCartsModal';
import HoldCartNameModal from '@/components/pos/HoldCartNameModal';
import { useNavigate } from 'react-router-dom';

const PointDeVente = () => {
  const { 
    produits, 
    activiteActive, 
    ajouterVente, 
    categories: allCategories,
    caisses,
    ouvrirCaisse,
    fermerCaisse,
    ajouterVenteASessionCaisse,
    utilisateurConnecte
  } = useApp();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [panier, setPanier] = useState([]);
  const [recherche, setRecherche] = useState('');
  const [categorieFiltre, setCategorieFiltre] = useState('');
  
  const [modalePaiementOuverte, setModalePaiementOuverte] = useState(false);
  const [modaleRecuOuverte, setModaleRecuOuverte] = useState(false);
  const [derniereVente, setDerniereVente] = useState(null);
  
  const [sessionCaisse, setSessionCaisse] = useState(null);
  const [modaleOuvertureCaisse, setModaleOuvertureCaisse] = useState(true);
  const [modaleFermetureCaisse, setModaleFermetureCaisse] = useState(false);
  
  const [ventesEnAttente, setVentesEnAttente] = useState([]);
  const [modaleVentesEnAttente, setModaleVentesEnAttente] = useState(false);
  const [modaleNomVenteEnAttente, setModaleNomVenteEnAttente] = useState(false);

  const [produitsAffiches, setProduitsAffiches] = useState([]);
  const [chargementProduits, setChargementProduits] = useState(false);

  const rechercheInputRef = useRef(null);

  useEffect(() => {
    if (activiteActive) {
      const sessionExistante = caisses.find(c => c.activiteId === activiteActive.id && c.statut === 'ouverte');
      setSessionCaisse(sessionExistante || null);
      setModaleOuvertureCaisse(!sessionExistante);
    } else {
      setSessionCaisse(null);
    }
  }, [activiteActive, caisses]);

  useEffect(() => {
    setChargementProduits(true);
    const timer = setTimeout(() => {
      if (!activiteActive) {
        setProduitsAffiches([]);
        setChargementProduits(false);
        return;
      }
      const resultats = produits.filter(produit => 
        produit.activiteId === activiteActive.id &&
        produit.actif &&
        produit.nom.toLowerCase().includes(recherche.toLowerCase()) &&
        (categorieFiltre === '' || produit.categorie === categorieFiltre)
      );
      setProduitsAffiches(resultats);
      setChargementProduits(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [produits, activiteActive, recherche, categorieFiltre]);

  const gererOuvertureCaisse = (soldeInitial) => {
    const nouvelleSession = ouvrirCaisse(soldeInitial);
    setSessionCaisse(nouvelleSession);
    setModaleOuvertureCaisse(false);
    toast({ title: "✅ Caisse Ouverte", description: `Session démarrée avec ${soldeInitial.toLocaleString()} FCFA`, className: "toast-success" });
  };
  
  const gererClotureCaisse = (detailsCloture) => {
     fermerCaisse(sessionCaisse.id, detailsCloture);
     setSessionCaisse(null);
     setModaleFermetureCaisse(false);
     setModaleOuvertureCaisse(true);
     toast({ title: "🔒 Caisse Fermée", description: "La session a été clôturée avec succès.", className: "toast-success" });
  };

  const categories = allCategories.filter(c => c.activiteId === activiteActive?.id);

  const ajouterAuPanier = useCallback((produit) => {
    if (!sessionCaisse) {
      toast({ title: "Caisse fermée", description: "Ouvrez une session de caisse pour vendre.", variant: "destructive" });
      setModaleOuvertureCaisse(true);
      return;
    }
    const itemExistant = panier.find(item => item.id === produit.id);
    if (itemExistant) {
      if (itemExistant.quantite < produit.stock) {
        setPanier(panier.map(item => item.id === produit.id ? { ...item, quantite: item.quantite + 1 } : item));
      } else {
        toast({ title: "⚠️ Stock insuffisant", description: `Stock disponible: ${produit.stock} unités`, variant: "default" });
      }
    } else {
      if (produit.stock > 0) {
        setPanier(prev => [...prev, { ...produit, quantite: 1 }]);
      } else {
        toast({ title: "❌ Produit en rupture", description: "Ce produit n'est plus en stock.", variant: "destructive" });
      }
    }
  }, [panier, toast, sessionCaisse, produits]);

  const modifierQuantite = useCallback((id, nouvelleQuantite) => {
    if (nouvelleQuantite <= 0) {
      setPanier(prev => prev.filter(item => item.id !== id));
      return;
    }
    const produit = produits.find(p => p.id === id);
    if (produit && nouvelleQuantite > produit.stock) {
      toast({ title: "⚠️ Stock insuffisant", description: `Stock disponible: ${produit.stock} unités`, variant: "default" });
      setPanier(prev => prev.map(item => item.id === id ? { ...item, quantite: produit.stock } : item));
      return;
    }
    setPanier(prev => prev.map(item => item.id === id ? { ...item, quantite: nouvelleQuantite } : item));
  }, [produits, toast]);

  const viderPanier = useCallback(() => setPanier([]), []);

  const mettreEnAttente = (nomVente) => {
    setVentesEnAttente(prev => [...prev, { id: Date.now(), nom: nomVente, panier }]);
    viderPanier();
    setModaleNomVenteEnAttente(false);
    toast({ title: "⏳ Vente mise en attente", description: `La vente "${nomVente}" a été sauvegardée.`, className: "toast-success" });
  };

  const reprendreVente = (venteId) => {
    const venteAReprendre = ventesEnAttente.find(v => v.id === venteId);
    if(venteAReprendre) {
        if(panier.length > 0) {
            if(!window.confirm("Le panier actuel sera remplacé. Continuer ?")) return;
        }
        setPanier(venteAReprendre.panier);
        setVentesEnAttente(prev => prev.filter(v => v.id !== venteId));
        setModaleVentesEnAttente(false);
        toast({ title: "✅ Vente reprise", description: `Vous travaillez sur la vente "${venteAReprendre.nom}".`, className: "toast-success" });
    }
  };

  const finaliserVente = useCallback((paiement) => {
    const sousTotal = panier.reduce((total, item) => total + (item.prix * item.quantite), 0);
    const tauxTaxe = activiteActive?.tauxTaxe || 0;
    const montantTaxe = (sousTotal * tauxTaxe) / 100;
    const totalGeneral = sousTotal + montantTaxe;

    const nouvelleVente = {
      id: Date.now(),
      numero: `V-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
      date: new Date().toISOString(),
      activiteId: activiteActive.id,
      utilisateurId: utilisateurConnecte.id,
      articles: panier.map(item => ({ produitId: item.id, nom: item.nom, quantite: item.quantite, prix: item.prix, image: item.image })),
      sousTotal,
      taxe: montantTaxe,
      total: totalGeneral,
      ...paiement,
      statut: 'termine'
    };
    
    ajouterVente(nouvelleVente);
    ajouterVenteASessionCaisse(sessionCaisse.id, nouvelleVente);
    setDerniereVente(nouvelleVente);
    viderPanier();
    setModalePaiementOuverte(false);
    setModaleRecuOuverte(true);

    toast({ title: "✅ Vente finalisée !", description: `Vente ${nouvelleVente.numero} enregistrée.`, className: "toast-success" });
  }, [panier, activiteActive, ajouterVente, viderPanier, toast, utilisateurConnecte, ajouterVenteASessionCaisse, sessionCaisse]);

  if (!activiteActive) {
    return (
      <div className="flex items-center justify-center h-full text-center p-6">
        <div>
          <Package className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">Aucune activité sélectionnée</h2>
          <p className="mt-2 text-gray-500">Veuillez sélectionner une activité dans l'en-tête pour commencer à vendre.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-100 dark:bg-gray-950">
      <Helmet>
        <title>Point de Vente - {activiteActive.nom}</title>
        <meta name="description" content="Interface de caisse moderne pour enregistrer les ventes, gérer le panier et traiter les paiements en FCFA." />
      </Helmet>

      <header className="p-4 flex-shrink-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div className="flex items-center gap-3">
             <Button variant="ghost" size="icon" onClick={() => navigate('/tableau-de-bord')} className="text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700">
                <LayoutDashboard className="w-6 h-6" />
             </Button>
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Point de Vente</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Activité : {activiteActive.nom}</p>
            </div>
          </div>
          {sessionCaisse ? (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-sm font-medium text-gray-500">Ouvert par {utilisateurConnecte.nom} à {new Date(sessionCaisse.dateOuverture).toLocaleTimeString()}</span>
                <p className="text-xs text-green-500">Fonds de caisse: {sessionCaisse.soldeInitial.toLocaleString()} FCFA</p>
              </div>
              <Button onClick={() => setModaleFermetureCaisse(true)} variant="destructive">
                <LogOut className="w-4 h-4 mr-2" /> Fermer la caisse
              </Button>
            </div>
          ) : (
             <Button onClick={() => setModaleOuvertureCaisse(true)} className="pos-button">
                <Unlock className="w-4 h-4 mr-2" /> Ouvrir la caisse
              </Button>
          )}
        </div>
        <div className="mt-4 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              ref={rechercheInputRef}
              type="text"
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              placeholder="Rechercher un produit..."
              className="w-full pl-10 pr-4 py-2"
            />
          </div>
          <select
            value={categorieFiltre}
            onChange={(e) => setCategorieFiltre(e.target.value)}
            className="form-input sm:max-w-xs"
          >
            <option value="">Toutes catégories</option>
            {categories.map(c => <option key={c.id} value={c.nom}>{c.nom}</option>)}
          </select>
          <Button onClick={() => setModaleVentesEnAttente(true)} variant="outline">
            <List className="w-4 h-4 mr-2" />
            Ventes en attente ({ventesEnAttente.length})
          </Button>
        </div>
      </header>
      
      <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">
        <div className="flex-1 p-4 lg:p-6 lg:overflow-y-auto hide-scrollbar">
            <ProductGrid produits={produitsAffiches} onAjouterAuPanier={ajouterAuPanier} loading={chargementProduits} />
        </div>
        <div className="w-full lg:w-[400px] xl:w-[450px] lg:flex-shrink-0 bg-white dark:bg-gray-800 border-t lg:border-t-0 lg:border-l dark:border-gray-700 flex flex-col">
          <Cart
            panier={panier}
            onModifierQuantite={modifierQuantite}
            onViderPanier={viderPanier}
            onPaiement={() => setModalePaiementOuverte(true)}
            onMettreEnAttente={() => setModaleNomVenteEnAttente(true)}
            tauxTaxe={activiteActive?.tauxTaxe}
            disabled={!sessionCaisse}
          />
        </div>
      </div>

      <AnimatePresence>
        {modaleOuvertureCaisse && !sessionCaisse && (
          <OpenRegisterModal 
            onOuvrir={gererOuvertureCaisse} 
            onFermer={() => setModaleOuvertureCaisse(false)} 
            isDismissable={false}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {modaleFermetureCaisse && sessionCaisse && (
          <CloseRegisterModal
            session={sessionCaisse}
            onFermer={() => setModaleFermetureCaisse(false)}
            onCloturer={gererClotureCaisse}
          />
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {modalePaiementOuverte && (
          <PaymentModal
            panier={panier}
            tauxTaxe={activiteActive?.tauxTaxe}
            onFermer={() => setModalePaiementOuverte(false)}
            onFinaliser={finaliserVente}
          />
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {modaleRecuOuverte && derniereVente && (
          <ReceiptModal
            vente={derniereVente}
            activite={activiteActive}
            onFermer={() => setModaleRecuOuverte(false)}
          />
        )}
      </AnimatePresence>

       <AnimatePresence>
        {modaleVentesEnAttente && (
          <HeldCartsModal
            ventesEnAttente={ventesEnAttente}
            onFermer={() => setModaleVentesEnAttente(false)}
            onReprendre={reprendreVente}
            onSupprimer={(id) => setVentesEnAttente(prev => prev.filter(v => v.id !== id))}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {modaleNomVenteEnAttente && (
          <HoldCartNameModal
            onFermer={() => setModaleNomVenteEnAttente(false)}
            onConfirmer={mettreEnAttente}
            defaultName={`Client ${ventesEnAttente.length + 1}`}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default PointDeVente;
