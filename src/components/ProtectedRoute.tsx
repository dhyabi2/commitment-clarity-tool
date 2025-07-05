
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useWelcomeState } from '@/hooks/useWelcomeState';
import { useAnonymousMode } from '@/hooks/useAnonymousMode';
import { Loader2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import AnonymousDataMigrationPrompt from '@/components/auth/AnonymousDataMigrationPrompt';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAuth = false }) => {
  const { user, loading, hasAnonymousData } = useAuth();
  const { hasSeenWelcome, markWelcomeAsCompleted } = useWelcomeState();
  const { isAnonymous } = useAnonymousMode();
  const navigate = useNavigate();
  const location = useLocation();

  // Show loading while auth state is being determined
  if (loading || (user && hasSeenWelcome === null)) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-sage-500" />
      </div>
    );
  }

  // Handle authentication requirements
  if (requireAuth && !user && !isAnonymous) {
    // Redirect to home page for sign-in
    React.useEffect(() => {
      navigate('/');
    }, [navigate]);
    
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <p className="text-sage-600 mb-2">Authentication required</p>
          <p className="text-sage-500">Redirecting to sign in...</p>
        </div>
      </div>
    );
  }

  // Show data migration prompt for authenticated users with anonymous data
  if (user && hasAnonymousData && location.pathname !== '/') {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-4">
        <AnonymousDataMigrationPrompt 
          onSkip={() => {
            // Continue to the app without migrating
            window.location.reload();
          }}
        />
      </div>
    );
  }

  // Show welcome page for authenticated users who haven't seen it
  if (user && !hasSeenWelcome) {
    const WelcomePage = React.lazy(() => import('@/components/welcome/WelcomePage'));
    return (
      <React.Suspense fallback={
        <div className="min-h-screen bg-cream flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-sage-500" />
        </div>
      }>
        <WelcomePage onComplete={markWelcomeAsCompleted} />
      </React.Suspense>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
