
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

export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const checkIfInstalled = () => {
      // Check if running in standalone mode
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
        console.log('PWA is running in standalone mode');
        return true;
      }
      
      // Check if running as PWA on iOS Safari
      if (window.navigator.standalone === true) {
        setIsInstalled(true);
        console.log('PWA is running in iOS standalone mode');
        return true;
      }
      
      return false;
    };

    const isCurrentlyInstalled = checkIfInstalled();

    const handler = (e: Event) => {
      const event = e as BeforeInstallPromptEvent;
      console.log('beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(event);
      setIsInstallable(true);
      console.log('PWA install prompt available');
    };

    const installedHandler = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      console.log('PWA installed successfully');
    };

    // Only set up event listeners if not already installed
    if (!isCurrentlyInstalled) {
      window.addEventListener('beforeinstallprompt', handler);
      window.addEventListener('appinstalled', installedHandler);
      
      // For development/testing - show install option after delay
      if (import.meta.env.DEV) {
        setTimeout(() => {
          if (!deferredPrompt && !isCurrentlyInstalled) {
            console.log('Dev mode: Making PWA installable for testing');
            setIsInstallable(true);
          }
        }, 2000);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, []);

  const promptInstall = async () => {
    console.log('promptInstall called', { deferredPrompt });
    
    if (!deferredPrompt) {
      console.log('No install prompt available');
      return false;
    }

    try {
      console.log('Showing install prompt...');
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      console.log('Install prompt result:', choiceResult.outcome);
      
      if (choiceResult.outcome === 'accepted') {
        setDeferredPrompt(null);
        setIsInstallable(false);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Install prompt failed:', error);
      return false;
    }
  };

  return {
    isInstallable,
    isInstalled,
    promptInstall,
    deferredPrompt: !!deferredPrompt
  };
};
