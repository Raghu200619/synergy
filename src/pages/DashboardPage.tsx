import React from 'react';
import Dashboard from '../components/Dashboard/Dashboard';
import { useProjects } from '../hooks/useProjects';
import { motion } from 'framer-motion';

const DashboardPage: React.FC = () => {
  const { projects, isLoading } = useProjects();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return <Dashboard projects={projects} />;
};

export default DashboardPage;
