import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSessionKey } from '@/utils/session';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const sessionKey = getSessionKey();
    if (!sessionKey) {
      navigate('/auth');
    }
  }, [navigate]);

  return <>{children}</>;
};

export default ProtectedRoute;