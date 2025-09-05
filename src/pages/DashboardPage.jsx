import React from 'react';
import { Helmet } from 'react-helmet';

const DashboardPage = () => {
    return (
        <>
            <Helmet>
                <title>Tableau de Bord - Votre Application</title>
                <meta name="description" content="Tableau de bord principal pour la gestion de vos activités." />
            </Helmet>
            <div className="min-h-screen flex items-center justify-center">
                <h1 className="text-4xl font-bold">Bienvenue sur le Tableau de Bord !</h1>
            </div>
        </>
    );
};

export default DashboardPage;