import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { X, Banknote, CreditCard, Smartphone, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const PaymentModal = ({ panier, tauxTaxe, onFermer, onFinaliser }) => {
  const { toast } = useToast();
  
  const [modesPaiement, setModesPaiement] = useState({ especes: 0, carte: 0, mobileMoney: 0 });

  const { totalGeneral, totalPaiements, monnaie, paiementInsuffisant } = useMemo(() => {
    const sousTotal = panier.reduce((total, item) => total + (item.prix * item.quantite), 0);
    const montantTaxe = (sousTotal * tauxTaxe) / 100;
    const totalGeneral = sousTotal + montantTaxe;
    const totalPaiements = Object.values(modesPaiement).reduce((sum, montant) => sum + montant, 0);
    const monnaie = Math.max(0, totalPaiements - totalGeneral);
    const paiementInsuffisant = totalPaiements < totalGeneral;
    return { totalGeneral, totalPaiements, monnaie, paiementInsuffisant };
  }, [panier, tauxTaxe, modesPaiement]);

  const gererChangementPaiement = (mode, valeur) => {
    setModesPaiement(prev => ({ ...prev, [mode]: parseFloat(valeur) || 0 }));
  };

  const gererFinalisation = () => {
    if (paiementInsuffisant) {
      toast({
        title: "❌ Paiement insuffisant",
        description: `Montant manquant: ${(totalGeneral - totalPaiements).toLocaleString()} FCFA`,
        className: "toast-error"
      });
      return;
    }
    onFinaliser({
      modesPaiement,
      montantRecu: totalPaiements,
      monnaieRendue: monnaie,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="modal-overlay" onClick={onFermer}
    >
      <motion.div
        initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 50 }}
        className="modal-content max-w-lg" onClick={e => e.stopPropagation()}
      >
        <header className="p-6 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Paiement</h3>
          <button onClick={onFermer} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <X className="w-5 h-5" />
          </button>
        </header>

        <div className="p-6 space-y-6">
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center">
            <p className="text-sm text-purple-800 dark:text-purple-300">Total à payer</p>
            <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">{totalGeneral.toLocaleString()} FCFA</p>
          </div>

          <div className="space-y-4">
            <PaymentInput mode="especes" label="Espèces" Icon={Banknote} value={modesPaiement.especes} onChange={gererChangementPaiement} />
            <PaymentInput mode="carte" label="Carte bancaire" Icon={CreditCard} value={modesPaiement.carte} onChange={gererChangementPaiement} />
            <PaymentInput mode="mobileMoney" label="Mobile Money" Icon={Smartphone} value={modesPaiement.mobileMoney} onChange={gererChangementPaiement} />
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2 text-sm">
            <div className="flex justify-between"><span>Total reçu:</span><span className="font-medium">{totalPaiements.toLocaleString()} FCFA</span></div>
            <div className={`flex justify-between font-medium ${paiementInsuffisant ? 'text-red-500' : 'text-green-500'}`}>
              <span>{paiementInsuffisant ? 'Montant restant:' : 'Monnaie à rendre:'}</span>
              <span>{paiementInsuffisant ? (totalGeneral - totalPaiements).toLocaleString() : monnaie.toLocaleString()} FCFA</span>
            </div>
          </div>
        </div>

        <footer className="p-6 flex space-x-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" onClick={onFermer} className="flex-1">Annuler</Button>
          <Button onClick={gererFinalisation} disabled={paiementInsuffisant} className="flex-1 pos-button">
            <Receipt className="w-5 h-5 mr-2" />Finaliser
          </Button>
        </footer>
      </motion.div>
    </motion.div>
  );
};

const PaymentInput = ({ mode, label, Icon, value, onChange }) => (
  <div className="flex items-center space-x-4">
    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
      <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
    </div>
    <div className="flex-1">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <input
        type="number"
        value={value || ''}
        onChange={(e) => onChange(mode, e.target.value)}
        className="form-input mt-1"
        placeholder="0"
      />
    </div>
  </div>
);

export default PaymentModal;