
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const genererRapportCloturePDF = (session, details, activite, utilisateur, compteFinal) => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text(`Rapport de Clôture de Caisse`, 14, 22);
  doc.setFontSize(12);
  doc.text(`Activité: ${activite.nom}`, 14, 30);
  
  doc.autoTable({
    startY: 40,
    head: [['Information', 'Détail']],
    body: [
      ['ID Session', session.id],
      ['Date d\'ouverture', new Date(session.dateOuverture).toLocaleString()],
      ['Date de clôture', new Date().toLocaleString()],
      ['Utilisateur', utilisateur.nom],
    ],
    theme: 'striped',
  });

  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 10,
    head: [['Résumé Financier', 'Montant (FCFA)']],
    body: [
      ['Solde d\'ouverture', session.soldeInitial.toLocaleString()],
      ['Ventes en espèces', details.totalVentesEspeces.toLocaleString()],
      ['Total attendu en caisse', details.totalAttendu.toLocaleString()],
      ['Montant compté', parseFloat(compteFinal).toLocaleString()],
      [{ content: 'Écart de caisse', styles: { fontStyle: 'bold' } }, { content: details.ecart.toLocaleString(), styles: { fontStyle: 'bold', textColor: details.ecart === 0 ? [0,0,0] : [255, 0, 0] } }],
      ['Ventes par carte', details.totalVentesCarte.toLocaleString()],
      ['Ventes Mobile Money', details.totalVentesMobile.toLocaleString()],
      [{ content: 'Total des ventes (tous paiements)', styles: { fontStyle: 'bold' } }, { content: details.totalVentes.toLocaleString(), styles: { fontStyle: 'bold' } }],
    ],
    theme: 'grid',
  });

  if (details.ventes && details.ventes.length > 0) {
    doc.addPage();
    doc.setFontSize(16);
    doc.text('Détail des Ventes', 14, 22);
    doc.autoTable({
      startY: 30,
      head: [['#', 'Heure', 'Articles', 'Total (FCFA)']],
      body: details.ventes.map(v => [
        v.numero,
        new Date(v.date).toLocaleTimeString(),
        v.articles.map(a => `${a.quantite}x ${a.nom}`).join(', '),
        v.total.toLocaleString(),
      ]),
      theme: 'striped',
    });
  } else {
     doc.setFontSize(12);
     doc.text('Aucune vente enregistrée pour cette session.', 14, doc.lastAutoTable.finalY + 20);
  }

  const nomFichier = `Rapport_Cloture_${session.id}.pdf`;
  doc.save(nomFichier);
};

export const genererRecuPDF = (vente, activite) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [72, 297] 
  });

  let y = 10;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(activite.nom, 36, y, { align: 'center' });
  y += 6;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(activite.adresse || 'Adresse non configurée', 36, y, { align: 'center' });
  y += 4;
  doc.text(`Tel: ${activite.telephone || 'N/A'}`, 36, y, { align: 'center' });
  y += 8;

  doc.text(`Reçu #: ${vente.numero}`, 5, y);
  y += 4;
  doc.text(`Date: ${new Date(vente.date).toLocaleString()}`, 5, y);
  y += 6;

  doc.setLineDash([1, 1], 0);
  doc.line(5, y, 67, y);
  y += 4;

  doc.autoTable({
    startY: y,
    head: [['Qte', 'Article', 'Total']],
    body: vente.articles.map(item => [item.quantite, item.nom, (item.quantite * item.prix).toLocaleString()]),
    theme: 'plain',
    styles: { fontSize: 8, cellPadding: 0.5 },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 35 },
      2: { cellWidth: 'auto', halign: 'right' },
    },
    margin: { left: 5, right: 5 },
    tableWidth: 'auto'
  });

  y = doc.lastAutoTable.finalY + 5;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Total:', 5, y);
  doc.text(`${vente.total.toLocaleString()} FCFA`, 67, y, { align: 'right' });
  y += 6;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  const modesPaiement = Object.entries(vente.modesPaiement)
    .filter(([, montant]) => montant > 0)
    .map(([mode, montant]) => `${mode.charAt(0).toUpperCase() + mode.slice(1)}: ${montant.toLocaleString()} FCFA`)
    .join(', ');
  doc.text(`Payé par: ${modesPaiement}`, 5, y);
  y += 4;
  if(vente.monnaieRendue > 0) {
    doc.text(`Monnaie: ${vente.monnaieRendue.toLocaleString()} FCFA`, 5, y);
    y+=4;
  }
  y += 4;

  doc.setLineDash([1, 1], 0);
  doc.line(5, y, 67, y);
  y += 6;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.text('Merci de votre visite !', 36, y, { align: 'center' });

  const nomFichier = `Recu_${vente.numero}.pdf`;
  doc.save(nomFichier);
};
