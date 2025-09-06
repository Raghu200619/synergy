import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Users, 
  Clock, 
  Pin,
  MoreVertical,
  Reply,
  Heart,
  ThumbsUp
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useProjects } from '../hooks/useProjects';

interface Discussion {
  id: string;
  title: string;
  projectId: string;
  projectName: string;
  author: {
    name: string;
    avatar: string;
  };
  createdAt: Date;
  lastMessage?: {
    author: string;
    content: string;
    timestamp: Date;
  };
  messageCount: number;
  isPinned: boolean;
}

const DiscussionsPage: React.FC = () => {
  const { user } = useAuth();
  const { projects } = useProjects();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState<string>('all');

  // Generate mock discussions based on projects
  const discussions: Discussion[] = projects.flatMap(project => [
    {
      id: `${project.id}-discussion-1`,
      title: `General Discussion - ${project.name}`,
      projectId: project.id,
      projectName: project.name,
      author: {
        name: project.members[0]?.name || 'Team Member',
        avatar: project.members[0]?.avatar || 'https://ui-avatars.com/api/?name=TM&background=6366f1&color=fff'
      },
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      lastMessage: {
        author: project.members[1]?.name || 'Another Member',
        content: 'Great progress on this project! Looking forward to the next milestone.',
        timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000)
      },
      messageCount: Math.floor(Math.random() * 20) + 5,
      isPinned: Math.random() > 0.8
    },
    {
      id: `${project.id}-discussion-2`,
      title: `Technical Questions - ${project.name}`,
      projectId: project.id,
      projectName: project.name,
      author: {
        name: project.members[1]?.name || 'Tech Lead',
        avatar: project.members[1]?.avatar || 'https://ui-avatars.com/api/?name=TL&background=10b981&color=fff'
      },
      createdAt: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000),
      lastMessage: {
        author: project.members[0]?.name || 'Developer',
        content: 'I have a question about the API integration. Can someone help?',
        timestamp: new Date(Date.now() - Math.random() * 12 * 60 * 60 * 1000)
      },
      messageCount: Math.floor(Math.random() * 15) + 3,
      isPinned: false
    }
  ]);

  const filteredDiscussions = discussions.filter(discussion => {
    const matchesSearch = discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         discussion.lastMessage?.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProject = selectedProject === 'all' || discussion.projectId === selectedProject;
    return matchesSearch && matchesProject;
  });

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Discussions</h2>
          <p className="text-gray-600">Team conversations and project discussions</p>
        </div>
        
        <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <Plus className="w-4 h-4" />
          <span>New Discussion</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search discussions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="all">All Projects</option>
          {projects.map(project => (
            <option key={project.id} value={project.id}>{project.name}</option>
          ))}
        </select>
      </div>

      {/* Discussions List */}
      <div className="space-y-4">
        {filteredDiscussions.length > 0 ? (
          filteredDiscussions.map((discussion, index) => (
            <motion.div
              key={discussion.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    {discussion.isPinned && (
                      <Pin className="w-4 h-4 text-indigo-600" />
                    )}
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {discussion.title}
                    </h3>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{discussion.projectName}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>{discussion.messageCount} messages</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatTimeAgo(discussion.createdAt)}</span>
                    </div>
                  </div>

                  {discussion.lastMessage && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <img
                          src={discussion.author.avatar}
                          alt={discussion.lastMessage.author}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="text-sm font-medium text-gray-900">
                          {discussion.lastMessage.author}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatTimeAgo(discussion.lastMessage.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {discussion.lastMessage.content}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Reply className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <Heart className="w-4 h-4" />
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
              <MessageSquare className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No discussions found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || selectedProject !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Start a new discussion to get the conversation going'
              }
            </p>
            {!searchTerm && selectedProject === 'all' && (
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Create First Discussion
              </button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DiscussionsPage;
