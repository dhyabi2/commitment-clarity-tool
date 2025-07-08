
import { useState, useEffect } from 'react';

// Extend Navigator interface to include iOS-specific properties
declare global {
  interface Navigator {
    standalone?: boolean;
  }
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// Cookie utilities for PWA state persistence
const PWA_COOKIE_NAME = 'pwa_install_state';
const PWA_DISMISSED_COOKIE = 'pwa_dismissed';

const setCookie = (name: string, value: string, days: number = 30) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
};

const getCookie = (name: string): string | null => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

const deleteCookie = (name: string) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
};

export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Comprehensive PWA installation detection
  const detectPWAInstallation = (): boolean => {
    // Method 1: Check display mode (most reliable for installed PWAs)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('PWA detected: Running in standalone mode');
      return true;
    }

    // Method 2: iOS Safari standalone mode
    if (window.navigator.standalone === true) {
      console.log('PWA detected: iOS standalone mode');
      return true;
    }

    // Method 3: Check for PWA-specific CSS media queries
    if (window.matchMedia('(display-mode: minimal-ui)').matches ||
        window.matchMedia('(display-mode: window-controls-overlay)').matches) {
      console.log('PWA detected: Enhanced display mode');
      return true;
    }

    // Method 4: Check document referrer for PWA launches
    if (document.referrer.startsWith('android-app://')) {
      console.log('PWA detected: Android app referrer');
      return true;
    }

    // Method 5: Check for installation-specific URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('utm_source') === 'pwa' || urlParams.get('source') === 'pwa') {
      console.log('PWA detected: Installation URL parameters');
      return true;
    }

    // Method 6: Check cookie state
    const cookieState = getCookie(PWA_COOKIE_NAME);
    if (cookieState === 'installed') {
      console.log('PWA detected: Cookie indicates installation');
      return true;
    }

    return false;
  };

  // Check if user has dismissed the install prompt
  const checkDismissalState = (): boolean => {
    const dismissed = getCookie(PWA_DISMISSED_COOKIE);
    return dismissed === 'true';
  };

  // Set installation state with cookie persistence
  const markAsInstalled = () => {
    setIsInstalled(true);
    setIsInstallable(false);
    setDeferredPrompt(null);
    setCookie(PWA_COOKIE_NAME, 'installed', 365); // 1 year
    deleteCookie(PWA_DISMISSED_COOKIE); // Clear dismissal state
    console.log('PWA marked as installed with cookie persistence');
  };

  // Mark prompt as dismissed
  const markAsDismissed = () => {
    setIsDismissed(true);
    setCookie(PWA_DISMISSED_COOKIE, 'true', 7); // 1 week
    console.log('PWA install prompt dismissed');
  };

  useEffect(() => {
    // Initial detection
    const isCurrentlyInstalled = detectPWAInstallation();
    const isCurrentlyDismissed = checkDismissalState();
    
    setIsInstalled(isCurrentlyInstalled);
    setIsDismissed(isCurrentlyDismissed);

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
      
      // Only show as installable if not dismissed recently
      if (!isCurrentlyDismissed) {
        setIsInstallable(true);
        console.log('PWA install prompt available');
      }
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
    if (import.meta.env.DEV && !isCurrentlyInstalled && !isCurrentlyDismissed) {
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
  }, [isInstalled, isDismissed]);

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
        markAsDismissed();
        return false;
      }
    } catch (error) {
      console.error('Install prompt failed:', error);
      markAsDismissed();
      return false;
    }
  };

  const dismissPrompt = () => {
    markAsDismissed();
    setIsInstallable(false);
  };

  // Debug function for development
  const resetPWAState = () => {
    if (import.meta.env.DEV) {
      deleteCookie(PWA_COOKIE_NAME);
      deleteCookie(PWA_DISMISSED_COOKIE);
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
