
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useWelcomeState } from '@/hooks/useWelcomeState';
import { useAnonymousMode } from '@/hooks/useAnonymousMode';
import { Loader2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAuth = false }) => {
  const { user, loading } = useAuth();
  const { hasSeenWelcome, markWelcomeAsCompleted } = useWelcomeState();
  const { isAnonymous } = useAnonymousMode();
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    // If user is anonymous and on the home page, redirect to thoughts
    if (isAnonymous && location.pathname === '/') {
      navigate('/thoughts');
    }
  }, [isAnonymous, location.pathname, navigate]);

  if (loading || (user && hasSeenWelcome === null)) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-sage-500" />
      </div>
    );
  }

  // If authentication is required but user is not logged in and not in anonymous mode, redirect to sign in
  if (requireAuth && !user && !isAnonymous) {
    const SignIn = React.lazy(() => import('@/components/auth/SignIn'));
    return (
      <React.Suspense fallback={
        <div className="min-h-screen bg-cream flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-sage-500" />
        </div>
      }>
        <SignIn />
      </React.Suspense>
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
