import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { useAuth } from '@/hooks';
import Layout from '@/components/layout/Layout';
import ForumPage from '@/pages/ForumPage';
import AdminPage from '@/pages/AdminPage';
import OwnerPage from '@/pages/OwnerPage';
import ThreadPage from '@/pages/ThreadPage';
import UserPage from '@/pages/UserPage';
import DealsPage from '@/pages/DealsPage';
import AgentPage from '@/pages/AgentPage';
import AuthModal from '@/components/AuthModal';
import ProfileModal from '@/components/ProfileModal';
import SettingsModal from '@/components/SettingsModal';

function App() {
  const { user, profile, loading, fetchProfile, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  if (loading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <Router>
        <Layout
          user={user}
          profile={profile}
          onAuthClick={() => setShowAuthModal(true)}
          onProfileClick={() => setShowProfile(true)}
          onSettingsClick={() => setShowSettings(true)}
          onLogout={logout}
        >
          <Routes>
            <Route 
              path="/" 
              element={
                <ForumPage 
                  user={user} 
                  profile={profile}
                  onAuthClick={() => setShowAuthModal(true)}
                />
              } 
            />
            <Route 
              path="/thread/:threadId" 
              element={<ThreadPage user={user} />} 
            />
            <Route 
              path="/user/:userId" 
              element={<UserPage />} 
            />
            <Route 
              path="/deals" 
              element={<DealsPage />} 
            />
            <Route 
              path="/agents" 
              element={<AgentPage />} 
            />
            <Route 
              path="/admin" 
              element={
                (profile?.is_admin || profile?.is_owner) ? (
                  <AdminPage />
                ) : (
                  <Navigate to="/" replace />
                )
              } 
            />
            <Route 
              path="/owner" 
              element={
                profile?.is_owner ? (
                  <OwnerPage />
                ) : (
                  <Navigate to="/" replace />
                )
              } 
            />
          </Routes>

          {/* Modals */}
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
          />
          
          {profile && (
            <ProfileModal
              isOpen={showProfile}
              onClose={() => setShowProfile(false)}
              profile={profile}
              onProfileUpdate={() => {
                if (user) fetchProfile(user.id);
              }}
              isOwnProfile={true}
            />
          )}

          <SettingsModal
            isOpen={showSettings}
            onClose={() => setShowSettings(false)}
          />
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;