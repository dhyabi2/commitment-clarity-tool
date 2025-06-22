
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import SignIn from '@/components/auth/SignIn';
import WelcomePage from '@/components/welcome/WelcomePage';
import { useWelcomeState } from '@/hooks/useWelcomeState';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const { hasSeenWelcome, markWelcomeAsCompleted } = useWelcomeState();

  if (loading || hasSeenWelcome === null) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-sage-500" />
      </div>
    );
  }

  if (!user) {
    return <SignIn />;
  }

  if (!hasSeenWelcome) {
    return <WelcomePage onComplete={markWelcomeAsCompleted} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
