import React, { useState, useEffect } from 'react';
import { Bell, X, Check, MessageSquare, Handshake, Star, Shield, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: any;
}

export default function NotificationCenter({ isOpen, onClose, currentUser }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isOpen && currentUser) {
      fetchNotifications();
    }
  }, [isOpen, currentUser]);

  const fetchNotifications = async () => {
    if (!currentUser) return;

    try {
      // Simulate notifications based on recent activity
      const mockNotifications = [
        {
          id: '1',
          type: 'deal_response',
          title: 'Deal Response Received',
          message: 'Someone responded to your deal proposal',
          icon: Handshake,
          color: 'text-green-600',
          bgColor: 'bg-green-100 dark:bg-green-900/30',
          timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          read: false
        },
        {
          id: '2',
          type: 'thread_reply',
          title: 'New Reply',
          message: 'Your thread "Technology Discussion" has a new reply',
          icon: MessageSquare,
          color: 'text-blue-600',
          bgColor: 'bg-blue-100 dark:bg-blue-900/30',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          read: false
        },
        {
          id: '3',
          type: 'review_received',
          title: 'New Review',
          message: 'You received a 5-star review from a recent deal',
          icon: Star,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
          read: true
        },
        {
          id: '4',
          type: 'verification_approved',
          title: 'Verification Approved',
          message: 'Your verification request has been approved!',
          icon: Shield,
          color: 'text-purple-600',
          bgColor: 'bg-purple-100 dark:bg-purple-900/30',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
          read: true
        }
      ];

      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-50 p-4 pt-20">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden max-h-[80vh]">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600"></div>
        
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center relative">
                <Bell className="w-5 h-5 text-white" />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Notifications</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {unreadCount} unread
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : notifications.length > 0 ? (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {notifications.map((notification) => {
                const Icon = notification.icon;
                return (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer ${
                      !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${notification.bgColor}`}>
                        <Icon className={`w-5 h-5 ${notification.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-sm font-medium ${
                            !notification.read ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                          {formatTimestamp(notification.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No notifications yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}