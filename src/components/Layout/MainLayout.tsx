import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import AIAssistant from '../Assistant/AIAssistant';
import { useAuth } from '../../hooks/useAuth';
import { useProjects } from '../../hooks/useProjects';

const MainLayout: React.FC = () => {
  const { user } = useAuth();
  const { createProject } = useProjects();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  if (!user) return null;

  const handleCreateProject = () => {
    navigate('/projects');
  };

  const handleAssistantCreateProject = async (template: any) => {
    const projectData = {
      name: template.name,
      description: template.description,
      status: 'active' as const,
      progress: 0,
      startDate: new Date(),
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      color: template.color,
      createdBy: user.id
    };
    
    const newProject = await createProject(projectData);
    setIsAssistantOpen(false);
    navigate(`/projects/${newProject.id}`);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        user={user}
        isMobile={isMobile}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          user={user}
          onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          onCreateProject={handleCreateProject}
          onOpenAssistant={() => setIsAssistantOpen(true)}
        />

        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>

      <AIAssistant
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        onCreateProject={handleAssistantCreateProject}
      />
    </div>
  );
};

export default MainLayout;
