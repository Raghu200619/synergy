import React from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { 
  CheckCircle, 
  MessageSquare, 
  UserPlus, 
  FileText,
  Clock
} from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'task_completed' | 'comment_added' | 'member_added' | 'project_created';
  user: {
    name: string;
    avatar: string;
  };
  description: string;
  timestamp: Date;
  projectName?: string;
}

const mockActivity: ActivityItem[] = [
  {
    id: '1',
    type: 'task_completed',
    user: {
      name: 'Sarah Wilson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face'
    },
    description: 'completed task "Design user interface mockups"',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    projectName: 'SynergySphere Platform'
  },
  {
    id: '2',
    type: 'comment_added',
    user: {
      name: 'Mike Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face'
    },
    description: 'commented on "Database schema discussion"',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    projectName: 'SynergySphere Platform'
  },
  {
    id: '3',
    type: 'member_added',
    user: {
      name: 'John Doe',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
    },
    description: 'added Emma Thompson to team',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
    projectName: 'Mobile App Development'
  }
];

const getActivityIcon = (type: ActivityItem['type']) => {
  switch (type) {
    case 'task_completed':
      return CheckCircle;
    case 'comment_added':
      return MessageSquare;
    case 'member_added':
      return UserPlus;
    case 'project_created':
      return FileText;
    default:
      return Clock;
  }
};

const getActivityColor = (type: ActivityItem['type']) => {
  switch (type) {
    case 'task_completed':
      return 'text-green-600 bg-green-100';
    case 'comment_added':
      return 'text-blue-600 bg-blue-100';
    case 'member_added':
      return 'text-purple-600 bg-purple-100';
    case 'project_created':
      return 'text-indigo-600 bg-indigo-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

const RecentActivity: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white rounded-xl border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
          View all
        </button>
      </div>

      <div className="space-y-4">
        {mockActivity.map((activity, index) => {
          const Icon = getActivityIcon(activity.type);
          const colorClass = getActivityColor(activity.type);

          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-start space-x-3"
            >
              <div className={`p-2 rounded-lg ${colorClass}`}>
                <Icon className="w-4 h-4" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <img
                    src={activity.user.avatar}
                    alt={activity.user.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="text-sm font-medium text-gray-900">
                    {activity.user.name}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mt-1">
                  {activity.description}
                  {activity.projectName && (
                    <span className="text-indigo-600 font-medium ml-1">
                      in {activity.projectName}
                    </span>
                  )}
                </p>
                
                <p className="text-xs text-gray-500 mt-1">
                  {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default RecentActivity;
