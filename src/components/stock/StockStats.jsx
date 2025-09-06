import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Archive, AlertCircle } from 'lucide-react';

const StockStats = ({ produits }) => {
  const valeurTotaleStock = produits.reduce((acc, p) => acc + (p.prixAchat * p.stock), 0);
  const articlesUniques = produits.length;
  const articlesEnStockFaible = produits.filter(p => p.stock > 0 && p.stock <= p.stockMin).length;

  const stats = [
    { title: "Valeur totale du stock", value: `${valeurTotaleStock.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}`, icon: DollarSign },
    { title: "Articles uniques", value: articlesUniques, icon: Archive },
    { title: "Articles en stock faible", value: articlesEnStockFaible, icon: AlertCircle },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StockStats;