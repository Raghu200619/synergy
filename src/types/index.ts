export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'member' | 'viewer';
}

export interface Comment {
  id: string;
  author: User;
  content: string;
  createdAt: Date;
}

export interface Project {
  id: string;
  name: string;
  codename: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold';
  progress: number;
  startDate: Date;
  endDate?: Date;
  members: User[];
  tasks: Task[];
  discussions: Discussion[];
  createdBy: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: User;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  projectId: string;
  tags: string[];
  comments?: Comment[];
}

export interface Discussion {
  id: string;
  title: string;
  projectId: string;
  createdBy: User;
  createdAt: Date;
  messages: Message[];
  isLocked: boolean;
}

export interface Message {
  id: string;
  content: string;
  author: User;
  createdAt: Date;
  parentId?: string;
  reactions: Reaction[];
}

export interface Reaction {
  emoji: string;
  users: User[];
}

export interface Notification {
  id: string;
  type: 'task_assigned' | 'project_update' | 'discussion_reply' | 'deadline_reminder';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  userId: string;
  actionUrl?: string;
}
