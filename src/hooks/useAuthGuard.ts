
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
      setPendingAction(null);
    }
  }, []);

  // Execute pending action when user becomes authenticated
  React.useEffect(() => {
    if (user && pendingAction) {
      // Small delay to allow modal to close gracefully
      setTimeout(() => {
        pendingAction.action();
        setPendingAction(null);
        setShowSignInModal(false);
      }, 100);
    }
  }, [user, pendingAction]);

  return {
    executeWithAuth,
    showSignInModal,
    setShowSignInModal: handleModalClose,
    modalConfig,
    isAuthenticated: !!user && !loading
  };
};
