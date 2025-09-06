import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Package, AlertTriangle } from 'lucide-react';

const ProductStats = ({ produits }) => {
  const valeurTotaleStock = produits.reduce((acc, p) => acc + (p.prixAchat * p.stock), 0);
  const produitsActifs = produits.filter(p => p.actif).length;
  const produitsInactifs = produits.length - produitsActifs;
  const produitsEnRupture = produits.filter(p => p.stock === 0).length;

  const stats = [
    { title: "Valeur Totale du Stock", value: `${valeurTotaleStock.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}`, icon: DollarSign, color: "text-green-500" },
    { title: "Produits Actifs", value: produitsActifs, icon: Package, color: "text-blue-500" },
    { title: "Produits en Rupture", value: produitsEnRupture, icon: AlertTriangle, color: "text-red-500" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 text-muted-foreground ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default ProductStats;