import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Printer, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const ReceiptModal = ({ vente, activite, onFermer }) => {
  const { toast } = useToast();
  const printButtonRef = useRef(null);

  if (!vente) return null; // sécurité si vente est null

  // Impression ticket
  const handlePrint = () => {
    const content = document.getElementById('receipt-content');
    if (!content) return;

    const printWindow = window.open('', '_blank', 'width=300,height=600');
    if (!printWindow) {
      toast({
        title: "⚠️ Impression bloquée",
        description: "Veuillez autoriser les popups pour imprimer le ticket.",
        className: "toast-error"
      });
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Ticket de Caisse - ${vente.numero || '---'}</title>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Courier New', monospace; margin:0; padding:10px; font-size:12px; background:white; color:black; width:72mm; }
          .ticket-container { width:72mm; margin:0 auto; padding:10px; }
          .text-center { text-align:center; }
          .font-bold { font-weight:bold; }
          .text-sm { font-size:14px; }
          .border-t { border-top:1px dashed #000; }
          .border-b { border-bottom:1px dashed #000; }
          .border-dashed { border-style:dashed; }
          .py-1 { padding-top:4px; padding-bottom:4px; }
          .my-1 { margin-top:4px; margin-bottom:4px; }
          .mt-2 { margin-top:8px; }
          table { width:100%; border-collapse:collapse; }
          th { text-align:left; border-bottom:1px dashed #000; padding:4px 0; }
          td { padding:2px 0; }
          .text-left { text-align:left; }
          .text-center { text-align:center; }
          .text-right { text-align:right; }
          .flex { display:flex; }
          .justify-between { justify-content:space-between; }
          @media print { @page { margin:0; size:72mm auto; } body { margin:0; padding:0; width:72mm; } .ticket-container { padding:5px; width:72mm; } }
        </style>
      </head>
      <body>
        <div class="ticket-container">
          ${content.innerHTML}
        </div>
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() {
              window.close();
              if (window.opener) {
                window.opener.postMessage('print-completed', '*');
              }
            }, 500);
          };
        </script>
      </body>
      </html>
    `);

    printWindow.document.close();
  };

  // Fermer modal après impression terminée
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data === 'print-completed') onFermer();
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onFermer]);

  // Raccourci clavier : touche Entrée = impression
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        printButtonRef.current?.click();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Bouton Email (non implémenté encore)
  const handleEmail = () => {
    toast({
      title: "📧 Envoi par e-mail",
      description: "🚧 Cette fonctionnalité n'est pas encore disponible.",
      className: "toast-warning"
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onFermer}
    >
      <motion.div
        initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 50 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-sm w-full"
        onClick={(e) => e.stopPropagation()} // empêche fermeture au clic intérieur
      >
        {/* HEADER */}
        <header className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Reçu de vente</h3>
          <button onClick={onFermer} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* CONTENU DU REÇU */}
        <div className="p-4 max-h-[60vh] overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div
            id="receipt-content"
            className="bg-white dark:bg-gray-800 text-black dark:text-white p-2 w-[72mm] mx-auto font-mono text-xs"
          >
            <div className="text-center mb-2">
              <h2 className="font-bold text-sm">{activite?.nom || '---'}</h2>
              <p>{activite?.adresse || ''}</p>
              <p>{activite?.telephone || ''}</p>
            </div>

            <div className="border-t border-b border-dashed border-gray-400 dark:border-gray-500 py-1 my-1">
              <p>Reçu: {vente.numero || '---'}</p>
              <p>Date: {vente.dateVente ? new Date(vente.dateVente).toLocaleString('fr-FR', {
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
              }) : '---'}</p>
              <p>Caissier: {vente.nomCaissier || '---'}</p>
            </div>

            <table className="w-full my-1">
              <thead>
                <tr className="border-b border-dashed border-gray-400 dark:border-gray-500">
                  <th className="text-left">PRODUIT</th>
                  <th className="text-center">QTE</th>
                  <th className="text-right">PRIX</th>
                </tr>
              </thead>
              <tbody>
                {vente.articles?.length > 0 ? vente.articles.map((article, index) => (
                  <tr key={index}>
                    <td className="text-left">{article.nom}</td>
                    <td className="text-center">{article.quantite}</td>
                    <td className="text-right">{(article.quantite * article.prix).toLocaleString()}</td>
                  </tr>
                )) : (
                  <tr><td colSpan="3" className="text-center">Aucun article</td></tr>
                )}
              </tbody>
            </table>

            <div className="border-t border-dashed border-gray-400 dark:border-gray-500 pt-1 mt-1">
              <div className="flex justify-between">
                <span>SOUS-TOTAL:</span>
                <span>{vente.sousTotal?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>TAXE ({activite?.tauxTaxe || 0}%):</span>
                <span>{vente.taxe?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between font-bold text-sm mt-1">
                <span>TOTAL:</span>
                <span>{vente.total?.toLocaleString() || 0} FCFA</span>
              </div>
            </div>

            {vente.modesPaiement && (
              <div className="border-t border-dashed border-gray-400 dark:border-gray-500 pt-1 mt-1">
                {Object.entries(vente.modesPaiement).filter(([, montant]) => montant > 0).map(([mode, montant]) => (
                  <div key={mode} className="flex justify-between">
                    <span>Payé ({mode}):</span>
                    <span>{montant.toLocaleString()}</span>
                  </div>
                ))}
                {vente.monnaieRendue > 0 && (
                  <div className="flex justify-between">
                    <span>MONNAIE RENDUE:</span>
                    <span>{vente.monnaieRendue.toLocaleString()}</span>
                  </div>
                )}
              </div>
            )}

            <p className="text-center mt-2">Merci pour votre achat !</p>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="p-4 flex space-x-2 border-t border-gray-200 dark:border-gray-700">
          <Button ref={printButtonRef} onClick={handlePrint} variant="outline" className="flex-1">
            <Printer className="w-4 h-4 mr-2" /> Imprimer (Entrée)
          </Button>
          <Button onClick={handleEmail} variant="outline" className="flex-1">
            <Mail className="w-4 h-4 mr-2" /> E-mail
          </Button>
          <Button onClick={onFermer} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
            Fermer
          </Button>
        </footer>
      </motion.div>
    </motion.div>
  );
};

export default ReceiptModal;
