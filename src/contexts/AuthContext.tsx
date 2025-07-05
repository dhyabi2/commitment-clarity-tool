
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useAnonymousMode } from '@/hooks/useAnonymousMode';
import { useAnonymousMigration } from '@/hooks/useAnonymousMigration';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { disableAnonymousMode } = useAnonymousMode();
  const { migrateAnonymousDataMutation, checkHasAnonymousData } = useAnonymousMigration();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, !!session);
        
        setSession(session);
        const newUser = session?.user ?? null;
        setUser(newUser);
        
        // Handle user sign-in with potential anonymous data migration
        if (event === 'SIGNED_IN' && newUser) {
          console.log('User signed in, checking for anonymous data to migrate...');
          
          // Check if there's anonymous data to migrate
          const hasAnonymousData = await checkHasAnonymousData();
          
          if (hasAnonymousData) {
            console.log('Found anonymous data, starting migration...');
            // Migrate anonymous data to the new user account
            migrateAnonymousDataMutation.mutate(newUser.id);
          }
          
          // Disable anonymous mode when user signs in
          disableAnonymousMode();
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [disableAnonymousMode, migrateAnonymousDataMutation, checkHasAnonymousData]);

  const signInWithGoogle = async () => {
    const redirectUrl = window.location.origin;
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
      },
    });
    
    if (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      throw error;
    }
    
    // Clear user state immediately on sign out
    setUser(null);
    setSession(null);
  };

  const value = {
    user,
    session,
    loading,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
