
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useReactToPrint } from 'react-to-print';
import { X, Printer, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import Receipt from '@/components/pos/Receipt';
import { genererRecuPDF } from '@/lib/pdfGenerator';

const ReceiptModal = ({ vente, activite, onFermer }) => {
  const { toast } = useToast();
  const receiptRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => receiptRef.current,
    onBeforeGetContent: () => {
      toast({
        title: "🖨️ Préparation de l'impression...",
        description: "Le reçu est en cours de génération.",
      });
    },
    onAfterPrint: () => {
      toast({
        title: "✅ Impression lancée",
        description: "Le reçu a été envoyé à votre imprimante.",
        className: "toast-success"
      });
    },
    // La prop 'removeAfterPrint' est importante pour ne pas laisser de traces dans le DOM
    removeAfterPrint: true,
  });
  
  const handleDownload = () => {
    try {
      genererRecuPDF(vente, activite);
      toast({
        title: "📄 Téléchargement réussi",
        description: `Le reçu ${vente.numero}.pdf a été téléchargé.`,
        className: "toast-success"
      });
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
      toast({
        title: "Erreur de téléchargement",
        description: "Impossible de générer le reçu PDF.",
        variant: "destructive"
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="modal-overlay" onClick={onFermer}
    >
      <motion.div
        initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 50 }}
        className="modal-content max-w-sm" onClick={e => e.stopPropagation()}
      >
        <header className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Reçu de vente</h3>
          <button onClick={onFermer} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <X className="w-5 h-5" />
          </button>
        </header>

        <div className="p-4 max-h-[60vh] overflow-y-auto bg-gray-50 dark:bg-gray-900">
          {/* Le reçu visible à l'écran */}
          <Receipt vente={vente} activite={activite} />
          {/* Le reçu caché pour l'impression, avec le ref */}
          <div className="hidden">
            <Receipt ref={receiptRef} vente={vente} activite={activite} />
          </div>
        </div>

        <footer className="p-4 flex flex-col sm:flex-row gap-2 border-t border-gray-200 dark:border-gray-700">
          <Button onClick={handlePrint} variant="outline" className="flex-1"><Printer className="w-4 h-4 mr-2" />Imprimer</Button>
          <Button onClick={handleDownload} variant="outline" className="flex-1"><Download className="w-4 h-4 mr-2" />PDF</Button>
          <Button onClick={onFermer} className="flex-1 pos-button">Fermer</Button>
        </footer>
      </motion.div>
    </motion.div>
  );
};

export default ReceiptModal;
