import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { isToday, isPast, isThisWeek } from 'date-fns';
import { Task } from '../../types';
import { AlertTriangle, Calendar, CheckCircle, Clock, SortAsc } from 'lucide-react';

interface TasksSidebarProps {
  tasks: Task[];
  onSortChange: (sort: 'dueDate' | 'priority' | 'projectName') => void;
  currentSort: 'dueDate' | 'priority' | 'projectName';
}

const TasksSidebar: React.FC<TasksSidebarProps> = ({ tasks, onSortChange, currentSort }) => {
  const stats = useMemo(() => {
    const now = new Date();
    return {
      dueToday: tasks.filter(t => t.dueDate && isToday(t.dueDate) && t.status !== 'completed').length,
      overdue: tasks.filter(t => t.dueDate && isPast(t.dueDate) && !isToday(t.dueDate) && t.status !== 'completed').length,
      completedThisWeek: tasks.filter(t => t.status === 'completed' && isThisWeek(t.updatedAt, { weekStartsOn: 1 })).length,
    };
  }, [tasks]);

  const sortOptions = [
    { id: 'dueDate', label: 'Due Date' },
    { id: 'priority', label: 'Priority' },
    { id: 'projectName', label: 'Project Name' },
  ];

  return (
    <aside className="hidden lg:block w-72 bg-white border-l border-gray-200 p-6">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Stats Section */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Focus</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span>Due Today</span>
              </div>
              <span className="font-bold text-gray-900 bg-blue-100 px-2 py-0.5 rounded-full">{stats.dueToday}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-700">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span>Overdue</span>
              </div>
              <span className="font-bold text-gray-900 bg-red-100 px-2 py-0.5 rounded-full">{stats.overdue}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Completed This Week</span>
              </div>
              <span className="font-bold text-gray-900 bg-green-100 px-2 py-0.5 rounded-full">{stats.completedThisWeek}</span>
            </div>
          </div>
        </div>

        {/* Sort Section */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <SortAsc className="w-4 h-4" />
            Sort By
          </h3>
          <div className="space-y-2">
            {sortOptions.map(option => (
              <button
                key={option.id}
                onClick={() => onSortChange(option.id as any)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  currentSort === option.id
                    ? 'bg-indigo-100 text-indigo-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Workspace Info */}
        <div className="mt-8 pt-6 border-t border-gray-200">
           <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Workspace</h3>
           <div className="text-sm text-gray-600 space-y-2">
             <p><span className="font-medium text-gray-800">Team:</span> The Innovators</p>
             <p><span className="font-medium text-gray-800">Plan:</span> Pro Tier</p>
             <button className="text-indigo-600 hover:underline">Manage Workspace</button>
           </div>
        </div>

      </motion.div>
    </aside>
  );
};

export default TasksSidebar;
