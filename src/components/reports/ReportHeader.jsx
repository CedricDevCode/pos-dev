import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';

const ReportHeader = ({ onExport }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col md:flex-row md:items-center md:justify-between"
  >
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Rapports et Analyses
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        Analysez les performances de vos activités • Données en temps réel
      </p>
    </div>
    <div className="flex space-x-2 mt-4 md:mt-0">
      <Button
        onClick={() => onExport('pdf')}
        variant="outline"
      >
        <Download className="w-4 h-4 mr-2" />
        Export PDF
      </Button>
      <Button
        onClick={() => onExport('excel')}
        variant="outline"
      >
        <FileText className="w-4 h-4 mr-2" />
        Export Excel
      </Button>
    </div>
  </motion.div>
);

export default ReportHeader;