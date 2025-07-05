
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useAnonymousMode } from '@/hooks/useAnonymousMode';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  hasAnonymousData: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasAnonymousData, setHasAnonymousData] = useState(false);
  const { isAnonymous } = useAnonymousMode();

  // Check for anonymous data when user signs in
  const checkAnonymousData = async () => {
    if (isAnonymous) {
      // Check if there's any anonymous data to migrate
      const deviceId = localStorage.getItem('deviceId');
      if (deviceId) {
        try {
          const { data: thoughts } = await supabase
            .from('thoughts')
            .select('id')
            .eq('device_id', deviceId)
            .limit(1);

          const { data: commitments } = await supabase
            .from('commitments')
            .select('id')
            .eq('device_id', deviceId)
            .limit(1);

          setHasAnonymousData((thoughts && thoughts.length > 0) || (commitments && commitments.length > 0));
        } catch (error) {
          console.error('Error checking anonymous data:', error);
        }
      }
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Check for anonymous data when user signs in
      if (event === 'SIGNED_IN' && session?.user) {
        await checkAnonymousData();
      }

      // Clear anonymous data flag when user signs out
      if (event === 'SIGNED_OUT') {
        setHasAnonymousData(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Check anonymous data when component mounts
  useEffect(() => {
    checkAnonymousData();
  }, [isAnonymous]);

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    
    if (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const value = {
    user,
    session,
    loading,
    signInWithGoogle,
    signOut,
    hasAnonymousData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
