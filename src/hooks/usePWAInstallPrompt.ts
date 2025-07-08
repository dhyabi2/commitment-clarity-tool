
import { useState, useEffect } from 'react';
import { usePWAInstall } from './usePWAInstall';

export const usePWAInstallPrompt = () => {
  const { 
    isInstallable, 
    isInstalled, 
    isDismissed,
    promptInstall, 
    dismissPrompt,
    deferredPrompt 
  } = usePWAInstall();
  
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  // Show prompt with delay if installable and not dismissed for this session
  useEffect(() => {
    if (isInstallable && !isInstalled && !isDismissed) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        console.log('Showing PWA install prompt', {
          isInstallable,
          isInstalled,
          isDismissed,
          hasDeferredPrompt: deferredPrompt,
          timestamp: new Date().toISOString()
        });
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      console.log('PWA prompt conditions not met', {
        isInstallable,
        isInstalled,
        isDismissed,
        timestamp: new Date().toISOString()
      });
    }
  }, [isInstallable, isInstalled, isDismissed, deferredPrompt]);

  const handleInstall = async () => {
    console.log('Install button clicked', {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    });
    
    setIsInstalling(true);
    
    try {
      const success = await promptInstall();
      console.log('Install result:', success);
      
      // Always hide the prompt after install attempt
      setIsVisible(false);
    } catch (error) {
      console.error('Install failed:', error);
      setIsVisible(false);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleDismiss = () => {
    dismissPrompt(); // Only dismisses for current session
    setIsVisible(false);
    console.log('PWA prompt dismissed by user (session only)');
  };

  // Detect if we should show manual installation instructions
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isInStandaloneMode = window.navigator.standalone;
  const showManualInstructions = isIOS && !isInStandaloneMode && !deferredPrompt;

  // Show in development mode for testing, or if conditions are met
  const shouldShow = isVisible && (isInstallable || (import.meta.env.DEV && !isInstalled));

  console.log('PWA Install Prompt State:', {
    isVisible,
    isInstallable,
    isInstalled,
    isDismissed,
    shouldShow,
    showManualInstructions,
    isIOS,
    isInStandaloneMode,
    hasDeferredPrompt: !!deferredPrompt,
    isDev: import.meta.env.DEV
  });

  return {
    shouldShow,
    isInstalling,
    showManualInstructions,
    handleInstall,
    handleDismiss
  };
};
