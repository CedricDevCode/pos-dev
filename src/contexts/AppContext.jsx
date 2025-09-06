import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { donneesInitiales } from '@/contexts/donneesInitiales';

// Création du contexte de l'application
const AppContext = createContext();

/**
 * Hook personnalisé pour accéder facilement au contexte de l'application.
 * @returns {object} Le contexte de l'application.
 */
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp doit être utilisé dans un AppProvider');
  }
  return context;
};

/**
 * Fournisseur de contexte qui enveloppe l'application et gère l'état global.
 * @param {object} props - Les propriétés du composant.
 * @param {React.ReactNode} props.children - Les composants enfants.
 */
export const AppProvider = ({ children }) => {
  // États pour les données de l'application
  const [utilisateurConnecte, setUtilisateurConnecte] = useState(null);
  const [activiteActive, setActiviteActive] = useState(null);
  const [modeSombre, setModeSombre] = useState(false);
  
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [activites, setActivites] = useState([]);
  const [produits, setProduits] = useState([]);
  const [ventes, setVentes] = useState([]);
  const [caisses, setCaisses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [retours, setRetours] = useState([]);
  const [depenses, setDepenses] = useState([]);
  
  const [chargementInitial, setChargementInitial] = useState(true);
  const [erreur, setErreur] = useState(null);

  /**
   * Sauvegarde l'ensemble des données de l'application dans le localStorage.
   */
  const sauvegarderDonnees = useCallback(() => {
    try {
      const donnees = { utilisateurs, activites, produits, ventes, caisses, categories, retours, depenses };
      localStorage.setItem('pos-donnees', JSON.stringify(donnees));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  }, [utilisateurs, activites, produits, ventes, caisses, categories, retours, depenses]);

  /**
   * Sauvegarde les préférences de l'utilisateur (thème, activité active) dans le localStorage.
   */
  const sauvegarderPreferences = useCallback(() => {
    try {
      const preferences = { modeSombre, activiteActiveId: activiteActive?.id };
      localStorage.setItem('pos-preferences', JSON.stringify(preferences));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des préférences:', error);
    }
  }, [modeSombre, activiteActive]);

  /**
   * Charge les données et les préférences depuis le localStorage ou utilise les données initiales.
   */
  const chargerDonnees = useCallback(async () => {
    try {
      const donneesStockees = localStorage.getItem('pos-donnees');
      let donnees = donneesStockees ? JSON.parse(donneesStockees) : donneesInitiales;
      
      if (!donneesStockees) {
        localStorage.setItem('pos-donnees', JSON.stringify(donneesInitiales));
        donnees = donneesInitiales;
      }
      
      setUtilisateurs(donnees.utilisateurs || []);
      setActivites(donnees.activites || []);
      setProduits(donnees.produits || []);
      setVentes(donnees.ventes || []);
      setCaisses(donnees.caisses || []);
      setCategories(donnees.categories || []);
      setRetours(donnees.retours || []);
      setDepenses(donnees.depenses || []);
      
      const preferences = localStorage.getItem('pos-preferences');
      let activiteParDefaut = donnees.activites && donnees.activites.length > 0 ? donnees.activites[0] : null;

      if (preferences) {
        const prefs = JSON.parse(preferences);
        setModeSombre(prefs.modeSombre || false);
        if(prefs.activiteActiveId) {
            const activiteTrouvee = donnees.activites.find(a => a.id === prefs.activiteActiveId);
            if(activiteTrouvee) activiteParDefaut = activiteTrouvee;
        }
      }

      setActiviteActive(activiteParDefaut);

      const utilisateurStocke = localStorage.getItem('pos-utilisateur-connecte');
      if (utilisateurStocke) {
          setUtilisateurConnecte(JSON.parse(utilisateurStocke));
      }

    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      setErreur('Impossible de charger les données');
    } finally {
        setChargementInitial(false);
    }
  }, []);

  // Effet pour charger les données au montage initial du composant
  useEffect(() => {
    chargerDonnees();
  }, [chargerDonnees]);

  // Effet pour sauvegarder les données à chaque modification (après le chargement initial)
  useEffect(() => {
    if(!chargementInitial) sauvegarderDonnees();
  }, [utilisateurs, activites, produits, ventes, caisses, categories, retours, depenses, chargementInitial, sauvegarderDonnees]);

  // Effet pour sauvegarder les préférences à chaque modification (après le chargement initial)
  useEffect(() => {
    if(!chargementInitial) sauvegarderPreferences();
  }, [modeSombre, activiteActive, chargementInitial, sauvegarderPreferences]);

  /**
   * Gère la connexion d'un utilisateur.
   * @param {string} email - L'email de l'utilisateur.
   * @param {string} motDePasse - Le mot de passe de l'utilisateur.
   * @returns {boolean} True si la connexion est réussie, sinon false.
   */
  const connecterUtilisateur = (email, motDePasse) => {
    const utilisateur = utilisateurs.find(u => 
      u.email === email && u.motDePasse === motDePasse && u.actif
    );
    
    if (utilisateur) {
      setUtilisateurConnecte(utilisateur);
      localStorage.setItem('pos-utilisateur-connecte', JSON.stringify(utilisateur));
      return true;
    }
    return false;
  };

  /**
   * Gère la déconnexion de l'utilisateur.
   */
  const deconnecterUtilisateur = () => {
    setUtilisateurConnecte(null);
    localStorage.removeItem('pos-utilisateur-connecte');
  };

  // Fonctions de modification de l'état global
  const basculerModeSombre = () => setModeSombre(prev => !prev);
  const changerActiviteActive = (activite) => setActiviteActive(activite);

  const ajouterVente = (nouvelleVente) => {
    setVentes(prev => [...prev, nouvelleVente]);
    nouvelleVente.articles.forEach(article => {
      setProduits(prev => prev.map(produit => 
        produit.id === article.produitId 
          ? { ...produit, stock: produit.stock - article.quantite }
          : produit
      ));
    });
    return nouvelleVente;
  };
  
  const ajouterRetour = (nouveauRetour) => {
    setRetours(prev => [...prev, nouveauRetour]);
    nouveauRetour.articles.forEach(article => {
      setProduits(prev => prev.map(produit =>
        produit.id === article.produitId
          ? { ...produit, stock: produit.stock + article.quantite }
          : produit
      ));
    });
    // Mettre à jour la vente originale pour indiquer qu'un retour a eu lieu
    setVentes(prev => prev.map(v => 
      v.numero === nouveauRetour.numeroVenteOriginale
        ? { ...v, statut: 'retour partiel' }
        : v
    ));
    return nouveauRetour;
  };

  const ouvrirCaisse = (soldeInitial) => {
    const nouvelleSession = {
      id: Date.now(),
      activiteId: activiteActive.id,
      utilisateurId: utilisateurConnecte.id,
      soldeInitial,
      dateOuverture: new Date().toISOString(),
      statut: 'ouverte',
      ventes: []
    };
    setCaisses(prev => [...prev, nouvelleSession]);
    return nouvelleSession;
  };

  const fermerCaisse = (sessionId, detailsCloture) => {
    setCaisses(prev => prev.map(c => 
      c.id === sessionId 
        ? { ...c, ...detailsCloture, statut: 'fermee', dateFermeture: new Date().toISOString() } 
        : c
    ));
  };
  
  const ajouterVenteASessionCaisse = (sessionId, vente) => {
    setCaisses(prev => prev.map(c => 
      c.id === sessionId && c.statut === 'ouverte'
        ? { ...c, ventes: [...c.ventes, vente] }
        : c
    ));
  };

  const ajouterProduit = (nouveauProduit) => {
    const produit = { ...nouveauProduit, id: Date.now(), dateCreation: new Date().toISOString(), actif: true };
    setProduits(prev => [...prev, produit]);
    return produit;
  };

  const modifierProduit = (id, donneesModifiees) => {
    setProduits(prev => prev.map(p => p.id === id ? { ...p, ...donneesModifiees } : p));
  };

  const supprimerProduit = (id) => {
    setProduits(prev => prev.filter(p => p.id !== id));
  };

  const ajouterActivite = (nouvelleActivite) => {
    const activite = { ...nouvelleActivite, id: Date.now(), dateCreation: new Date().toISOString(), actif: true };
    setActivites(prev => [...prev, activite]);
    return activite;
  };

  const modifierActivite = (id, donneesModifiees) => {
    setActivites(prev => prev.map(a => a.id === id ? { ...a, ...donneesModifiees } : a));
    if (activiteActive?.id === id) {
      setActiviteActive(prev => ({ ...prev, ...donneesModifiees }));
    }
  };

  const supprimerActivite = (id) => {
    setActivites(prev => prev.filter(a => a.id !== id));
  };

  const ajouterCategorie = (nouvelleCategorie) => {
    const categorie = { ...nouvelleCategorie, id: Date.now() };
    setCategories(prev => [...prev, categorie]);
    return categorie;
  };

  const modifierCategorie = (id, donneesModifiees) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...donneesModifiees } : c));
  };

  const supprimerCategorie = (id) => {
    const produitsAssocies = produits.filter(p => p.categorie === categories.find(c=>c.id === id)?.nom && p.activiteId === activiteActive?.id).length;
    if (produitsAssocies > 0) {
      throw new Error(`Cette catégorie est utilisée par ${produitsAssocies} produit(s).`);
    }
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const modifierUtilisateur = (id, donneesModifiees) => {
    setUtilisateurs(prev => prev.map(u => {
      if (u.id === id) {
        const utilisateurMaj = { ...u, ...donneesModifiees };
        if (!donneesModifiees.motDePasse) {
          delete utilisateurMaj.motDePasse;
        } else {
          utilisateurMaj.motDePasse = donneesModifiees.motDePasse;
        }
        delete utilisateurMaj.confirmMotDePasse;
        
        if (utilisateurConnecte.id === id) {
          setUtilisateurConnecte(utilisateurMaj);
          localStorage.setItem('pos-utilisateur-connecte', JSON.stringify(utilisateurMaj));
        }
        return utilisateurMaj;
      }
      return u;
    }));
  };

  const ajouterDepense = (nouvelleDepense) => {
    const depense = { ...nouvelleDepense, id: `dep-${Date.now()}` };
    setDepenses(prev => [...prev, depense]);
    return depense;
  };

  const modifierDepense = (donneesModifiees) => {
    setDepenses(prev => prev.map(d => d.id === donneesModifiees.id ? { ...d, ...donneesModifiees } : d));
  };

  const supprimerDepense = (id) => {
    setDepenses(prev => prev.filter(d => d.id !== id));
  };

  /**
   * Calcule et retourne des statistiques clés de l'application.
   * @returns {object} Un objet contenant diverses statistiques.
   */
  const obtenirStatistiques = useCallback(() => {
    const aujourdhui = new Date().toDateString();
    const ventesAujourdhui = ventes.filter(v => new Date(v.dateVente).toDateString() === aujourdhui);
    
    const chiffresAffairesAujourdhui = ventesAujourdhui.reduce((total, v) => total + v.total, 0);
    const nombreVentesAujourdhui = ventesAujourdhui.length;
    const produitsEnRupture = produits.filter(p => p.stock <= p.stockMin);
    
    const ventesParActivite = activites.map(act => ({
      activite: act.nom,
      ventes: ventes.filter(v => v.activiteId === act.id).length,
      chiffresAffaires: ventes
        .filter(v => v.activiteId === act.id)
        .reduce((total, v) => total + v.total, 0)
    }));
    
    return {
      chiffresAffairesAujourdhui,
      nombreVentesAujourdhui,
      produitsEnRupture: produitsEnRupture.length,
      ventesParActivite,
      produitsStockFaible: produitsEnRupture
    };
  }, [ventes, produits, activites]);

  // Objet de valeur du contexte, contenant tous les états et fonctions à partager
  const valeurContexte = {
    utilisateurConnecte,
    activiteActive,
    modeSombre,
    chargementInitial,
    erreur,
    utilisateurs,
    activites,
    produits,
    ventes,
    retours,
    caisses,
    categories,
    depenses,
    chargerDonnees,
    connecterUtilisateur,
    deconnecterUtilisateur,
    basculerModeSombre,
    changerActiviteActive,
    ajouterVente,
    ajouterRetour,
    ouvrirCaisse,
    fermerCaisse,
    ajouterVenteASessionCaisse,
    ajouterProduit,
    modifierProduit,
    supprimerProduit,
    ajouterActivite,
    modifierActivite,
    supprimerActivite,
    ajouterCategorie,
    modifierCategorie,
    supprimerCategorie,
    obtenirStatistiques,
    setUtilisateurs,
    setActivites,
    setProduits,
    setVentes,
    setCaisses,
    setCategories,
    modifierUtilisateur,
    ajouterDepense,
    modifierDepense,
    supprimerDepense,
  };

  return (
    <AppContext.Provider value={valeurContexte}>
      {children}
    </AppContext.Provider>
  );
};