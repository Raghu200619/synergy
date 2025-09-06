import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Sparkles, 
  Send, 
  Bot, 
  Lightbulb,
  Rocket,
  Target,
  Users,
  Calendar
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject?: (suggestion: any) => void;
}

const projectSuggestions = [
  {
    icon: Rocket,
    title: 'Startup Launch',
    description: 'Plan and execute a product launch',
    template: {
      name: 'Product Launch Campaign',
      description: 'Strategic planning and execution of product launch with marketing, development, and sales coordination',
      color: '#ef4444',
      tasks: ['Market Research', 'Product Development', 'Marketing Strategy', 'Launch Event']
    }
  },
  {
    icon: Target,
    title: 'Marketing Campaign',
    description: 'Create a comprehensive marketing strategy',
    template: {
      name: 'Q1 Marketing Campaign',
      description: 'Multi-channel marketing campaign to increase brand awareness and drive customer acquisition',
      color: '#f97316',
      tasks: ['Content Creation', 'Social Media Strategy', 'Email Marketing', 'Analytics Setup']
    }
  },
  {
    icon: Users,
    title: 'Team Building',
    description: 'Organize team activities and workflows',
    template: {
      name: 'Team Development Initiative',
      description: 'Improve team collaboration and productivity through structured activities and processes',
      color: '#10b981',
      tasks: ['Team Assessment', 'Skill Development', 'Process Optimization', 'Performance Review']
    }
  },
  {
    icon: Calendar,
    title: 'Event Planning',
    description: 'Plan and execute events seamlessly',
    template: {
      name: 'Annual Conference 2025',
      description: 'Comprehensive event planning from venue selection to post-event follow-up',
      color: '#8b5cf6',
      tasks: ['Venue Booking', 'Speaker Coordination', 'Marketing & Promotion', 'Event Execution']
    }
  }
];

const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onClose, onCreateProject }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hi Rakesh! I\'m your AI project assistant. I can help you create projects, suggest tasks, and optimize your workflow. What would you like to work on today?',
      timestamp: new Date(),
      suggestions: ['Create a new project', 'Suggest project templates', 'Help with task planning', 'Optimize team workflow']
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (message?: string) => {
    const content = message || inputValue.trim();
    if (!content) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let assistantResponse: Message;

      if (content.toLowerCase().includes('project') || content.toLowerCase().includes('create')) {
        assistantResponse = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: 'Great! I can help you create a project. Here are some popular templates to get you started quickly:',
          timestamp: new Date(),
          suggestions: ['Use template', 'Custom project', 'Import from file']
        };
      } else if (content.toLowerCase().includes('task')) {
        assistantResponse = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: 'I can help you plan tasks effectively! For better task management, consider breaking down large tasks, setting clear priorities, and assigning realistic deadlines.',
          timestamp: new Date(),
          suggestions: ['Create task template', 'Set task priorities', 'Schedule tasks']
        };
      } else {
        assistantResponse = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: 'I understand! Let me help you with that. Would you like me to suggest some project templates or help you create a custom project from scratch?',
          timestamp: new Date(),
          suggestions: ['Show templates', 'Create custom', 'Get recommendations']
        };
      }

      setMessages(prev => [...prev, assistantResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleTemplateSelect = (template: any) => {
    if (onCreateProject) {
      onCreateProject(template);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-20"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, x: 400, y: 100 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 400, y: 100 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md h-[600px] flex flex-col border border-gray-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-2xl">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">AI Assistant</h3>
                  <p className="text-xs opacity-90">Your project companion</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${
                    message.type === 'user' 
                      ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-md' 
                      : 'bg-gray-100 text-gray-900 rounded-2xl rounded-tl-md'
                  } px-4 py-2`}>
                    <p className="text-sm">{message.content}</p>
                    {message.suggestions && (
                      <div className="mt-3 space-y-2">
                        {message.suggestions.map((suggestion, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSend(suggestion)}
                            className="block w-full text-left px-3 py-2 bg-white bg-opacity-20 rounded-lg text-xs hover:bg-opacity-30 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Project Templates */}
              {messages.some(m => m.content.includes('templates')) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3"
                >
                  <div className="text-sm font-medium text-gray-600 flex items-center space-x-2">
                    <Lightbulb className="w-4 h-4" />
                    <span>Project Templates</span>
                  </div>
                  {projectSuggestions.map((suggestion, idx) => {
                    const Icon = suggestion.icon;
                    return (
                      <motion.button
                        key={idx}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleTemplateSelect(suggestion.template)}
                        className="w-full p-3 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:border-indigo-300 transition-all duration-200 text-left"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="p-2 rounded-lg" style={{ backgroundColor: `${suggestion.template.color}20` }}>
                            <Icon className="w-4 h-4" style={{ color: suggestion.template.color }} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 text-sm">{suggestion.title}</h4>
                            <p className="text-xs text-gray-600 mt-1">{suggestion.description}</p>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </motion.div>
              )}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-100 rounded-2xl rounded-tl-md px-4 py-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me anything about your projects..."
                  aria-label="Ask AI assistant about projects"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSend()}
                  disabled={!inputValue.trim()}
                  aria-label="Send message to AI assistant"
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AIAssistant;
