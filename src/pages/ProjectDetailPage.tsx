import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProjects } from '../hooks/useProjects';
import { ArrowLeft, Users, Calendar, BarChart2 } from 'lucide-react';
import KanbanBoard from '../components/Kanban/KanbanBoard';

const ProjectDetailPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { projects, isLoading, updateTask, addCommentToTask } = useProjects();

  const project = useMemo(() => 
    projects.find(p => p.id === projectId),
    [projects, projectId]
  );

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

  if (!project) {
    return (
      <div className="text-center p-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h2>
        <p className="text-gray-600 mb-6">The project you are looking for does not exist.</p>
        <Link to="/projects" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Link to="/projects" className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
            <p className="text-gray-500 mt-1">{project.description}</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              <span>{project.members.length} Members</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Due {project.endDate ? project.endDate.toLocaleDateString() : 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <BarChart2 className="w-4 h-4" />
              <span>{project.progress}% Complete</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Kanban Board */}
      <div className="flex-1 min-h-0">
        <KanbanBoard 
          project={project} 
          onTaskUpdate={updateTask} 
          onAddComment={addCommentToTask} 
        />
      </div>
    </div>
  );
};

export default ProjectDetailPage;
