
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import SignIn from '@/components/auth/SignIn';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-sage-500" />
      </div>
    );
  }

  if (!user) {
    return <SignIn />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
