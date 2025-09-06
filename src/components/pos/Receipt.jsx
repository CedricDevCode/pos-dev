
import React, { forwardRef } from 'react';

const Receipt = forwardRef(({ vente, activite }, ref) => {
  if (!vente || !activite) {
    return <div ref={ref}>Données de reçu manquantes.</div>;
  }

  return (
    <div ref={ref} className="bg-white text-black p-2 w-[72mm] mx-auto font-mono text-xs">
      <div className="text-center mb-2">
        <h2 className="font-bold text-sm">{activite.nom}</h2>
        <p>{activite.adresse}</p>
        <p>{activite.telephone}</p>
      </div>
      <div className="border-t border-b border-dashed border-gray-400 py-1 my-1">
        <p>Reçu: {vente.numero}</p>
        <p>Date: {new Date(vente.date).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
      </div>
      <table className="w-full my-1">
        <thead>
          <tr className="border-b border-dashed border-gray-400">
            <th className="text-left">PRODUIT</th>
            <th className="text-center">QTE</th>
            <th className="text-right">PRIX</th>
          </tr>
        </thead>
        <tbody>
          {vente.articles.map((article, index) => (
            <tr key={index}>
              <td className="text-left w-1/2 break-words">{article.nom}</td>
              <td className="text-center">{article.quantite}</td>
              <td className="text-right">{(article.quantite * article.prix).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="border-t border-dashed border-gray-400 pt-1 mt-1">
        <div className="flex justify-between"><span>SOUS-TOTAL:</span><span>{vente.sousTotal.toLocaleString()}</span></div>
        <div className="flex justify-between"><span>TAXE ({activite.tauxTaxe}%):</span><span>{vente.taxe.toLocaleString()}</span></div>
        <div className="flex justify-between font-bold text-sm mt-1"><span>TOTAL:</span><span>{vente.total.toLocaleString()} FCFA</span></div>
      </div>
       <div className="border-t border-dashed border-gray-400 pt-1 mt-1">
        {Object.entries(vente.modesPaiement).filter(([, montant]) => montant > 0).map(([mode, montant]) => (
           <div key={mode} className="flex justify-between">
             <span className="capitalize">Payé ({mode.replace('mobileMoney', 'Mobile')})</span>
             <span>{montant.toLocaleString()}</span>
           </div>
        ))}
        <div className="flex justify-between"><span>MONNAIE RENDUE:</span><span>{vente.monnaieRendue.toLocaleString()}</span></div>
      </div>
      <p className="text-center mt-2">Merci pour votre achat !</p>
    </div>
  );
});

export default Receipt;
