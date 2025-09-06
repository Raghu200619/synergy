import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Flag, MoreHorizontal, Edit2, Trash2 } from 'lucide-react';
import { Task } from '../../types';
import { format, isPast } from 'date-fns';

interface TaskCardProps {
  task: Task & { projectName: string; projectColor: string };
  index: number;
  onUpdateTask: (projectId: string, taskId: string, updates: Partial<Task>) => Promise<void>;
}

const statusProgress: Record<Task['status'], number> = {
  todo: 10,
  'in-progress': 50,
  review: 75,
  completed: 100,
};

const priorityColors: Record<Task['priority'], string> = {
  low: 'border-blue-500',
  medium: 'border-yellow-500',
  high: 'border-orange-500',
  urgent: 'border-red-500',
};

const TaskCard: React.FC<TaskCardProps> = ({ task, index, onUpdateTask }) => {
  const [isCompleted, setIsCompleted] = useState(task.status === 'completed');

  const handleCompleteToggle = async () => {
    const newStatus = !isCompleted ? 'completed' : 'todo';
    setIsCompleted(!isCompleted);
    await onUpdateTask(task.projectId, task.id, { status: newStatus });
  };

  const isOverdue = task.dueDate && isPast(task.dueDate) && task.status !== 'completed';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className={`bg-white rounded-xl border-l-4 ${priorityColors[task.priority]} shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col`}
    >
      <div className="p-5 flex-1">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: task.projectColor }}></div>
            <span className="text-xs font-medium text-gray-600">{task.projectName}</span>
          </div>
          <button className="p-1 rounded-md hover:bg-gray-100">
            <MoreHorizontal className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Title */}
        <p className="font-semibold text-gray-800 mb-4">{task.title}</p>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-600 font-medium' : ''}`}>
            <Calendar className="w-3 h-3" />
            <span>{task.dueDate ? format(task.dueDate, 'MMM dd') : 'No due date'}</span>
          </div>
          <div className="flex items-center gap-1 capitalize">
            <Flag className="w-3 h-3" />
            <span>{task.priority}</span>
          </div>
        </div>
      </div>

      {/* Footer with Progress */}
      <div className="px-5 py-4 border-t border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-500 capitalize">{task.status.replace('-', ' ')}</span>
          <span className="text-xs font-bold text-gray-800">{statusProgress[task.status]}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${statusProgress[task.status]}%` }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            className="h-1.5 rounded-full"
            style={{ backgroundColor: task.projectColor }}
          />
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="flex items-center justify-end gap-2 p-2 bg-gray-50 rounded-b-xl">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleCompleteToggle}
          className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
            isCompleted
              ? 'bg-green-100 text-green-600'
              : 'bg-gray-200 text-gray-500 hover:bg-green-100 hover:text-green-600'
          }`}
          title={isCompleted ? 'Mark as Incomplete' : 'Mark as Complete'}
        >
          <motion.div
            animate={{ scale: isCompleted ? 1 : 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            ✓
          </motion.div>
        </motion.button>
        <button className="p-2 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors">
          <Edit2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
};

export default TaskCard;
