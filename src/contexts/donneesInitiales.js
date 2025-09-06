export const donneesInitiales = {
  utilisateurs: [
    {
      id: 1,
      nom: 'Admin Principal',
      email: 'admin@pos.com',
      motDePasse: 'admin123',
      role: 'administrateur',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      actif: true,
      dateCreation: new Date().toISOString()
    },
    {
      id: 2,
      nom: 'Marie Caissière',
      email: 'marie@pos.com',
      motDePasse: 'marie123',
      role: 'caissier',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      actif: true,
      dateCreation: new Date().toISOString()
    }
  ],
  activites: [
    {
      id: 1,
      nom: 'Restaurant Le Délice',
      type: 'restauration',
      logo: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=100&h=100&fit=crop',
      devise: 'FCFA',
      tauxTaxe: 18,
      adresse: '123 Rue de la Paix, Dakar',
      telephone: '+221 77 123 45 67',
      actif: true,
      dateCreation: new Date().toISOString()
    },
    {
      id: 2,
      nom: 'Boutique Mode & Style',
      type: 'commerce',
      logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&h=100&fit=crop',
      devise: 'FCFA',
      tauxTaxe: 18,
      adresse: '456 Avenue des Champs, Dakar',
      telephone: '+221 77 987 65 43',
      actif: true,
      dateCreation: new Date().toISOString()
    },
    {
      id: 3,
      nom: 'Services Informatiques Pro',
      type: 'services',
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop',
      devise: 'FCFA',
      tauxTaxe: 18,
      adresse: '789 Boulevard Tech, Dakar',
      telephone: '+221 77 456 78 90',
      actif: true,
      dateCreation: new Date().toISOString()
    }
  ],
  categories: [
    { id: 1, nom: 'Plats principaux', activiteId: 1 },
    { id: 2, nom: 'Boissons', activiteId: 1 },
    { id: 3, nom: 'Vêtements Femme', activiteId: 2 },
    { id: 4, nom: 'Vêtements Homme', activiteId: 2 },
    { id: 5, nom: 'Maintenance', activiteId: 3 },
  ],
  produits: [
    {
      id: 1,
      nom: 'Thieboudienne',
      description: 'Plat traditionnel sénégalais avec poisson et riz',
      prix: 2500,
      cout: 1500,
      stock: 50,
      stockMin: 10,
      categorie: 'Plats principaux',
      activiteId: 1,
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200&h=200&fit=crop',
      actif: true,
      dateCreation: new Date().toISOString()
    },
    {
      id: 2,
      nom: 'Yassa Poulet',
      description: 'Poulet mariné aux oignons et citron',
      prix: 3000,
      cout: 1800,
      stock: 30,
      stockMin: 5,
      categorie: 'Plats principaux',
      activiteId: 1,
      image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=200&h=200&fit=crop',
      actif: true,
      dateCreation: new Date().toISOString()
    },
    {
      id: 3,
      nom: 'Bissap',
      description: 'Boisson traditionnelle à l\'hibiscus',
      prix: 500,
      cout: 200,
      stock: 100,
      stockMin: 20,
      categorie: 'Boissons',
      activiteId: 1,
      image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=200&h=200&fit=crop',
      actif: true,
      dateCreation: new Date().toISOString()
    },
    {
      id: 4,
      nom: 'Robe Africaine',
      description: 'Robe traditionnelle en wax coloré',
      prix: 15000,
      cout: 8000,
      stock: 25,
      stockMin: 5,
      categorie: 'Vêtements Femme',
      activiteId: 2,
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=200&h=200&fit=crop',
      actif: true,
      dateCreation: new Date().toISOString()
    },
    {
      id: 5,
      nom: 'Chemise Homme',
      description: 'Chemise élégante en coton',
      prix: 12000,
      cout: 6000,
      stock: 40,
      stockMin: 10,
      categorie: 'Vêtements Homme',
      activiteId: 2,
      image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=200&h=200&fit=crop',
      actif: true,
      dateCreation: new Date().toISOString()
    },
    {
      id: 6,
      nom: 'Maintenance PC',
      description: 'Service de maintenance et réparation PC',
      prix: 25000,
      cout: 10000,
      stock: 999,
      stockMin: 0,
      categorie: 'Maintenance',
      activiteId: 3,
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&h=200&fit=crop',
      actif: true,
      dateCreation: new Date().toISOString()
    }
  ],
  ventes: [
    {
      id: 1,
      numero: 'V-2024-001',
      activiteId: 1,
      utilisateurId: 2,
      articles: [
        { produitId: 1, quantite: 2, prix: 2500 },
        { produitId: 3, quantite: 2, prix: 500 }
      ],
      sousTotal: 6000,
      taxe: 1080,
      total: 7080,
      modesPaiement: { especes: 7080, carte: 0, mobileMoney: 0 },
      montantRecu: 7080,
      monnaieRendue: 0,
      statut: 'termine',
      date: new Date().toISOString()
    }
  ],
  caisses: [
    {
      id: 1,
      activiteId: 1,
      utilisateurId: 2,
      soldeInitial: 50000,
      soldeFinal: null,
      dateOuverture: new Date().toISOString(),
      dateFermeture: null,
      statut: 'ouverte',
      ventes:[]
    }
  ],
  retours: [],
  depenses: [
    {
      id: 'dep-1',
      date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
      description: 'Achat de fournitures de bureau',
      montant: 25000,
      categorie: 'Fournitures'
    },
    {
      id: 'dep-2',
      date: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
      description: 'Paiement facture électricité',
      montant: 35000,
      categorie: 'Services Publics'
    }
  ]
};