import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowDown, ArrowUp, Edit, Check } from 'lucide-react';

const StockList = ({ produits, onAjustementRapide, onOuvrirModale }) => {
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState(0);

  const startEditing = (produit) => {
    setEditingId(produit.id);
    setEditingValue(produit.stock);
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const confirmEditing = (produit) => {
    onAjustementRapide(produit, parseInt(editingValue));
    setEditingId(null);
  };

  return (
    <div className="rounded-lg border dark:border-gray-700 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Produit</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead className="text-right">Stock Actuel</TableHead>
            <TableHead className="text-right">Stock Minimum</TableHead>
            <TableHead className="text-center w-[250px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {produits.map((produit) => (
            <TableRow key={produit.id}>
              <TableCell className="font-medium">{produit.nom}</TableCell>
              <TableCell>{produit.categorie}</TableCell>
              <TableCell className={`text-right font-bold ${produit.stock === 0 ? 'text-red-500' : (produit.stock <= produit.stockMin ? 'text-yellow-500' : 'text-green-500')}`}>
                {editingId === produit.id ? (
                  <div className="flex items-center justify-end">
                    <Input
                      type="number"
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      className="w-20 h-8 text-right"
                      autoFocus
                      onBlur={() => cancelEditing()}
                      onKeyDown={(e) => e.key === 'Enter' && confirmEditing(produit)}
                    />
                  </div>
                ) : (
                  <span>{produit.stock}</span>
                )}
              </TableCell>
              <TableCell className="text-right">{produit.stockMin}</TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => onOuvrirModale(produit, 'entree')}>
                    <ArrowUp className="w-4 h-4 mr-1" /> Entrée
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onOuvrirModale(produit, 'sortie')}>
                    <ArrowDown className="w-4 h-4 mr-1" /> Sortie
                  </Button>
                  {editingId === produit.id ? (
                      <Button variant="ghost" size="icon" onClick={() => confirmEditing(produit)}>
                          <Check className="w-4 h-4 text-green-500" />
                      </Button>
                  ) : (
                      <Button variant="ghost" size="icon" onClick={() => startEditing(produit)}>
                          <Edit className="w-4 h-4" />
                      </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StockList;