import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

const StockFilters = ({ 
  recherche, 
  setRecherche, 
  categorieFiltre, 
  setCategorieFiltre, 
  stockFiltre, 
  setStockFiltre, 
  categories 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un produit..."
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={categorieFiltre} onValueChange={setCategorieFiltre}>
        <SelectTrigger>
          <SelectValue placeholder="Toutes les catégories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Toutes les catégories</SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={stockFiltre} onValueChange={setStockFiltre}>
        <SelectTrigger>
          <SelectValue placeholder="Tous les stocks" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="tous">Tous les stocks</SelectItem>
          <SelectItem value="faible">Stock faible</SelectItem>
          <SelectItem value="rupture">En rupture de stock</SelectItem>
          <SelectItem value="normal">Stock suffisant</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default StockFilters;