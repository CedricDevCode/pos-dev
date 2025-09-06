import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Printer, Download, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/components/ui/use-toast';
import { genererRapportCloturePDF } from '@/lib/pdfGenerator';

const CloseRegisterModal = ({ session, onFermer, onCloturer }) => {
  const { activiteActive, utilisateurConnecte } = useApp();
  const { toast } = useToast();
  const [compteFinal, setCompteFinal] = useState('');

  const detailsSession = useMemo(() => {
    const ventes = session?.ventes || [];
    
    const totalVentesEspeces = ventes
      .filter(v => v.modesPaiement.especes > 0)
      .reduce((sum, v) => sum + v.modesPaiement.especes, 0);

    const totalVentesCarte = ventes
      .filter(v => v.modesPaiement.carte > 0)
      .reduce((sum, v) => sum + v.modesPaiement.carte, 0);

    const totalVentesMobile = ventes
      .filter(v => v.modesPaiement.mobileMoney > 0)
      .reduce((sum, v) => sum + v.modesPaiement.mobileMoney, 0);

    const totalVentes = totalVentesEspeces + totalVentesCarte + totalVentesMobile;
    const totalAttendu = (session?.soldeInitial || 0) + totalVentesEspeces;
    const ecart = parseFloat(compteFinal || 0) - totalAttendu;

    return {
      totalVentesEspeces,
      totalVentesCarte,
      totalVentesMobile,
      totalVentes,
      totalAttendu,
      ecart,
      ventes,
    };
  }, [session, compteFinal]);

  const handleExportPDF = () => {
    try {
      genererRapportCloturePDF(session, detailsSession, activiteActive, utilisateurConnecte, compteFinal);
      toast({ title: "✅ PDF Généré", description: "Le rapport de clôture a été téléchargé.", className: "toast-success" });
    } catch (error) {
      console.error("Erreur PDF:", error);
      toast({ title: "❌ Erreur PDF", description: "Impossible de générer le rapport.", className: "toast-error" });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onFermer();
      if (e.key === 'Enter' && compteFinal) onCloturer(detailsSession);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onFermer, onCloturer, compteFinal, detailsSession]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="modal-overlay" onClick={onFermer}
    >
      <motion.div
        initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 50 }}
        className="modal-content max-w-md" onClick={e => e.stopPropagation()}
      >
        <header className="p-6 flex justify-between items-center border-b">
          <h3 className="text-xl font-semibold">Fermeture de Caisse</h3>
          <button onClick={onFermer} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <X className="w-5 h-5" />
          </button>
        </header>

        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto hide-scrollbar">
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between"><span>Solde d'ouverture:</span><span className="font-medium">{(session?.soldeInitial || 0).toLocaleString()} FCFA</span></div>
            <div className="flex justify-between"><span>Ventes en espèces:</span><span className="font-medium">{detailsSession.totalVentesEspeces.toLocaleString()} FCFA</span></div>
            <div className="flex justify-between"><span>Total attendu en caisse:</span><strong className="text-purple-600 dark:text-purple-400">{detailsSession.totalAttendu.toLocaleString()} FCFA</strong></div>
          </div>
          
          <div>
            <label htmlFor="compteFinal" className="form-label">Montant compté en caisse</label>
            <input
              id="compteFinal"
              type="number"
              value={compteFinal}
              onChange={(e) => setCompteFinal(e.target.value)}
              className="form-input"
              placeholder="0"
              autoFocus
            />
          </div>

          {compteFinal && (
            <div className={`p-4 rounded-lg ${detailsSession.ecart === 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
              <div className="flex justify-between font-bold">
                <span>Écart de caisse:</span>
                <span className={detailsSession.ecart >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                  {detailsSession.ecart.toLocaleString()} FCFA
                </span>
              </div>
            </div>
          )}

          <div className="border-t pt-4 mt-4 space-y-2">
            <div className="flex justify-between"><span>Ventes par carte:</span><span className="font-medium">{detailsSession.totalVentesCarte.toLocaleString()} FCFA</span></div>
            <div className="flex justify-between"><span>Ventes Mobile Money:</span><span className="font-medium">{detailsSession.totalVentesMobile.toLocaleString()} FCFA</span></div>
            <div className="flex justify-between font-bold text-lg"><span>Total des ventes:</span><span className="font-medium">{detailsSession.totalVentes.toLocaleString()} FCFA</span></div>
          </div>
        </div>

        <footer className="p-6 flex flex-col sm:flex-row gap-2 border-t">
          <Button onClick={() => toast({ title: "🚧 Bientôt disponible", description: "L'impression directe sera bientôt implémentée."})} variant="outline" className="flex-1"><Printer className="w-4 h-4 mr-2" />Imprimer</Button>
          <Button onClick={handleExportPDF} variant="outline" className="flex-1"><Download className="w-4 h-4 mr-2" />Exporter PDF</Button>
          <Button onClick={() => onCloturer(detailsSession)} disabled={!compteFinal} className="flex-1 pos-button">
            <LogOut className="w-4 h-4 mr-2" />Clôturer la session
          </Button>
        </footer>
      </motion.div>
    </motion.div>
  );
};

export default CloseRegisterModal;