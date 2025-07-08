
import { useState, useEffect } from 'react';
import { detectPWAInstallation } from '@/utils/pwaDetection';
import { setPWAStateCookie, deletePWAStateCookie } from '@/utils/pwaState';
import { BeforeInstallPromptEvent } from '@/types/pwa';

export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false); // Session-based dismissal only

  // Set installation state with cookie persistence
  const markAsInstalled = () => {
    setIsInstalled(true);
    setIsInstallable(false);
    setDeferredPrompt(null);
    setPWAStateCookie('installed', 365); // 1 year
    console.log('PWA marked as installed with cookie persistence');
  };

  // Mark prompt as dismissed (session-based only, no cookies)
  const markAsDismissed = () => {
    setIsDismissed(true);
    console.log('PWA install prompt dismissed for this session');
  };

  useEffect(() => {
    // Initial detection
    const isCurrentlyInstalled = detectPWAInstallation();
    
    setIsInstalled(isCurrentlyInstalled);
    setIsDismissed(false); // Always reset dismissal on page load

    // If already installed, don't show installable state
    if (isCurrentlyInstalled) {
      markAsInstalled();
      return;
    }

    const beforeInstallHandler = (e: Event) => {
      const event = e as BeforeInstallPromptEvent;
      console.log('beforeinstallprompt event fired', {
        platforms: event.platforms,
        userAgent: navigator.userAgent
      });
      
      e.preventDefault();
      setDeferredPrompt(event);
      
      // Always show as installable when event fires (no dismissal check)
      setIsInstallable(true);
      console.log('PWA install prompt available');
    };

    const installedHandler = () => {
      markAsInstalled();
      console.log('PWA installed successfully');
    };

    // Enhanced detection for navigation changes
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        const isNowInstalled = detectPWAInstallation();
        if (isNowInstalled && !isInstalled) {
          markAsInstalled();
        }
      }
    };

    // Media query listener for display mode changes
    const standaloneQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = (e: MediaQueryListEvent) => {
      if (e.matches && !isInstalled) {
        markAsInstalled();
      }
    };

    // Event listeners
    window.addEventListener('beforeinstallprompt', beforeInstallHandler);
    window.addEventListener('appinstalled', installedHandler);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Modern browsers support addEventListener on MediaQueryList
    if (standaloneQuery.addEventListener) {
      standaloneQuery.addEventListener('change', handleDisplayModeChange);
    } else {
      // Fallback for older browsers
      standaloneQuery.addListener(handleDisplayModeChange);
    }

    // Development mode simulation with delay
    if (import.meta.env.DEV && !isCurrentlyInstalled) {
      const devTimer = setTimeout(() => {
        if (!deferredPrompt && !isCurrentlyInstalled) {
          console.log('Dev mode: Making PWA installable for testing');
          setIsInstallable(true);
        }
      }, 3000);

      return () => {
        clearTimeout(devTimer);
        window.removeEventListener('beforeinstallprompt', beforeInstallHandler);
        window.removeEventListener('appinstalled', installedHandler);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        
        if (standaloneQuery.removeEventListener) {
          standaloneQuery.removeEventListener('change', handleDisplayModeChange);
        } else {
          standaloneQuery.removeListener(handleDisplayModeChange);
        }
      };
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', beforeInstallHandler);
      window.removeEventListener('appinstalled', installedHandler);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      if (standaloneQuery.removeEventListener) {
        standaloneQuery.removeEventListener('change', handleDisplayModeChange);
      } else {
        standaloneQuery.removeListener(handleDisplayModeChange);
      }
    };
  }, [isInstalled]);

  const promptInstall = async (): Promise<boolean> => {
    console.log('promptInstall called', { 
      deferredPrompt: !!deferredPrompt,
      userAgent: navigator.userAgent 
    });
    
    if (!deferredPrompt) {
      console.log('No install prompt available');
      // For browsers that don't support beforeinstallprompt
      // Show manual installation instructions
      return false;
    }

    try {
      console.log('Showing install prompt...');
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      console.log('Install prompt result:', choiceResult.outcome, {
        platform: choiceResult.platform,
        timestamp: new Date().toISOString()
      });
      
      if (choiceResult.outcome === 'accepted') {
        markAsInstalled();
        return true;
      } else {
        // User cancelled - set cookie to remember they attempted install
        setPWAStateCookie('attempted', 7); // 1 week
        markAsDismissed();
        return false;
      }
    } catch (error) {
      console.error('Install prompt failed:', error);
      // Set cookie even on error to remember the attempt
      setPWAStateCookie('attempted', 7); // 1 week
      markAsDismissed();
      return false;
    }
  };

  const dismissPrompt = () => {
    markAsDismissed(); // Only session-based dismissal
    setIsInstallable(false);
  };

  // Debug function for development
  const resetPWAState = () => {
    if (import.meta.env.DEV) {
      deletePWAStateCookie();
      setIsInstalled(false);
      setIsInstallable(false);
      setIsDismissed(false);
      setDeferredPrompt(null);
      console.log('PWA state reset for development');
    }
  };

  return {
    isInstallable: isInstallable && !isInstalled && !isDismissed,
    isInstalled,
    isDismissed,
    promptInstall,
    dismissPrompt,
    deferredPrompt: !!deferredPrompt,
    resetPWAState: import.meta.env.DEV ? resetPWAState : undefined
  };
};
