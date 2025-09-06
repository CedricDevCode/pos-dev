import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { PlusCircle, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DepenseModal from '@/components/comptabilite/DepenseModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/components/ui/use-toast';

const GestionDepenses = () => {
  const { depenses, supprimerDepense } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [depenseAEditer, setDepenseAEditer] = useState(null);
  const { toast } = useToast();

  const ouvrirModal = (depense = null) => {
    setDepenseAEditer(depense);
    setModalOpen(true);
  };
  
  const fermerModal = () => {
    setModalOpen(false);
    setDepenseAEditer(null);
  };
  
  const handleDelete = (id) => {
    supprimerDepense(id);
    toast({
      title: '🗑️ Dépense supprimée',
      description: 'La dépense a été retirée du journal.',
      className: 'toast-success',
    });
  }

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border h-full flex flex-col"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Gestion des Dépenses</h2>
          <Button onClick={() => ouvrirModal()}>
            <PlusCircle className="w-4 h-4 mr-2" />
            Ajouter une dépense
          </Button>
        </div>
        <div className="flex-grow overflow-auto">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="p-3 text-sm font-semibold">Date</th>
                <th className="p-3 text-sm font-semibold">Description</th>
                <th className="p-3 text-sm font-semibold">Catégorie</th>
                <th className="p-3 text-sm font-semibold text-right">Montant</th>
                <th className="p-3 text-sm font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {depenses.sort((a,b) => new Date(b.date) - new Date(a.date)).map(d => (
                <tr key={d.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="p-3 text-sm">{new Date(d.date).toLocaleDateString()}</td>
                  <td className="p-3 font-medium">{d.description}</td>
                  <td className="p-3"><span className="px-2 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 rounded-full text-xs">{d.categorie}</span></td>
                  <td className="p-3 font-semibold text-right">{d.montant.toLocaleString()} FCFA</td>
                  <td className="p-3 text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => ouvrirModal(d)}>
                          <Edit className="mr-2 h-4 w-4" /> Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500" onClick={() => handleDelete(d.id)}>
                          <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
      <DepenseModal 
        isOpen={modalOpen} 
        onClose={fermerModal} 
        depense={depenseAEditer}
      />
    </>
  );
};

export default GestionDepenses;