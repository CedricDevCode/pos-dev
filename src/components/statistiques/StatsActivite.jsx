import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, TrendingUp, Users, DollarSign, X } from "lucide-react";

const StatsActivite = ({ activite, open, onClose }) => {
  if (!activite) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* En-tête */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                Statistiques de l’activité :{" "}
                <span className="text-blue-600 dark:text-blue-400">{activite.nom}</span>
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-100 dark:bg-gray-700 p-5 rounded-xl flex items-center gap-4">
                <Activity className="w-10 h-10 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total d’opérations</p>
                  <p className="text-lg font-bold text-gray-800 dark:text-gray-100">
                    {activite.totalOperations || 0}
                  </p>
                </div>
              </div>

              <div className="bg-gray-100 dark:bg-gray-700 p-5 rounded-xl flex items-center gap-4">
                <TrendingUp className="w-10 h-10 text-green-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Chiffre d’affaires</p>
                  <p className="text-lg font-bold text-gray-800 dark:text-gray-100">
                    {activite.ca || 0} CFA
                  </p>
                </div>
              </div>

              <div className="bg-gray-100 dark:bg-gray-700 p-5 rounded-xl flex items-center gap-4">
                <Users className="w-10 h-10 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Clients impliqués</p>
                  <p className="text-lg font-bold text-gray-800 dark:text-gray-100">
                    {activite.nbClients || 0}
                  </p>
                </div>
              </div>

              <div className="bg-gray-100 dark:bg-gray-700 p-5 rounded-xl flex items-center gap-4">
                <DollarSign className="w-10 h-10 text-yellow-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Bénéfices nets</p>
                  <p className="text-lg font-bold text-gray-800 dark:text-gray-100">
                    {activite.benefices || 0} CFA
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StatsActivite;
