import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

const ProductFilters = ({
  recherche,
  setRecherche,
  categorieFiltre,
  setCategorieFiltre,
  stockFiltre,
  setStockFiltre,
  categories,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Rechercher par nom ou description..."
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={categorieFiltre} onValueChange={setCategorieFiltre}>
        <SelectTrigger>
          <SelectValue placeholder="Filtrer par catégorie" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Toutes les catégories</SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat.id} value={cat.nom}>{cat.nom}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={stockFiltre} onValueChange={setStockFiltre}>
        <SelectTrigger>
          <SelectValue placeholder="Filtrer par stock" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="tous">Tous les stocks</SelectItem>
          <SelectItem value="faible">Stock faible</SelectItem>
          <SelectItem value="rupture">En rupture de stock</SelectItem>
          <SelectItem value="normal">Stock normal</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProductFilters;