
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

export const useAuthErrorHandler = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      // User session might have expired or they're not authenticated
      const currentPath = window.location.pathname;
      
      // Don't show error on public pages
      if (currentPath === '/' || currentPath === '/auth') {
        return;
      }

      toast({
        title: "Authentication Required",
        description: "Please sign in to access this feature.",
        variant: "destructive",
        duration: 5000,
      });

      // Redirect to home page where they can sign in
      navigate('/');
    }
  }, [user, loading, toast, navigate]);

  const handleAuthError = (error: any) => {
    console.error('Authentication error:', error);
    
    if (error?.message?.includes('JWT')) {
      toast({
        title: "Session Expired",
        description: "Your session has expired. Please sign in again.",
        variant: "destructive",
      });
    } else if (error?.message?.includes('network') || error?.message?.includes('fetch')) {
      toast({
        title: "Connection Error",
        description: "Unable to connect. Please check your internet connection.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Authentication Error",
        description: "An authentication error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  return { handleAuthError };
};
