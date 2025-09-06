import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  FolderOpen, 
  CheckSquare, 
  Users, 
  TrendingUp,
  Calendar,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import StatsCard from './StatsCard';
import RecentActivity from './RecentActivity';
import { Project } from '../../types';

interface DashboardProps {
  projects: Project[];
}

const Dashboard: React.FC<DashboardProps> = ({ projects }) => {
  const stats = useMemo(() => {
    const totalTasks = projects.reduce((acc, project) => acc + project.tasks.length, 0);
    const completedTasks = projects.reduce((acc, project) => 
      acc + project.tasks.filter(task => task.status === 'completed').length, 0
    );
    const totalMembers = new Set(projects.flatMap(p => p.members.map(m => m.id))).size;

    return [
      {
        title: 'Active Projects',
        value: projects.filter(p => p.status === 'active').length,
        change: { value: 12, trend: 'up' as const },
        icon: FolderOpen,
        color: '#6366f1'
      },
      {
        title: 'Tasks Completed',
        value: `${completedTasks}/${totalTasks}`,
        change: { value: 8, trend: 'up' as const },
        icon: CheckSquare,
        color: '#10b981'
      },
      {
        title: 'Team Members',
        value: totalMembers,
        change: { value: 5, trend: 'up' as const },
        icon: Users,
        color: '#f59e0b'
      },
      {
        title: 'Productivity',
        value: '92%',
        change: { value: 3, trend: 'up' as const },
        icon: TrendingUp,
        color: '#8b5cf6'
      }
    ];
  }, [projects]);

  const upcomingDeadlines = useMemo(() => {
    return projects
      .flatMap(p => p.tasks)
      .filter(task => task.dueDate && task.status !== 'completed')
      .sort((a, b) => (a.dueDate!.getTime() - b.dueDate!.getTime()))
      .slice(0, 5);
  }, [projects]);

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white overflow-hidden"
      >
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-4 right-4 opacity-20"
        >
          <Sparkles className="w-12 h-12" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-2">Welcome to SynergySphere, Rakesh!</h2>
          <p className="text-indigo-100">
            Your collaborative workspace for seamless project management and team coordination.
          </p>
        </motion.div>
        
        <motion.div
          className="absolute -bottom-2 -right-2 w-20 h-20 bg-white bg-opacity-10 rounded-full"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={stat.title} {...stat} index={index} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>

        {/* Upcoming Deadlines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-xl border border-gray-200 p-6"
        >
          <div className="flex items-center space-x-2 mb-6">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                repeatDelay: 3
              }}
            >
              <Calendar className="w-5 h-5 text-orange-500" />
            </motion.div>
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Deadlines</h3>
          </div>

          <div className="space-y-4">
            {upcomingDeadlines.length > 0 ? (
              upcomingDeadlines.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer"
                >
                  <motion.div 
                    className={`p-1 rounded ${
                      task.priority === 'urgent' ? 'bg-red-100 text-red-600' :
                      task.priority === 'high' ? 'bg-orange-100 text-orange-600' :
                      'bg-blue-100 text-blue-600'
                    }`}
                    whileHover={{ rotate: 15 }}
                  >
                    <AlertCircle className="w-4 h-4" />
                  </motion.div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {task.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      Due {task.dueDate?.toLocaleDateString()}
                    </p>
                    {task.assignedTo && (
                      <div className="flex items-center space-x-1 mt-1">
                        <img
                          src={task.assignedTo.avatar}
                          alt={task.assignedTo.name}
                          className="w-4 h-4 rounded-full object-cover"
                        />
                        <span className="text-xs text-gray-500">
                          {task.assignedTo.name}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-4"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    repeatDelay: 2
                  }}
                  className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2"
                >
                  <CheckSquare className="w-6 h-6 text-green-600" />
                </motion.div>
                <p className="text-gray-500 text-sm">No upcoming deadlines</p>
                <p className="text-xs text-gray-400">Great job staying on track!</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
