import React, { useState, useEffect } from 'react';
import { TrendingUp, MessageSquare, Eye, Clock, Fire } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function TrendingTopics() {
  const navigate = useNavigate();
  const [trendingThreads, setTrendingThreads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrendingThreads();
  }, []);

  const fetchTrendingThreads = async () => {
    try {
      // Get threads with high activity in the last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: threads } = await supabase
        .from('threads')
        .select(`
          id, title, views, created_at,
          profiles(username, avatar_url),
          categories(name, color)
        `)
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('views', { ascending: false })
        .limit(5);

      if (threads) {
        // Get post counts for each thread
        const threadsWithCounts = await Promise.all(
          threads.map(async (thread) => {
            const { count } = await supabase
              .from('posts')
              .select('*', { count: 'exact', head: true })
              .eq('thread_id', thread.id);
            
            return { ...thread, post_count: count || 0 };
          })
        );

        setTrendingThreads(threadsWithCounts);
      }
    } catch (error) {
      console.error('Error fetching trending threads:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTrendingScore = (thread: any) => {
    const ageInDays = (Date.now() - new Date(thread.created_at).getTime()) / (1000 * 60 * 60 * 24);
    const viewsPerDay = thread.views / Math.max(ageInDays, 1);
    const postsPerDay = thread.post_count / Math.max(ageInDays, 1);
    return Math.round(viewsPerDay + (postsPerDay * 5));
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Trending Now</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Hot topics this week</p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {trendingThreads.length > 0 ? (
          trendingThreads.map((thread, index) => (
            <div
              key={thread.id}
              onClick={() => navigate(`/thread/${thread.id}`)}
              className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-yellow-500 text-white' :
                    index === 1 ? 'bg-gray-400 text-white' :
                    index === 2 ? 'bg-orange-500 text-white' :
                    'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                  }`}>
                    {index === 0 ? <Fire className="w-4 h-4" /> : index + 1}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: thread.categories?.color || '#3b82f6' }}
                    ></div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {thread.categories?.name}
                    </span>
                  </div>
                  
                  <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2 mb-2">
                    {thread.title}
                  </h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>{thread.views}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageSquare className="w-3 h-3" />
                        <span>{thread.post_count}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(thread.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1 text-xs font-medium text-orange-600 dark:text-orange-400">
                      <TrendingUp className="w-3 h-3" />
                      <span>{getTrendingScore(thread)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center">
            <TrendingUp className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">No trending topics yet</p>
          </div>
        )}
      </div>
    </div>
  );
}