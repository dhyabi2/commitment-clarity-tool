
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
  const [installSource, setInstallSource] = useState<'browser' | 'ios' | 'android' | null>(null);

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

    const handler = (e: BeforeInstallPromptEvent) => {
      console.log('beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
      setInstallSource('browser');
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
      window.addEventListener('beforeinstallprompt', handler as EventListener);
      window.addEventListener('appinstalled', installedHandler);

      // Detect device type for manual installation instructions
      const userAgent = navigator.userAgent.toLowerCase();
      const isIOS = /ipad|iphone|ipod/.test(userAgent) && !(window as any).MSStream;
      const isAndroid = /android/.test(userAgent);
      const isSafari = /safari/.test(userAgent) && !/chrome/.test(userAgent);
      
      console.log('Device detection:', { isIOS, isAndroid, isSafari, userAgent });
      
      if (isIOS && isSafari && !isCurrentlyInstalled) {
        console.log('iOS Safari detected - showing manual install option');
        setInstallSource('ios');
        setIsInstallable(true);
      } else if (isAndroid && !isCurrentlyInstalled) {
        console.log('Android detected - will show manual install if no native prompt');
        setInstallSource('android');
        // We'll set installable to true after a delay if no native prompt appears
        setTimeout(() => {
          if (!deferredPrompt) {
            setIsInstallable(true);
          }
        }, 3000);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler as EventListener);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, [deferredPrompt]);

  const promptInstall = async () => {
    console.log('promptInstall called', { deferredPrompt, installSource });
    
    if (!deferredPrompt) {
      console.log('No install prompt available - showing manual instructions');
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

  const canInstall = () => {
    return isInstallable && !isInstalled;
  };

  return {
    isInstallable: canInstall(),
    isInstalled,
    installSource,
    promptInstall,
    canInstall,
    deferredPrompt: !!deferredPrompt
  };
};
