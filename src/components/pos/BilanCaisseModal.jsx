import React from 'react';
import { motion } from 'framer-motion';
import { X, Printer, Save, Receipt, Calendar, User, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BilanCaisseModal = ({ bilan, activite, onFermer, isOpen }) => {
  if (!isOpen) return null; // <-- NE PAS RENDRE LA MODAL SI ISOPEN = false

  // --- Fonctions utilitaires ---
  const formatDateWithTime = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR') + ' ' + date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatMontantAvecSeparateur = (montant) => {
    if (montant == null) return '0';
    return montant.toLocaleString('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).replace(/\s/g, '');
  };

  const ventes = bilan?.ventes || [];

  const totalArticlesVendus = ventes.reduce((total, vente) => {
    const articles = vente?.articles || [];
    return total + articles.reduce((sum, article) => sum + (article.quantite || 0), 0);
  }, 0);

  const articlesParProduit = {};
  ventes.forEach(vente => {
    (vente?.articles || []).forEach(article => {
      const nom = article.nom || 'Inconnu';
      const quantite = article.quantite || 0;
      const total = (article.prix || 0) * quantite;
      if (articlesParProduit[nom]) {
        articlesParProduit[nom].quantite += quantite;
        articlesParProduit[nom].total += total;
      } else {
        articlesParProduit[nom] = { quantite, total };
      }
    });
  });

  const genererPDF = async () => {
    try {
      const { default: jsPDF } = await import('jspdf');
      const { default: autoTable } = await import('jspdf-autotable');

      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text(activite?.nom || 'Activité', 105, 15, { align: 'center' });
      doc.setFontSize(12);
      doc.text('Bilan de Caisse', 105, 22, { align: 'center' });
      doc.setFontSize(10);
      doc.text(`Ouverture: ${formatDateWithTime(bilan?.dateOuverture)}`, 14, 35);
      doc.text(`Fermeture: ${formatDateWithTime(bilan?.dateFermeture)}`, 14, 40);
      if (bilan?.nomCaissier) doc.text(`Caissier: ${bilan.nomCaissier}`, 14, 45);

      const resumeData = [
        ['Fonds initial', `${formatMontantAvecSeparateur(bilan?.fondsInitial)} FCFA`],
        ['Solde final', `${formatMontantAvecSeparateur(bilan?.soldeFinal)} FCFA`],
        ['Total des ventes', `${formatMontantAvecSeparateur(bilan?.totalVentes)} FCFA`],
        ['Nombre de ventes', `${bilan?.nombreVentes || 0}`],
        ['Total articles vendus', `${totalArticlesVendus} unités`],
        ['Différence', `${formatMontantAvecSeparateur(bilan?.difference)} FCFA`]
      ];

      autoTable(doc, {
        startY: 60,
        head: [['Désignation', 'Montant']],
        body: resumeData,
        theme: 'grid',
        headStyles: { fillColor: [66, 135, 245] },
        styles: { fontSize: 10 },
        margin: { left: 14, right: 14 }
      });

      const articlesData = Object.entries(articlesParProduit).map(([nom, details]) => [
        nom,
        details.quantite.toString(),
        `${formatMontantAvecSeparateur(details.total)} FCFA`
      ]);
      articlesData.push(['TOTAL', totalArticlesVendus.toString(), `${formatMontantAvecSeparateur(bilan?.totalVentes)} FCFA`]);

      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 15,
        head: [['Article', 'Quantité', 'Total']],
        body: articlesData,
        theme: 'grid',
        headStyles: { fillColor: [66, 135, 245] },
        styles: { fontSize: 9 },
        margin: { left: 14, right: 14 },
        foot: [['TOTAL', totalArticlesVendus.toString(), `${formatMontantAvecSeparateur(bilan?.totalVentes)} FCFA`]],
        footStyles: { fillColor: [220, 220, 220] }
      });

      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(`Page ${i} sur ${pageCount}`, 105, 285, { align: 'center' });
        doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 105, 290, { align: 'center' });
      }

      doc.save(`bilan-caisse-${new Date(bilan?.dateFermeture || Date.now()).toLocaleDateString('fr-FR')}.pdf`);
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      alert('Impossible de générer le PDF. Vérifiez la console pour plus de détails.');
    }
  };

  const handleImprimer = () => {
    const contenu = document.createElement('div');
    contenu.innerHTML = `<pre>${JSON.stringify(bilan, null, 2)}</pre>`;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(contenu.innerHTML);
    printWindow.document.close();
    printWindow.onload = () => printWindow.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* ... contenu complet de la modal ... */}
      </motion.div>
    </div>
  );
};

export default BilanCaisseModal;
