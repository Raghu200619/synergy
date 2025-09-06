import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Flag, MessageSquare, MoreHorizontal, Paperclip } from 'lucide-react';
import { Task } from '../../types';
import { format, isPast } from 'date-fns';

interface KanbanTaskCardProps {
  task: Task;
  index: number;
  projectId: string;
  onAddComment: (projectId: string, taskId: string, commentContent: string) => Promise<void>;
}

const priorityColors: Record<Task['priority'], string> = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800',
};

const KanbanTaskCard: React.FC<KanbanTaskCardProps> = ({ task, projectId, onAddComment }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });
  const [isExpanded, setIsExpanded] = useState(false);
  const [comment, setComment] = useState('');

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isOverdue = task.dueDate && isPast(task.dueDate) && task.status !== 'completed';

  const handleAddComment = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && comment.trim()) {
      onAddComment(projectId, task.id, comment.trim());
      setComment('');
    }
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      layout
      whileHover={{ y: -4, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
      className="bg-white rounded-lg border border-gray-200 shadow-sm cursor-grab active:cursor-grabbing"
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <p className="font-semibold text-gray-800 pr-4">{task.title}</p>
          <button className="p-1 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Tags & Priority */}
        <div className="flex items-center gap-2 mb-3">
          {task.tags.slice(0, 2).map(tag => (
            <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{tag}</span>
          ))}
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${priorityColors[task.priority]}`}>
            {task.priority}
          </span>
        </div>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            {task.assignedTo && (
              <img
                src={task.assignedTo.avatar}
                alt={task.assignedTo.name}
                title={task.assignedTo.name}
                className="w-7 h-7 rounded-full object-cover border-2 border-white"
              />
            )}
            <button onClick={() => setIsExpanded(!isExpanded)} className="flex items-center gap-1 hover:text-indigo-600">
              <MessageSquare className="w-4 h-4" />
              <span>{task.comments?.length || 0}</span>
            </button>
            <div className="flex items-center gap-1">
              <Paperclip className="w-4 h-4" />
              <span>3</span>
            </div>
          </div>
          <div className={`flex items-center gap-1 text-xs ${isOverdue ? 'text-red-500 font-medium' : ''}`}>
            <Calendar className="w-3 h-3" />
            <span>{task.dueDate ? format(task.dueDate, 'MMM dd') : 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Expandable Comments Section */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="border-t border-gray-200 overflow-hidden"
          >
            <div className="p-4 bg-gray-50">
              <h4 className="font-semibold text-xs text-gray-600 mb-3">Comments</h4>
              <div className="space-y-3">
                {task.comments && task.comments.length > 0 ? (
                  task.comments.map(comment => (
                    <div key={comment.id} className="flex items-start gap-2">
                      <img src={comment.author.avatar} alt={comment.author.name} className="w-6 h-6 rounded-full mt-1" />
                      <div className="bg-white p-2 rounded-lg border border-gray-200 flex-1">
                        <p className="text-xs font-medium text-gray-800">{comment.author.name}</p>
                        <p className="text-xs text-gray-600">{comment.content}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500 text-center py-2">No comments yet.</p>
                )}
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  onKeyDown={handleAddComment}
                  className="w-full text-xs px-2 py-1.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default KanbanTaskCard;
