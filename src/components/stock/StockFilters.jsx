import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/**
 * StockFilters : composant qui affiche les filtres de recherche
 * - recherche par nom de produit
 * - filtre par catégorie (prop venant de GestionStock, calculée via AppContext)
 * - filtre par état du stock
 */
const StockFilters = ({
  recherche,
  setRecherche,
  categorieFiltre,
  setCategorieFiltre,
  stockFiltre,
  setStockFiltre,
  categories // <-- vient de GestionStock
}) => {
  return (
    <div className="flex gap-4 flex-wrap items-center">
      {/* Recherche */}
      <Input
        placeholder="Rechercher un produit..."
        value={recherche}
        onChange={(e) => setRecherche(e.target.value)}
        className="w-64"
      />

      {/* Filtre par catégorie */}
      <Select
        value={categorieFiltre}
        onValueChange={(val) => setCategorieFiltre(val)}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Toutes les catégories" />
        </SelectTrigger>
        <SelectContent>
          {/* Valeur spéciale pour "toutes les catégories" */}
          <SelectItem value="toutes">Toutes les catégories</SelectItem>
          {categories.map((cat, i) => (
            <SelectItem key={i} value={cat}>
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Filtre par stock */}
      <Select
        value={stockFiltre}
        onValueChange={(val) => setStockFiltre(val)}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="État du stock" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="tous">Tous</SelectItem>
          <SelectItem value="disponible">Disponible</SelectItem>
          <SelectItem value="rupture">En rupture</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default StockFilters;
