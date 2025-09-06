import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Upload, X } from 'lucide-react';


const ProductModal = ({ isOpen, onClose, produit }) => {
  const { activiteActive, categories, ajouterProduit, modifierProduit } = useApp();
  const { toast } = useToast();
  
  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');
  const [categorie, setCategorie] = useState('');
  const [prixAchat, setPrixAchat] = useState(0);
  const [prixVente, setPrixVente] = useState(0);
  const [stock, setStock] = useState(0);
  const [stockMin, setStockMin] = useState(10);
  const [image, setImage] = useState(null);
  const [estActif, setEstActif] = useState(true);
  const [nouvelleCategorie, setNouvelleCategorie] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);

  const categoriesActivite = categories.filter(c => c.activiteId === activiteActive?.id);

  useEffect(() => {
    if (produit) {
      setNom(produit.nom);
      setDescription(produit.description || '');
      setCategorie(produit.categorie);
      setPrixAchat(produit.prixAchat || 0);
      setPrixVente(produit.prixVente);
      setStock(produit.stock);
      setStockMin(produit.stockMin);
      setImage(produit.image || null);
      setEstActif(produit.actif);
    } else {
      // Réinitialiser le formulaire pour un nouveau produit
      setNom('');
      setDescription('');
      setCategorie('');
      setPrixAchat(0);
      setPrixVente(0);
      setStock(0);
      setStockMin(10);
      setImage(null);
      setEstActif(true);
    }
  }, [produit, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nom || !prixVente) {
      toast({
        title: "Erreur de validation",
        description: "Le nom et le prix de vente sont obligatoires.",
        variant: "destructive",
      });
      return;
    }

    let finalCategory = categorie;
    if (showNewCategoryInput && nouvelleCategorie) {
      finalCategory = nouvelleCategorie;
      // Note: La logique pour ajouter une nouvelle catégorie devrait être dans le contexte
    }

    const donneesProduit = {
      nom,
      description,
      categorie: finalCategory,
      prixAchat: parseFloat(prixAchat),
      prixVente: parseFloat(prixVente),
      stock: parseInt(stock, 10),
      stockMin: parseInt(stockMin, 10),
      image,
      actif: estActif,
      activiteId: activiteActive.id,
    };

    if (produit) {
      modifierProduit(produit.id, donneesProduit);
      toast({
        title: "✅ Produit mis à jour",
        description: `${nom} a été modifié avec succès.`,
        className: "toast-success"
      });
    } else {
      ajouterProduit(donneesProduit);
      toast({
        title: "✨ Produit ajouté",
        description: `${nom} a été créé avec succès.`,
        className: "toast-success"
      });
    }
    
    onClose();
  };
  
  const handleCategoryChange = (value) => {
    if (value === 'new') {
      setShowNewCategoryInput(true);
      setCategorie('');
    } else {
      setShowNewCategoryInput(false);
      setNouvelleCategorie('');
      setCategorie(value);
    }
  }
  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{produit ? 'Modifier le Produit' : 'Nouveau Produit'}</DialogTitle>
          <DialogDescription>
            {produit ? `Mettez à jour les informations de ${produit.nom}.` : `Ajoutez un nouveau produit au catalogue de ${activiteActive?.nom}.`}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="nom" className="text-right">Nom</Label>
            <Input id="nom" value={nom} onChange={(e) => setNom(e.target.value)} className="col-span-2" placeholder="Ex: T-shirt en coton" required />
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="description" className="text-right">Description</Label>
            <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-2" placeholder="Ex: Couleur, taille, etc."/>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="categorie" className="text-right">Catégorie</Label>
            <div className="col-span-2">
              <Select onValueChange={handleCategoryChange} value={showNewCategoryInput ? 'new' : categorie}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categoriesActivite.map((cat) => (
                    <SelectItem key={cat.id} value={cat.nom}>{cat.nom}</SelectItem>
                  ))}
                  <SelectItem value="new">
                    <span className="flex items-center"><PlusCircle className="mr-2 h-4 w-4"/>Nouvelle catégorie</span>
                  </SelectItem>
                </SelectContent>
              </Select>
              <AnimatePresence>
                {showNewCategoryInput && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-2">
                    <Input value={nouvelleCategorie} onChange={(e) => setNouvelleCategorie(e.target.value)} placeholder="Nom de la nouvelle catégorie" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
             <div className="col-span-1 grid grid-cols-1 items-center gap-4">
                <Label htmlFor="prixAchat" className="text-right">Prix d'achat</Label>
                <Input id="prixAchat" type="number" value={prixAchat} onChange={(e) => setPrixAchat(e.target.value)} placeholder="0" />
            </div>
            <div className="col-span-2 grid grid-cols-2 items-center gap-4">
                <Label htmlFor="prixVente" className="text-right">Prix de vente</Label>
                <Input id="prixVente" type="number" value={prixVente} onChange={(e) => setPrixVente(e.target.value)} placeholder="0" required />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1 grid grid-cols-1 items-center gap-4">
                <Label htmlFor="stock" className="text-right">Stock</Label>
                <Input id="stock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="0" />
            </div>
             <div className="col-span-2 grid grid-cols-2 items-center gap-4">
                <Label htmlFor="stockMin" className="text-right">Stock min.</Label>
                <Input id="stockMin" type="number" value={stockMin} onChange={(e) => setStockMin(e.target.value)} placeholder="10"/>
            </div>
          </div>
          <div className="grid grid-cols-3 items-start gap-4">
            <Label className="text-right pt-2">Image</Label>
            <div className="col-span-2">
              <div className="w-full h-32 border-2 border-dashed rounded-lg flex items-center justify-center relative">
                {image ? (
                  <>
                    <img  src={image} alt="Aperçu produit" className="h-full w-full object-contain rounded-lg" src="https://images.unsplash.com/photo-1607212695733-c08334601aeb" />
                    <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6 bg-gray-800/50 hover:bg-gray-800/80 text-white" onClick={() => setImage(null)}>
                      <X className="h-4 w-4"/>
                    </Button>
                  </>
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400"/>
                    <label htmlFor="image-upload" className="text-sm text-primary cursor-pointer hover:underline font-semibold">
                      Charger une image
                    </label>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF jusqu'à 10MB</p>
                    <input id="image-upload" type="file" className="sr-only" onChange={handleImageUpload} accept="image/*"/>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 pl-1/3">
             <div className="w-1/3"></div>
             <div className="flex items-center space-x-2">
                <Checkbox id="estActif" checked={estActif} onCheckedChange={setEstActif} />
                <Label htmlFor="estActif">Produit actif (visible en point de vente)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
            <Button type="submit">{produit ? 'Enregistrer les modifications' : 'Créer le produit'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;