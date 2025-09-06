import React from 'react';
import ProjectList from '../components/Projects/ProjectList';
import { useProjects } from '../hooks/useProjects';
import { motion } from 'framer-motion';

const ProjectsPage: React.FC = () => {
  const { projects, createProject, isLoading } = useProjects();

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

  return <ProjectList projects={projects} onCreateProject={createProject} />;
};

export default ProjectsPage;
