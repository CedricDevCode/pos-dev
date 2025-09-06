import React from 'react';
import { motion } from 'framer-motion';
import { MoreHorizontal, PlusCircle, MinusCircle, Edit, Trash2, ToggleLeft, ToggleRight, Package, ImageOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge.jsx';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

const ProductList = ({ produits, onModifier, onSupprimer, onToggleActif }) => {

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(amount);
  };
  
  const StockBadge = ({ stock, stockMin }) => {
    if (stock === 0) {
      return <Badge variant="destructive">Rupture</Badge>;
    }
    if (stock <= stockMin) {
      return <Badge variant="warning">Faible</Badge>;
    }
    return <Badge variant="success">En stock</Badge>;
  };

  if (produits.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/20 rounded-lg">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Aucun produit trouvé
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Essayez d'ajuster vos filtres ou d'ajouter un nouveau produit.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden"
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Image</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead className="text-right">Prix de Vente</TableHead>
            <TableHead className="text-right">Stock Actuel</TableHead>
            <TableHead>État</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {produits.map((produit) => (
            <motion.tr variants={itemVariants} key={produit.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
               <TableCell>
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center overflow-hidden">
                  {produit.image ? (
                    <img 
                      src={produit.image}
                      alt={produit.nom}
                      className="w-full h-full object-cover"
                     src="https://images.unsplash.com/photo-1692043772299-d114658469a8" />
                  ) : (
                    <ImageOff className="w-6 h-6 text-gray-400" />
                  )}
                </div>
              </TableCell>
              <TableCell className="font-medium">{produit.nom}</TableCell>
              <TableCell>{produit.categorie}</TableCell>
              <TableCell className="text-right">{formatCurrency(produit.prixVente)}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end space-x-2">
                  <span>{produit.stock}</span>
                  <StockBadge stock={produit.stock} stockMin={produit.stockMin} />
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={produit.actif ? 'outline' : 'secondary'}>
                  {produit.actif ? 'Actif' : 'Inactif'}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Ouvrir le menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onModifier(produit)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Modifier
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onToggleActif(produit)}>
                      {produit.actif ? (
                        <ToggleLeft className="mr-2 h-4 w-4" />
                      ) : (
                        <ToggleRight className="mr-2 h-4 w-4" />
                      )}
                      {produit.actif ? 'Désactiver' : 'Activer'}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onSupprimer(produit)}
                      className="text-red-600 dark:text-red-500"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  );
};

export default ProductList;