import { useState, useEffect } from 'react';
import { Project, Task, User, Comment } from '../types';
import { generateCreativeName } from '../utils/nameGenerator';

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Rakesh Muduli',
    email: 'rakesh@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    role: 'admin'
  },
  {
    id: '2',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
    role: 'member'
  },
  {
    id: '3',
    name: 'Mike Chen',
    email: 'mike@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
    role: 'member'
  }
];

const mockComments: Comment[] = [
    {
        id: 'c1',
        author: mockUsers[2],
        content: 'Great start! Let me know if you need any help with the database part.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2)
    },
    {
        id: 'c2',
        author: mockUsers[1],
        content: 'Thanks, Mike! I think I have it covered for now. The mockups are almost ready for review.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1)
    }
];

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Design user interface mockups',
    description: 'Create wireframes and mockups for the main dashboard and project pages.',
    status: 'in-progress',
    priority: 'high',
    assignedTo: mockUsers[1],
    dueDate: new Date('2025-01-25'),
    createdAt: new Date('2025-01-10'),
    updatedAt: new Date('2025-01-15'),
    projectId: '1',
    tags: ['design', 'ui'],
    comments: mockComments
  },
  {
    id: '2',
    title: 'Set up project database',
    description: 'Configure database schema and initial migrations using Supabase.',
    status: 'completed',
    priority: 'high',
    assignedTo: mockUsers[2],
    dueDate: new Date('2025-01-20'),
    createdAt: new Date('2025-01-08'),
    updatedAt: new Date('2025-01-18'),
    projectId: '1',
    tags: ['backend', 'database']
  },
  {
    id: '3',
    title: 'Implement user authentication',
    description: 'Build login, registration, and password reset functionality with secure token handling.',
    status: 'review',
    priority: 'medium',
    assignedTo: mockUsers[0],
    dueDate: new Date('2025-01-30'),
    createdAt: new Date('2025-01-12'),
    updatedAt: new Date('2025-01-20'),
    projectId: '1',
    tags: ['frontend', 'auth']
  },
  {
    id: '4',
    title: 'Develop native iOS components',
    description: 'Build the core UI components for the iOS app using Swift UI.',
    status: 'todo',
    priority: 'high',
    assignedTo: mockUsers[0],
    dueDate: new Date('2025-02-10'),
    createdAt: new Date('2025-01-20'),
    updatedAt: new Date('2025-01-20'),
    projectId: '2',
    tags: ['mobile', 'ios']
  },
  {
    id: '5',
    title: 'Plan Android app architecture',
    description: 'Outline the architecture for the Android version of the app using Clean Architecture principles.',
    status: 'todo',
    priority: 'medium',
    assignedTo: mockUsers[2],
    dueDate: new Date('2025-02-15'),
    createdAt: new Date('2025-01-22'),
    updatedAt: new Date('2025-01-22'),
    projectId: '2',
    tags: ['mobile', 'android', 'planning']
  }
];

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'SynergySphere Platform',
    codename: 'Stellar Tiger',
    description: 'Complete rebuild of the collaboration platform with modern tech stack',
    status: 'active',
    progress: 65,
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-03-31'),
    members: mockUsers,
    tasks: mockTasks.filter(t => t.projectId === '1'),
    discussions: [],
    createdBy: '1',
    color: '#6366f1'
  },
  {
    id: '2',
    name: 'Mobile App Development',
    codename: 'Agile Aardvark',
    description: 'Native mobile application for iOS and Android',
    status: 'active',
    progress: 10,
    startDate: new Date('2025-01-15'),
    endDate: new Date('2025-05-15'),
    members: [mockUsers[0], mockUsers[2]],
    tasks: mockTasks.filter(t => t.projectId === '2'),
    discussions: [],
    createdBy: '1',
    color: '#10b981'
  }
];

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProjects(mockProjects);
      setIsLoading(false);
    }, 800);
  }, []);

  const createProject = async (projectData: Omit<Project, 'id' | 'tasks' | 'discussions' | 'members' | 'codename'>) => {
    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
      codename: generateCreativeName(),
      tasks: [],
      discussions: [],
      members: [mockUsers[0]] // Add creator as member
    };
    setProjects(prev => [...prev, newProject]);
    return newProject;
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProject = async (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const addMemberToProject = async (projectId: string, user: User) => {
    setProjects(prev => prev.map(p => 
      p.id === projectId 
        ? { ...p, members: [...p.members, user] }
        : p
    ));
  };

  const updateTask = async (projectId: string, taskId: string, updates: Partial<Task>) => {
    setProjects(prevProjects => 
        prevProjects.map(p => {
            if (p.id === projectId) {
                return {
                    ...p,
                    tasks: p.tasks.map(t => 
                        t.id === taskId ? { ...t, ...updates, updatedAt: new Date() } : t
                    )
                };
            }
            return p;
        })
    );
  };

  const addCommentToTask = async (projectId: string, taskId: string, commentContent: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      author: mockUsers[0], // Assuming the logged-in user is Rakesh
      content: commentContent,
      createdAt: new Date(),
    };

    setProjects(prevProjects =>
      prevProjects.map(p => {
        if (p.id === projectId) {
          return {
            ...p,
            tasks: p.tasks.map(t => {
              if (t.id === taskId) {
                return {
                  ...t,
                  comments: [...(t.comments || []), newComment],
                };
              }
              return t;
            }),
          };
        }
        return p;
      })
    );
  };

  return {
    projects,
    isLoading,
    createProject,
    updateProject,
    deleteProject,
    addMemberToProject,
    updateTask,
    addCommentToTask
  };
};
