import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { motion } from "framer-motion";
import { X, Banknote, CreditCard, Smartphone, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAppContext } from "@/contexts/AppContext";

const CashRegisterModal = () => {
  const { toast } = useToast();
  const {
    panier,
    tauxTaxe = 18,
    fermerPaiement,
    finaliserPaiement,
  } = useAppContext();

  const [modesPaiement, setModesPaiement] = useState({
    especes: 0,
    carte: 0,
    mobileMoney: 0,
  });

  const especeInputRef = useRef(null);

  // 🔹 Calcul des totaux
  const { totalGeneral, totalPaiements, monnaie, paiementInsuffisant } =
    useMemo(() => {
      const sousTotal = Array.isArray(panier)
        ? panier.reduce((total, item) => {
            if (
              !item ||
              typeof item.prix !== "number" ||
              typeof item.quantite !== "number"
            )
              return total;
            return total + item.prix * item.quantite;
          }, 0)
        : 0;

      const montantTaxe = (sousTotal * tauxTaxe) / 100;
      const totalGeneral = sousTotal + montantTaxe;
      const totalPaiements = Object.values(modesPaiement).reduce(
        (sum, m) => sum + (parseFloat(m) || 0),
        0
      );
      const monnaie = Math.max(0, totalPaiements - totalGeneral);
      const paiementInsuffisant = totalPaiements < totalGeneral;

      return { totalGeneral, totalPaiements, monnaie, paiementInsuffisant };
    }, [panier, tauxTaxe, modesPaiement]);

  // 🔹 Gestion des changements
  const gererChangementPaiement = (mode, valeur) => {
    setModesPaiement((prev) => ({
      ...prev,
      [mode]: parseFloat(valeur) || 0,
    }));
  };

  // 🔹 Finalisation
  const gererFinalisation = useCallback(() => {
    if (paiementInsuffisant) {
      toast({
        title: "❌ Paiement insuffisant",
        description: `Montant manquant: ${(
          totalGeneral - totalPaiements
        ).toLocaleString()} FCFA`,
        className: "toast-error",
      });
      return;
    }
    finaliserPaiement({
      modesPaiement,
      montantRecu: totalPaiements,
      monnaieRendue: monnaie,
    });
  }, [
    paiementInsuffisant,
    totalGeneral,
    totalPaiements,
    finaliserPaiement,
    modesPaiement,
    monnaie,
    toast,
  ]);

  // 🔹 Focus + raccourcis clavier
  useEffect(() => {
    const focusTimer = setTimeout(() => {
      especeInputRef.current?.focus();
      especeInputRef.current?.select();
    }, 10);

    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        gererFinalisation();
      } else if (e.key === "Escape") {
        fermerPaiement();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(focusTimer);
    };
  }, [gererFinalisation, fermerPaiement]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-end p-4 z-50"
      onClick={fermerPaiement}
    >
      {/* 🔹 Conteneur fluide qui apparaît à côté du Cart */}
      <motion.div
        initial={{ x: 200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 200, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-lg ml-4 mt-16"
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête */}
        <header className="p-6 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Paiement
          </h3>
          <button
            onClick={fermerPaiement}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Corps */}
        <div className="p-6 space-y-6">
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center">
            <p className="text-sm text-purple-800 dark:text-purple-300">
              Total à payer
            </p>
            <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">
              {totalGeneral.toLocaleString()} FCFA
            </p>
          </div>

          {/* Inputs */}
          <div className="space-y-4">
            <PaymentInput
              mode="especes"
              label="Espèces"
              Icon={Banknote}
              value={modesPaiement.especes}
              onChange={gererChangementPaiement}
              refInput={especeInputRef}
            />
            <PaymentInput
              mode="carte"
              label="Carte bancaire"
              Icon={CreditCard}
              value={modesPaiement.carte}
              onChange={gererChangementPaiement}
            />
            <PaymentInput
              mode="mobileMoney"
              label="Mobile Money"
              Icon={Smartphone}
              value={modesPaiement.mobileMoney}
              onChange={gererChangementPaiement}
            />
          </div>

          {/* Résumé */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Total reçu:</span>
              <span className="font-medium">
                {totalPaiements.toLocaleString()} FCFA
              </span>
            </div>
            <div
              className={`flex justify-between font-medium ${
                paiementInsuffisant ? "text-red-500" : "text-green-500"
              }`}
            >
              <span>
                {paiementInsuffisant ? "Montant restant:" : "Monnaie à rendre:"}
              </span>
              <span>
                {paiementInsuffisant
                  ? (totalGeneral - totalPaiements).toLocaleString()
                  : monnaie.toLocaleString()}{" "}
                FCFA
              </span>
            </div>
          </div>
        </div>

        {/* Pied */}
        <footer className="p-6 flex space-x-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" onClick={fermerPaiement} className="flex-1">
            Annuler (Échap)
          </Button>
          <Button
            onClick={gererFinalisation}
            disabled={paiementInsuffisant}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Receipt className="w-5 h-5 mr-2" />
            Finaliser (Entrée)
          </Button>
        </footer>
      </motion.div>
    </motion.div>
  );
};

// 🔹 Input personnalisé pour chaque mode de paiement
const PaymentInput = React.forwardRef(
  ({ mode, label, Icon, value, onChange, refInput }, ref) => (
    <div className="flex items-center space-x-4">
      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      </div>
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
        <input
          type="number"
          value={value || ""}
          onChange={(e) => onChange(mode, e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-800 dark:text-white dark:border-gray-600"
          placeholder="0"
          ref={refInput || ref}
        />
      </div>
    </div>
  )
);

PaymentInput.displayName = "PaymentInput";

export default CashRegisterModal;
