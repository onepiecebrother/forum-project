import React, { useState, useEffect } from 'react';
import { Search, X, MessageSquare, Users, Handshake, Clock, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState({
    threads: [],
    users: [],
    agents: []
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'threads' | 'users' | 'agents'>('all');

  useEffect(() => {
    if (searchTerm.length >= 2) {
      performSearch();
    } else {
      setResults({ threads: [], users: [], agents: [] });
    }
  }, [searchTerm]);

  const performSearch = async () => {
    setLoading(true);
    try {
      const searchQuery = `%${searchTerm}%`;

      // Search threads
      const { data: threads } = await supabase
        .from('threads')
        .select(`
          id, title, content, created_at, views,
          profiles(username, avatar_url),
          categories(name, color)
        `)
        .or(`title.ilike.${searchQuery},content.ilike.${searchQuery}`)
        .limit(5);

      // Search users
      const { data: users } = await supabase
        .from('profiles')
        .select('id, username, avatar_url, bio, post_count, reputation, is_verified, is_admin, is_owner')
        .or(`username.ilike.${searchQuery},bio.ilike.${searchQuery}`)
        .limit(5);

      // Search agents
      const { data: agents } = await supabase
        .from('agents')
        .select(`
          id, current_location, services, tags, description,
          profiles(id, username, avatar_url, is_verified)
        `)
        .or(`current_location.ilike.${searchQuery},description.ilike.${searchQuery}`)
        .limit(5);

      setResults({
        threads: threads || [],
        users: users || [],
        agents: agents || []
      });
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleThreadClick = (threadId: string) => {
    navigate(`/thread/${threadId}`);
    onClose();
  };

  const handleUserClick = (userId: string) => {
    navigate(`/user/${userId}`);
    onClose();
  };

  const handleAgentClick = (agentId: string) => {
    navigate('/agents');
    onClose();
  };

  const getTotalResults = () => {
    return results.threads.length + results.users.length + results.agents.length;
  };

  const getFilteredResults = () => {
    switch (activeTab) {
      case 'threads':
        return { threads: results.threads, users: [], agents: [] };
      case 'users':
        return { threads: [], users: results.users, agents: [] };
      case 'agents':
        return { threads: [], users: [], agents: results.agents };
      default:
        return results;
    }
  };

  if (!isOpen) return null;

  const filteredResults = getFilteredResults();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-50 p-4 pt-20">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl relative overflow-hidden max-h-[80vh]">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600"></div>
        
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Search className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search threads, users, agents..."
                className="w-full text-xl font-medium bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                autoFocus
              />
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {searchTerm.length >= 2 && (
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'all'
                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                All ({getTotalResults()})
              </button>
              <button
                onClick={() => setActiveTab('threads')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'threads'
                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Threads ({results.threads.length})
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'users'
                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Users ({results.users.length})
              </button>
              <button
                onClick={() => setActiveTab('agents')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'agents'
                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Agents ({results.agents.length})
              </button>
            </div>
          )}
        </div>

        <div className="overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : searchTerm.length < 2 ? (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">Type at least 2 characters to search</p>
            </div>
          ) : getTotalResults() === 0 ? (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No results found for "{searchTerm}"</p>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              {/* Threads */}
              {filteredResults.threads.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5" />
                    <span>Threads</span>
                  </h3>
                  <div className="space-y-3">
                    {filteredResults.threads.map((thread: any) => (
                      <div
                        key={thread.id}
                        onClick={() => handleThreadClick(thread.id)}
                        className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                      >
                        <div className="flex items-start space-x-3">
                          <div
                            className="w-3 h-3 rounded-full mt-2"
                            style={{ backgroundColor: thread.categories?.color || '#3b82f6' }}
                          ></div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-white line-clamp-1">
                              {thread.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
                              {thread.content}
                            </p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-500">
                              <span>by {thread.profiles?.username}</span>
                              <span>{thread.views} views</span>
                              <span>{new Date(thread.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Users */}
              {filteredResults.users.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>Users</span>
                  </h3>
                  <div className="space-y-3">
                    {filteredResults.users.map((user: any) => (
                      <div
                        key={user.id}
                        onClick={() => handleUserClick(user.id)}
                        className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          {user.avatar_url ? (
                            <img
                              src={user.avatar_url}
                              alt={user.username}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                              {user.username.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {user.username}
                              </h4>
                              {user.is_verified && <span className="text-blue-500">✓</span>}
                              {user.is_admin && <span className="text-red-500">👑</span>}
                              {user.is_owner && <span className="text-purple-500">💎</span>}
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                              <span>{user.post_count} posts</span>
                              <span>{user.reputation} reputation</span>
                            </div>
                            {user.bio && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1 mt-1">
                                {user.bio}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Agents */}
              {filteredResults.agents.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                    <Handshake className="w-5 h-5" />
                    <span>Agents</span>
                  </h3>
                  <div className="space-y-3">
                    {filteredResults.agents.map((agent: any) => (
                      <div
                        key={agent.id}
                        onClick={() => handleAgentClick(agent.id)}
                        className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          {agent.profiles?.avatar_url ? (
                            <img
                              src={agent.profiles.avatar_url}
                              alt={agent.profiles.username}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                              {agent.profiles?.username?.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {agent.profiles?.username}
                              </h4>
                              {agent.profiles?.is_verified && <span className="text-blue-500">✓</span>}
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                              {agent.current_location && <span>📍 {agent.current_location}</span>}
                              {agent.services?.length > 0 && (
                                <span>{agent.services.length} services</span>
                              )}
                            </div>
                            {agent.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1 mt-1">
                                {agent.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}