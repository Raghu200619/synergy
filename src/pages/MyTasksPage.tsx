import React, { useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useProjects } from '../hooks/useProjects';
import MyTasksView from '../components/Tasks/MyTasksView';
import { motion } from 'framer-motion';

const MyTasksPage: React.FC = () => {
  const { user } = useAuth();
  const { projects, isLoading, updateTask } = useProjects();

  const myTasks = useMemo(() => {
    if (!user) return [];
    return projects
      .flatMap(p => p.tasks.map(t => ({ ...t, projectName: p.name, projectColor: p.color })))
      .filter(t => t.assignedTo?.id === user.id);
  }, [projects, user]);

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

  return <MyTasksView tasks={myTasks} onUpdateTask={updateTask} />;
};

export default MyTasksPage;
