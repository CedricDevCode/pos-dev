
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { X, Banknote, CreditCard, Smartphone, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

const PaymentModal = ({ panier, tauxTaxe, onFermer, onFinaliser }) => {
  const { toast } = useToast();
  
  const [especes, setEspeces] = useState('');
  const [carte, setCarte] = useState('');
  const [mobileMoney, setMobileMoney] = useState('');

  const { totalGeneral, totalPaiements, monnaie, paiementInsuffisant } = useMemo(() => {
    const sousTotal = panier.reduce((total, item) => total + (item.prix * item.quantite), 0);
    const montantTaxe = (sousTotal * tauxTaxe) / 100;
    const totalGeneral = sousTotal + montantTaxe;
    
    const valEspeces = parseFloat(especes) || 0;
    const valCarte = parseFloat(carte) || 0;
    const valMobile = parseFloat(mobileMoney) || 0;
    const totalPaiements = valEspeces + valCarte + valMobile;
    
    const monnaie = Math.max(0, totalPaiements - totalGeneral);
    const paiementInsuffisant = totalPaiements < totalGeneral;

    return { totalGeneral, totalPaiements, monnaie, paiementInsuffisant };
  }, [panier, tauxTaxe, especes, carte, mobileMoney]);

  const gererFinalisation = () => {
    if (paiementInsuffisant) {
      toast({
        title: "❌ Paiement insuffisant",
        description: `Montant manquant: ${(totalGeneral - totalPaiements).toLocaleString()} FCFA`,
        variant: "destructive",
      });
      return;
    }
    onFinaliser({
      modesPaiement: {
        especes: parseFloat(especes) || 0,
        carte: parseFloat(carte) || 0,
        mobileMoney: parseFloat(mobileMoney) || 0,
      },
      montantRecu: totalPaiements,
      monnaieRendue: monnaie,
    });
  };

  const setPaiementRapide = (montant) => {
    setEspeces(montant.toString());
    setCarte('');
    setMobileMoney('');
  }

  const getNextHighestBill = (amount) => {
    if (amount <= 500) return 500;
    if (amount <= 1000) return 1000;
    if (amount <= 2000) return 2000;
    if (amount <= 5000) return 5000;
    if (amount <= 10000) return 10000;
    const roundedUp = Math.ceil(amount / 5000) * 5000;
    return roundedUp;
  }
  
  const boutonsPaiementRapide = useMemo(() => {
    const exact = totalGeneral;
    const nextBill = getNextHighestBill(totalGeneral);
    const suggestions = new Set([exact]);
    if (nextBill > exact) suggestions.add(nextBill);
    return Array.from(suggestions);
  }, [totalGeneral]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="modal-overlay" onClick={onFermer}
    >
      <motion.div
        initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 50 }}
        className="modal-content max-w-lg w-full" onClick={e => e.stopPropagation()}
      >
        <header className="p-4 sm:p-6 flex justify-between items-center border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Paiement</h3>
          <button onClick={onFermer} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <X className="w-5 h-5" />
          </button>
        </header>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto flex-grow">
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center">
            <p className="text-sm text-purple-800 dark:text-purple-300">Total à payer</p>
            <p className="text-3xl sm:text-4xl font-bold text-purple-600 dark:text-purple-400">{totalGeneral.toLocaleString()} FCFA</p>
          </div>
          
          <div className="flex gap-2 justify-center flex-wrap">
            {boutonsPaiementRapide.map(montant => (
              <Button key={montant} variant="outline" size="sm" onClick={() => setPaiementRapide(montant)}>
                {montant.toLocaleString()}
              </Button>
            ))}
          </div>

          <div className="space-y-4">
            <PaymentInput mode="especes" label="Espèces" Icon={Banknote} value={especes} onChange={setEspeces} />
            <PaymentInput mode="carte" label="Carte bancaire" Icon={CreditCard} value={carte} onChange={setCarte} />
            <PaymentInput mode="mobileMoney" label="Mobile Money" Icon={Smartphone} value={mobileMoney} onChange={setMobileMoney} />
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-2 text-sm">
            <div className="flex justify-between"><span>Total reçu:</span><span className="font-medium">{totalPaiements.toLocaleString()} FCFA</span></div>
            <div className={`flex justify-between font-medium ${paiementInsuffisant ? 'text-red-500' : 'text-green-500'}`}>
              <span>{paiementInsuffisant ? 'Montant restant:' : 'Monnaie à rendre:'}</span>
              <span>{paiementInsuffisant ? (totalGeneral - totalPaiements).toLocaleString() : monnaie.toLocaleString()} FCFA</span>
            </div>
          </div>
        </div>

        <footer className="p-4 sm:p-6 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <Button variant="outline" onClick={onFermer} className="w-full sm:flex-1">Annuler</Button>
          <Button onClick={gererFinalisation} disabled={paiementInsuffisant} className="w-full sm:flex-1 pos-button">
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
      <Input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1"
        placeholder="0"
      />
    </div>
  </div>
);

export default PaymentModal;