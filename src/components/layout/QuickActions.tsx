import React, { useState } from 'react';
import { Plus, MessageSquare, Search, Bell } from 'lucide-react';

interface QuickActionsProps {
  user?: any;
  onCreateThread: () => void;
  onSearch: () => void;
  onNotifications: () => void;
  onAuthClick: () => void;
}

export default function QuickActions({ 
  user, 
  onCreateThread, 
  onSearch, 
  onNotifications,
  onAuthClick 
}: QuickActionsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const actions = [
    {
      icon: MessageSquare,
      label: 'New Thread',
      action: user ? onCreateThread : onAuthClick,
      color: 'from-blue-600 to-purple-600',
      requiresAuth: true
    },
    {
      icon: Search,
      label: 'Search',
      action: onSearch,
      color: 'from-green-600 to-blue-600',
      requiresAuth: false
    },
    {
      icon: Bell,
      label: 'Notifications',
      action: user ? onNotifications : onAuthClick,
      color: 'from-orange-600 to-red-600',
      requiresAuth: true
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <div className="flex flex-col items-end space-y-3">
        {/* Action Buttons */}
        <div className={`flex flex-col space-y-3 transition-all duration-300 ${
          isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}>
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={action.action}
                className={`w-12 h-12 bg-gradient-to-r ${action.color} text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group relative`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <Icon className="w-5 h-5" />
                
                {/* Tooltip */}
                <div className="absolute right-full mr-3 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {action.requiresAuth && !user ? 'Sign in required' : action.label}
                  <div className="absolute top-1/2 left-full transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-gray-900 dark:border-l-gray-700 border-y-4 border-y-transparent"></div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center ${
            isExpanded ? 'rotate-45' : 'rotate-0'
          }`}
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Backdrop */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
}