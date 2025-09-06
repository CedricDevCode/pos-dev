import React from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';

/**
 * ProtectedRoute est un composant qui protège une route en vérifiant
 * si l'utilisateur connecté a le rôle requis pour y accéder.
 * @param {object} props - Les propriétés du composant.
 * @param {React.ReactNode} props.children - Le composant enfant à afficher si l'accès est autorisé.
 * @param {string[]} props.roles - La liste des rôles autorisés à accéder à la route.
 */
const ProtectedRoute = ({ children, roles }) => {
  const { utilisateurConnecte } = useApp();

  // Si l'utilisateur n'est pas connecté, redirige vers la page de connexion.
  if (!utilisateurConnecte) {
    return <Navigate to="/connexion" replace />;
  }

  // Si la route nécessite des rôles spécifiques et que l'utilisateur n'a pas le bon rôle,
  // redirige vers une page "non autorisé".
  if (roles && !roles.includes(utilisateurConnecte.role)) {
    return <Navigate to="/non-autorise" replace />;
  }

  // Si l'utilisateur a le bon rôle, affiche le composant enfant.
  return children;
};

export default ProtectedRoute;