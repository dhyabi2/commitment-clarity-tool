import React, { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface PendingAction {
  action: () => void;
  context?: any;
}

export const useAuthGuard = () => {
  const { user, loading } = useAuth();
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [modalConfig, setModalConfig] = useState({
    title: "Sign in required",
    description: "Please sign in to use this feature and save your data securely."
  });

  const executeWithAuth = useCallback((
    action: () => void, 
    context?: any,
    customConfig?: { title?: string; description?: string }
  ) => {
    if (loading) return;
    
    if (user) {
      // User is authenticated, execute immediately
      action();
    } else {
      // User not authenticated, store action and show modal
      console.log('Storing pending action with context:', context);
      setPendingAction({ action, context });
      if (customConfig) {
        setModalConfig({
          title: customConfig.title || "Sign in required",
          description: customConfig.description || "Please sign in to use this feature and save your data securely."
        });
      }
      setShowSignInModal(true);
    }
  }, [user, loading]);

  const handleModalClose = useCallback((open: boolean) => {
    setShowSignInModal(open);
    if (!open) {
      // Don't clear pending action when modal closes - keep it for when user signs in
      console.log('Modal closed, keeping pending action for later execution');
    }
  }, []);

  // Execute pending action when user becomes authenticated
  React.useEffect(() => {
    console.log('Auth state changed - user:', !!user, 'pendingAction:', !!pendingAction);
    
    if (user && pendingAction && !loading) {
      console.log('Executing pending action after successful sign-in');
      
      // Execute the pending action immediately
      try {
        pendingAction.action();
        console.log('Pending action executed successfully');
      } catch (error) {
        console.error('Error executing pending action:', error);
      }
      
      // Clean up
      setPendingAction(null);
      setShowSignInModal(false);
    }
  }, [user, pendingAction, loading]);

  return {
    executeWithAuth,
    showSignInModal,
    setShowSignInModal: handleModalClose,
    modalConfig,
    isAuthenticated: !!user && !loading,
    pendingAction // Expose for debugging
  };
};
