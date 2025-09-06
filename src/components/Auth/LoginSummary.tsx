import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, FolderGit2, CheckCircle, Clock } from 'lucide-react';
import { useProjects } from '../../hooks/useProjects';

const LoginSummary: React.FC = () => {
  const { projects, isLoading } = useProjects();

  if (isLoading || projects.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <div className="h-40 bg-gray-200 rounded-2xl animate-pulse"></div>
        <div className="h-64 bg-gray-200 rounded-2xl animate-pulse"></div>
      </div>
    );
  }

  const activeProjects = projects.filter(p => p.status === 'active').length;
  const totalTasks = projects.reduce((acc, p) => acc + p.tasks.length, 0);
  const completedTasks = projects.reduce((acc, p) => acc + p.tasks.filter(t => t.status === 'completed').length, 0);
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const recentProjects = projects.slice(0, 4);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-6"
    >
      <motion.div
        variants={itemVariants}
        className="bg-white/50 backdrop-blur-lg border border-gray-200/50 rounded-2xl p-6"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-500" />
          Productivity Snapshot
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-indigo-50 p-4 rounded-xl">
            <p className="text-sm text-indigo-700">Active Projects</p>
            <p className="text-2xl font-bold text-indigo-900">{activeProjects}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-xl">
            <p className="text-sm text-green-700">Completion Rate</p>
            <p className="text-2xl font-bold text-green-900">{completionRate}%</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="bg-white/50 backdrop-blur-lg border border-gray-200/50 rounded-2xl p-6"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FolderGit2 className="w-5 h-5 text-purple-500" />
          Recent Projects
        </h3>
        <ul className="space-y-3">
          {recentProjects.map((project, index) => (
            <motion.li
              key={project.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-8 rounded-full" style={{ backgroundColor: project.color }}></div>
                <div>
                  <p className="font-medium text-gray-800">{project.name}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    {project.status === 'completed' ? (
                      <CheckCircle className="w-3 h-3 text-green-500" />
                    ) : (
                      <Clock className="w-3 h-3 text-yellow-500" />
                    )}
                    <span>{project.status}</span>
                  </div>
                </div>
              </div>
              <div className="flex -space-x-2">
                {project.members.slice(0, 2).map(member => (
                  <img
                    key={member.id}
                    src={member.avatar}
                    alt={member.name}
                    className="w-7 h-7 rounded-full border-2 border-white object-cover"
                  />
                ))}
              </div>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
};

export default LoginSummary;
