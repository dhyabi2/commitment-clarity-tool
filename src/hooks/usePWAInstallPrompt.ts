
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

  // Show in development mode for testing, or if conditions are met
  const shouldShow = isVisible && (isInstallable || (import.meta.env.DEV && !isInstalled));

  // Don't render if already installed
  if (isInstalled) {
    console.log('PWA already installed, not showing prompt');
    return { shouldShow: false };
  }

  // Don't render if dismissed for this session (but will show again on page reload)
  if (isDismissed) {
    console.log('PWA prompt dismissed for this session');
    return { shouldShow: false };
  }

  // Detect if we should show manual installation instructions
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isInStandaloneMode = window.navigator.standalone;
  const showManualInstructions = isIOS && !isInStandaloneMode && !deferredPrompt;

  return {
    shouldShow,
    isInstalling,
    showManualInstructions,
    handleInstall,
    handleDismiss
  };
};
