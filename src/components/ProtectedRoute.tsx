import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { hasValidSession } from '@/utils/session';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!hasValidSession()) {
      navigate('/auth');
    }
  }, [navigate]);

  if (!hasValidSession()) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;