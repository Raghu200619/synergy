import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Check, 
  X, 
  Search, 
  Filter,
  UserPlus,
  MessageSquare,
  CheckSquare,
  AlertTriangle,
  Calendar,
  Star,
  Archive,
  MoreVertical
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useProjects } from '../hooks/useProjects';

interface Notification {
  id: string;
  type: 'task_assigned' | 'project_update' | 'discussion_reply' | 'deadline_reminder' | 'team_invite' | 'milestone_reached';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  userId: string;
  actionUrl?: string;
  author?: {
    name: string;
    avatar: string;
  };
  project?: {
    name: string;
    color: string;
  };
  priority: 'low' | 'medium' | 'high';
}

const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const { projects } = useProjects();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterRead, setFilterRead] = useState<string>('all');

  // Generate mock notifications
  const notifications: Notification[] = [
    {
      id: '1',
      type: 'task_assigned',
      title: 'New Task Assigned',
      message: 'You have been assigned to "Design user interface mockups" in SynergySphere Platform',
      isRead: false,
      createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      userId: user?.id || '1',
      actionUrl: '/projects/1',
      author: {
        name: 'Sarah Wilson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face'
      },
      project: {
        name: 'SynergySphere Platform',
        color: '#6366f1'
      },
      priority: 'high'
    },
    {
      id: '2',
      type: 'discussion_reply',
      title: 'New Discussion Reply',
      message: 'Mike Chen replied to "Technical Questions - SynergySphere Platform"',
      isRead: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      userId: user?.id || '1',
      actionUrl: '/discussions',
      author: {
        name: 'Mike Chen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face'
      },
      project: {
        name: 'SynergySphere Platform',
        color: '#6366f1'
      },
      priority: 'medium'
    },
    {
      id: '3',
      type: 'deadline_reminder',
      title: 'Deadline Reminder',
      message: 'Task "Set up project database" is due tomorrow',
      isRead: true,
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      userId: user?.id || '1',
      actionUrl: '/my-tasks',
      project: {
        name: 'SynergySphere Platform',
        color: '#6366f1'
      },
      priority: 'high'
    },
    {
      id: '4',
      type: 'project_update',
      title: 'Project Update',
      message: 'SynergySphere Platform progress updated to 65%',
      isRead: true,
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      userId: user?.id || '1',
      actionUrl: '/projects/1',
      project: {
        name: 'SynergySphere Platform',
        color: '#6366f1'
      },
      priority: 'low'
    },
    {
      id: '5',
      type: 'team_invite',
      title: 'Team Invitation',
      message: 'You have been invited to join Mobile App Development project',
      isRead: false,
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
      userId: user?.id || '1',
      actionUrl: '/projects/2',
      author: {
        name: 'Rakesh Muduli',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
      },
      project: {
        name: 'Mobile App Development',
        color: '#10b981'
      },
      priority: 'medium'
    },
    {
      id: '6',
      type: 'milestone_reached',
      title: 'Milestone Reached',
      message: 'Congratulations! SynergySphere Platform reached 50% completion milestone',
      isRead: true,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      userId: user?.id || '1',
      actionUrl: '/projects/1',
      project: {
        name: 'SynergySphere Platform',
        color: '#6366f1'
      },
      priority: 'medium'
    }
  ];

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || notification.type === filterType;
    const matchesRead = filterRead === 'all' || 
                       (filterRead === 'read' && notification.isRead) ||
                       (filterRead === 'unread' && !notification.isRead);
    return matchesSearch && matchesType && matchesRead;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'task_assigned': return <CheckSquare className="w-5 h-5 text-blue-600" />;
      case 'discussion_reply': return <MessageSquare className="w-5 h-5 text-green-600" />;
      case 'deadline_reminder': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'project_update': return <Calendar className="w-5 h-5 text-purple-600" />;
      case 'team_invite': return <UserPlus className="w-5 h-5 text-indigo-600" />;
      case 'milestone_reached': return <Star className="w-5 h-5 text-yellow-600" />;
      default: return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-300';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const markAsRead = (id: string) => {
    // In a real app, this would update the notification in the backend
    console.log('Mark as read:', id);
  };

  const markAllAsRead = () => {
    // In a real app, this would mark all notifications as read
    console.log('Mark all as read');
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
          <p className="text-gray-600">
            {unreadCount > 0 
              ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
              : 'All caught up!'
            }
          </p>
        </div>
        
        <div className="flex space-x-3">
          {unreadCount > 0 && (
            <button 
              onClick={markAllAsRead}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Mark All Read</span>
            </button>
          )}
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <Archive className="w-4 h-4" />
            <span>Archive All</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="all">All Types</option>
          <option value="task_assigned">Task Assigned</option>
          <option value="discussion_reply">Discussion Reply</option>
          <option value="deadline_reminder">Deadline Reminder</option>
          <option value="project_update">Project Update</option>
          <option value="team_invite">Team Invite</option>
          <option value="milestone_reached">Milestone</option>
        </select>

        <select
          value={filterRead}
          onChange={(e) => setFilterRead(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
        </select>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`bg-white rounded-xl border-l-4 ${getPriorityColor(notification.priority)} border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 ${
                !notification.isRead ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className={`font-semibold ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                        {notification.title}
                      </h3>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-3">{notification.message}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{formatTimeAgo(notification.createdAt)}</span>
                      {notification.project && (
                        <div className="flex items-center space-x-1">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: notification.project.color }}
                          ></div>
                          <span>{notification.project.name}</span>
                        </div>
                      )}
                      {notification.author && (
                        <div className="flex items-center space-x-1">
                          <img
                            src={notification.author.avatar}
                            alt={notification.author.name}
                            className="w-4 h-4 rounded-full object-cover"
                          />
                          <span>{notification.author.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  {!notification.isRead && (
                    <button 
                      onClick={() => markAsRead(notification.id)}
                      className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filterType !== 'all' || filterRead !== 'all'
                ? 'Try adjusting your search or filters'
                : 'You\'re all caught up! No new notifications.'
              }
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
