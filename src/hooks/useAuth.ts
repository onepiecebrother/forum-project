import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { UserProfile } from '@/types';

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initAuth();
  }, []);

  const initAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUser(session.user);
      await fetchProfile(session.user.id);
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session?.user) {
        setUser(null);
        setProfile(null);
      } else if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      }
    });

    setLoading(false);

    return () => {
      subscription.unsubscribe();
    };
  };

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    if (data) setProfile(data);
  };

  const logout = async () => {
    try {
      setUser(null);
      setProfile(null);
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      console.error('Error logging out:', error);
      try {
        await supabase.auth.signOut({ scope: 'local' });
      } catch (localError) {
        console.error('Local signout also failed:', localError);
      }
    }
  };

  return {
    user,
    profile,
    loading,
    fetchProfile,
    logout
  };
}