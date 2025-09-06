import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  FolderOpen, 
  Users, 
  MessageSquare, 
  Bell, 
  CheckSquare,
  Search,
  LogOut
} from 'lucide-react';
import { User } from '../../types';
import { useAuth } from '../../hooks/useAuth';

interface SidebarProps {
  user: User;
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  user, 
  isMobile = false,
  isOpen = true,
  onClose 
}) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard' },
    { id: 'projects', label: 'Projects', icon: FolderOpen, path: '/projects' },
    { id: 'my-tasks', label: 'My Tasks', icon: CheckSquare, path: '/my-tasks' },
    { id: 'team', label: 'Team', icon: Users, path: '/team' },
    { id: 'discussions', label: 'Discussions', icon: MessageSquare, path: '/discussions' },
    { id: 'notifications', label: 'Notifications', icon: Bell, path: '/notifications' },
  ];

  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: isMobile ? -280 : 0, opacity: isMobile ? 0 : 1 }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <motion.div
        variants={sidebarVariants}
        animate={isOpen ? 'open' : 'closed'}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 
          flex flex-col ${isMobile ? 'lg:translate-x-0' : ''}
        `}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="font-bold text-xl text-gray-900">SynergySphere</span>
          </div>
        </div>

        <div className="p-6 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              aria-label="Search projects and content"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        <nav className="flex-1 px-6">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <NavLink
                    to={item.path}
                    onClick={() => {
                      if (isMobile && onClose) onClose();
                    }}
                    className={({ isActive }) => `
                      w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200
                      ${isActive 
                        ? 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-700' 
                        : 'text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    {({ isActive }) => (
                      <>
                        <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-700' : 'text-gray-500'}`} />
                        <span className="font-medium">{item.label}</span>
                      </>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-6 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
              title="Logout"
              aria-label="Logout from SynergySphere"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
