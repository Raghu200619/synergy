import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import KanbanTaskCard from './KanbanTaskCard';
import { Task } from '../../types';
import { Plus } from 'lucide-react';

interface KanbanColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  projectColor: string;
  projectId: string;
  onAddComment: (projectId: string, taskId: string, commentContent: string) => Promise<void>;
}

const columnTitleColors: Record<string, string> = {
  'To Do': 'text-gray-500',
  'In Progress': 'text-blue-500',
  'Review': 'text-purple-500',
  'Completed': 'text-green-500',
};

const KanbanColumn: React.FC<KanbanColumnProps> = ({ id, title, tasks, projectColor, projectId, onAddComment }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} className="bg-gray-100/50 rounded-xl flex flex-col h-full">
      <div className="p-4 border-b-2" style={{ borderColor: projectColor }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className={`font-semibold ${columnTitleColors[title]}`}>{title}</h3>
            <span className="text-xs font-medium text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
              {tasks.length}
            </span>
          </div>
          <button className="p-1 rounded-md text-gray-400 hover:bg-gray-200 hover:text-gray-600">
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="p-4 space-y-4 overflow-y-auto flex-1">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task, index) => (
            <KanbanTaskCard 
              key={task.id} 
              task={task} 
              index={index}
              projectId={projectId}
              onAddComment={onAddComment}
            />
          ))}
        </SortableContext>
        {tasks.length === 0 && (
          <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-lg">
            <p className="text-sm text-gray-500">Drop tasks here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
