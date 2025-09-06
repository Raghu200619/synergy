import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Users, 
  MoreHorizontal,
  CheckSquare,
  Tag
} from 'lucide-react';
import { Project } from '../../types';
import { formatDistanceToNow } from 'date-fns';

interface ProjectCardProps {
  project: Project;
  index: number;
  onSelect: (project: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, onSelect }) => {
  const completedTasks = project.tasks.filter(task => task.status === 'completed').length;
  const totalTasks = project.tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.03, y: -5 }}
      onClick={() => onSelect(project)}
      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: project.color }}
            />
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
              {project.name}
            </h3>
          </div>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {project.description}
          </p>
        </div>
        
        <button className="p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100">
          <MoreHorizontal className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Status & Codename */}
      <div className="flex items-center justify-between mb-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
        </span>
        <div className="flex items-center gap-1 text-xs text-purple-700 bg-purple-100 px-2 py-1 rounded-full">
          <Tag className="w-3 h-3" />
          <span className="font-medium">{project.codename}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-600">Progress</span>
          <span className="font-medium text-gray-900">{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            className="h-2 rounded-full"
            style={{ backgroundColor: project.color }}
          />
        </div>
      </div>

      {/* Team & Deadline */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex -space-x-2">
            {project.members.slice(0, 3).map((member, idx) => (
              <img
                key={member.id}
                src={member.avatar}
                alt={member.name}
                className="w-7 h-7 rounded-full border-2 border-white object-cover"
                style={{ zIndex: 10 - idx }}
              />
            ))}
            {project.members.length > 3 && (
              <div className="w-7 h-7 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                +{project.members.length - 3}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Users className="w-4 h-4" />
            <span>{project.members.length}</span>
          </div>
        </div>

        <div className="flex items-center space-x-1 text-xs text-gray-500">
          <Calendar className="w-3 h-3" />
          <span>
            {project.endDate 
              ? `Due ${formatDistanceToNow(project.endDate, { addSuffix: true })}`
              : 'No deadline'
            }
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
