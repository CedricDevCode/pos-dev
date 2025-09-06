import jsPDF from 'jspdf';
import 'jspdf-autotable';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

// Fonction pour générer un PDF simple
export const generatePdf = () => {
  const doc = new jsPDF();

  doc.text("Rapport de Ventes", 20, 10);
  doc.autoTable({
    head: [['Produit', 'Quantité', 'Prix Unitaire', 'Total']],
    body: [
      ['Thieboudienne', '2', '2500 FCFA', '5000 FCFA'],
      ['Yassa Poulet', '1', '3000 FCFA', '3000 FCFA'],
      ['Bissap', '3', '500 FCFA', '1500 FCFA'],
    ],
  });

  doc.save('rapport-ventes.pdf');
};

// Fonction pour générer un fichier Excel simple
export const generateExcel = async () => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Rapport de Ventes');

  worksheet.columns = [
    { header: 'Produit', key: 'produit', width: 30 },
    { header: 'Quantité', key: 'quantite', width: 10 },
    { header: 'Prix Unitaire', key: 'prix', width: 15 },
    { header: 'Total', key: 'total', width: 15 },
  ];

  worksheet.addRow({ produit: 'Thieboudienne', quantite: 2, prix: 2500, total: 5000 });
  worksheet.addRow({ produit: 'Yassa Poulet', quantite: 1, prix: 3000, total: 3000 });
  worksheet.addRow({ produit: 'Bissap', quantite: 3, prix: 500, total: 1500 });

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), 'rapport-ventes.xlsx');
};