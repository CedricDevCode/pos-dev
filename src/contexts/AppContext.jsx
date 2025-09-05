import React, { createContext, useState, useEffect, useCallback, useContext } from "react";
import { donneesInitiales } from "@/contexts/donneesInitiales";

// 🔹 Création du contexte
const AppContext = createContext();

// 🔹 Hook personnalisé pour simplifier l'accès au contexte
export const useAppContext = () => useContext(AppContext);

// 🔹 Provider
const AppProvider = ({ children }) => {
  const [utilisateurConnecte, setUtilisateurConnecte] = useState(null);
  const [activiteActive, setActiviteActive] = useState(null);
  const [modeSombre, setModeSombre] = useState(false);

  const [utilisateurs, setUtilisateurs] = useState([]);
  const [activites, setActivites] = useState([]);
  const [produits, setProduits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [ventes, setVentes] = useState([]);
  const [caisses, setCaisses] = useState([]);
  const [tauxTaxe, setTauxTaxe] = useState(18);

  // 🔹 Panier
  const [panier, setPanier] = useState([]);

  const [caisseStatus, setCaisseStatus] = useState({
    estOuverte: false,
    dateOuverture: null,
    solde: 0,
    fondsInitial: 0,
    utilisateurOuverture: null,
  });

  const [chargementInitial, setChargementInitial] = useState(true);
  const [erreur, setErreur] = useState(null);

  // --- Fonctions caisse ---
  const ouvrirCaisse = useCallback(
    (montant) => {
      setCaisseStatus({
        estOuverte: true,
        fondsInitial: montant,
        solde: montant,
        dateOuverture: new Date().toISOString(),
        utilisateurOuverture: utilisateurConnecte?.id || null,
      });
    },
    [utilisateurConnecte]
  );

  const fermerCaisse = useCallback(() => {
    setCaisseStatus((prev) => ({ ...prev, estOuverte: false }));
  }, []);

  // --- Gestion du panier ---
  const ajouterAuPanier = useCallback(
    (produit) => {
      if (!caisseStatus.estOuverte) return { success: false, message: "Caisse fermée" };

      const itemExistant = panier.find((item) => item.id === produit.id);

      if (itemExistant) {
        if (itemExistant.quantite < produit.stock) {
          setPanier(
            panier.map((item) =>
              item.id === produit.id ? { ...item, quantite: item.quantite + 1 } : item
            )
          );
          return { success: true };
        } else {
          return { success: false, message: "Stock insuffisant" };
        }
      } else {
        if (produit.stock > 0) {
          setPanier((prev) => [...prev, { ...produit, quantite: 1 }]);
          return { success: true };
        } else {
          return { success: false, message: "Produit en rupture" };
        }
      }
    },
    [panier, caisseStatus.estOuverte]
  );

  const modifierQuantitePanier = useCallback(
    (id, nouvelleQuantite) => {
      if (!caisseStatus.estOuverte) return { success: false, message: "Caisse fermée" };

      if (nouvelleQuantite <= 0) {
        setPanier((prev) => prev.filter((item) => item.id !== id));
        return { success: true };
      }

      const produit = produits.find((p) => p.id === id);
      if (!produit) return { success: false, message: "Produit introuvable" };
      if (nouvelleQuantite > produit.stock) return { success: false, message: "Stock insuffisant" };

      setPanier((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantite: nouvelleQuantite } : item))
      );

      return { success: true };
    },
    [produits, caisseStatus.estOuverte]
  );

  const viderPanier = useCallback(() => setPanier([]), []);

  // --- Gestion des ventes ---
  const ajouterVente = useCallback(
    (vente) => {
      const numero = ventes.length + 1;
      const venteAvecNumero = { ...vente, numero, dateVente: new Date().toISOString() };
      setVentes((prev) => [...prev, venteAvecNumero]);
      return venteAvecNumero;
    },
    [ventes]
  );

  // --- Finaliser la vente (pour PaymentModal) ---
  const finaliserVente = useCallback(
    ({ modesPaiement, montantRecu, monnaieRendue }) => {
      if (!caisseStatus.estOuverte) return null;

      const sousTotal = panier.reduce((total, item) => total + item.prix * item.quantite, 0);
      const montantTaxe = (sousTotal * tauxTaxe) / 100;
      const totalGeneral = sousTotal + montantTaxe;

      const vente = {
        id: ventes.length + 1,
        articles: panier,
        sousTotal,
        taxe: montantTaxe,
        total: totalGeneral,
        modesPaiement,
        montantRecu,
        monnaieRendue,
        utilisateurId: utilisateurConnecte?.id || null,
        dateVente: new Date().toISOString(),
      };

      setVentes((prev) => [...prev, vente]);

      // Décrémenter le stock des produits vendus
      setProduits((prev) =>
        prev.map((p) => {
          const vendu = panier.find((item) => item.id === p.id);
          return vendu ? { ...p, stock: p.stock - vendu.quantite } : p;
        })
      );

      // Mettre à jour le solde de la caisse
      setCaisseStatus((prev) => ({
        ...prev,
        solde: prev.solde + totalGeneral,
      }));

      // Vider le panier
      setPanier([]);

      return vente;
    },
    [panier, tauxTaxe, ventes, caisseStatus, utilisateurConnecte]
  );

  // --- Sauvegarde / Chargement des données ---
  const sauvegarderDonnees = useCallback(() => {
    try {
      const donnees = { utilisateurs, activites, produits, categories, ventes, caisses };
      localStorage.setItem("pos-donnees", JSON.stringify(donnees));
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    }
  }, [utilisateurs, activites, produits, categories, ventes, caisses]);

  const sauvegarderPreferences = useCallback(() => {
    try {
      const preferences = { modeSombre, activiteActiveId: activiteActive?.id, caisseStatus, panier };
      localStorage.setItem("pos-preferences", JSON.stringify(preferences));
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des préférences:", error);
    }
  }, [modeSombre, activiteActive, caisseStatus, panier]);

  const chargerDonnees = useCallback(async () => {
    try {
      const donneesStockees = localStorage.getItem("pos-donnees");
      let donnees = donneesStockees ? JSON.parse(donneesStockees) : donneesInitiales;
      if (!donneesStockees) localStorage.setItem("pos-donnees", JSON.stringify(donneesInitiales));

      setUtilisateurs(donnees.utilisateurs || []);
      setActivites(donnees.activites || []);
      setProduits(donnees.produits || []);
      setCategories(donnees.categories || []);
      setVentes(donnees.ventes || []);
      setCaisses(donnees.caisses || []);

      const preferences = localStorage.getItem("pos-preferences");
      let activiteParDefaut = donnees.activites?.[0] || null;
      let panierCharge = [];

      if (preferences) {
        const prefs = JSON.parse(preferences);
        setModeSombre(prefs.modeSombre || false);

        if (prefs.caisseStatus) {
          const maintenant = new Date();
          const dateOuverture = new Date(prefs.caisseStatus.dateOuverture);
          const differenceHeures = (maintenant - dateOuverture) / (1000 * 60 * 60);
          if (differenceHeures < 24) setCaisseStatus(prefs.caisseStatus);
        }

        if (prefs.activiteActiveId) {
          const activiteTrouvee = donnees.activites.find((a) => a.id === prefs.activiteActiveId);
          if (activiteTrouvee) activiteParDefaut = activiteTrouvee;
        }

        if (prefs.panier) panierCharge = prefs.panier;
      }

      setActiviteActive(activiteParDefaut);
      setPanier(panierCharge);

      const utilisateurStocke = localStorage.getItem("pos-utilisateur-connecte");
      if (utilisateurStocke) setUtilisateurConnecte(JSON.parse(utilisateurStocke));
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
      setErreur("Impossible de charger les données");
    } finally {
      setChargementInitial(false);
    }
  }, []);

  useEffect(() => { chargerDonnees(); }, [chargerDonnees]);
  useEffect(() => { if (!chargementInitial) sauvegarderDonnees(); }, [utilisateurs, activites, produits, categories, ventes, caisses, chargementInitial, sauvegarderDonnees]);
  useEffect(() => { if (!chargementInitial) sauvegarderPreferences(); }, [modeSombre, activiteActive, caisseStatus, panier, chargementInitial, sauvegarderPreferences]);

  // --- Statistiques ---
  const obtenirStatistiques = useCallback(() => {
    const aujourdHui = new Date();
    const hier = new Date();
    hier.setDate(hier.getDate() - 1);

    const ventesAujourdhui = ventes.filter((v) => new Date(v.dateVente).toDateString() === aujourdHui.toDateString());
    const ventesHier = ventes.filter((v) => new Date(v.dateVente).toDateString() === hier.toDateString());

    const chiffresAffairesAujourdhui = ventesAujourdhui.reduce((t, v) => t + v.total, 0);
    const chiffresAffairesHier = ventesHier.reduce((t, v) => t + v.total, 0);

    const nombreVentesAujourdhui = ventesAujourdhui.length;
    const nombreVentesHier = ventesHier.length;

    const produitsEnRupture = produits.filter((p) => p.stock <= p.stockMin);

    const objectifMensuel = 3000000;
    const debutMois = new Date(aujourdHui.getFullYear(), aujourdHui.getMonth(), 1);
    const ventesMois = ventes.filter((v) => new Date(v.dateVente) >= debutMois);
    const caMois = ventesMois.reduce((t, v) => t + v.total, 0);
    const progressionObjectif = ((caMois / objectifMensuel) * 100).toFixed(1);

    const ventesParActivite = activites.map((act) => ({
      activite: act.nom,
      chiffresAffaires: ventes.filter((v) => v.activiteId === act.id).reduce((t, v) => t + v.total, 0),
    }));

    return {
      chiffresAffairesAujourdhui,
      chiffresAffairesHier,
      nombreVentesAujourdhui,
      nombreVentesHier,
      produitsEnRupture: produitsEnRupture.length,
      produitsStockFaible: produitsEnRupture,
      objectifMensuel,
      caMois,
      progressionObjectif,
      ventesParActivite,
    };
  }, [ventes, produits, activites]);

  // --- Valeur exposée ---
  const valeurContexte = {
    utilisateurConnecte,
    activiteActive,
    modeSombre,
    chargementInitial,
    erreur,
    utilisateurs,
    activites,
    produits,
    categories,
    ventes,
    caisses,
    caisseStatus,
    tauxTaxe,
    panier,
    setPanier,
    ajouterAuPanier,
    modifierQuantitePanier,
    viderPanier,
    setTauxTaxe,
    setUtilisateurs,
    setActivites,
    setProduits,
    setCategories,
    setVentes,
    setCaisses,
    basculerModeSombre: () => setModeSombre((p) => !p),
    changerActiviteActive: (a) => setActiviteActive(a),
    obtenirStatistiques,
    ouvrirCaisse,
    fermerCaisse,
    ajouterVente,
    finaliserVente, // ✅ ajout pour PaymentModal
  };

  return <AppContext.Provider value={valeurContexte}>{children}</AppContext.Provider>;
};

export { AppContext, AppProvider };
