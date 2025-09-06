import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import KanbanColumn from './KanbanColumn';
import { Project, Task, Comment } from '../../types';

interface KanbanBoardProps {
  project: Project;
  onTaskUpdate: (projectId: string, taskId: string, updates: Partial<Task>) => Promise<void>;
  onAddComment: (projectId: string, taskId: string, commentContent: string) => Promise<void>;
}

const columns = [
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'review', title: 'Review' },
  { id: 'completed', title: 'Completed' },
];

const KanbanBoard: React.FC<KanbanBoardProps> = ({ project, onTaskUpdate, onAddComment }) => {
  const [tasks, setTasks] = useState(project.tasks);

  useEffect(() => {
    setTasks(project.tasks);
  }, [project.tasks]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeTask = tasks.find(t => t.id === active.id);
    if (!activeTask) return;

    // Check if dropping into a different column
    if (active.id !== over.id && columns.some(c => c.id === over.id)) {
      const newStatus = over.id as Task['status'];
      if (activeTask.status !== newStatus) {
        onTaskUpdate(project.id, active.id as string, { status: newStatus });
      }
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full">
        <SortableContext items={columns.map(c => c.id)} strategy={horizontalListSortingStrategy}>
          {columns.map(column => (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              tasks={tasks.filter(task => task.status === column.id)}
              projectColor={project.color}
              projectId={project.id}
              onAddComment={onAddComment}
            />
          ))}
        </SortableContext>
      </div>
    </DndContext>
  );
};

export default KanbanBoard;
