
import { useState, useEffect } from 'react';

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
    const handler = (e: BeforeInstallPromptEvent) => {
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
      
      // Track installation
      if (typeof gtag !== 'undefined') {
        gtag('event', 'pwa_install', {
          event_category: 'engagement',
          event_label: 'success'
        });
      }
    };

    window.addEventListener('beforeinstallprompt', handler as EventListener);
    window.addEventListener('appinstalled', installedHandler);

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      console.log('PWA is running in standalone mode');
    }

    // Detect iOS devices
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    
    if (isIOS && !isInstalled) {
      setInstallSource('ios');
      setIsInstallable(true);
    } else if (isAndroid && !isInstalled && !deferredPrompt) {
      setInstallSource('android');
      setIsInstallable(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler as EventListener);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, [isInstalled, deferredPrompt]);

  const promptInstall = async () => {
    if (!deferredPrompt) {
      console.log('No install prompt available');
      return false;
    }

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      console.log('Install prompt result:', choiceResult.outcome);
      
      if (choiceResult.outcome === 'accepted') {
        setDeferredPrompt(null);
        setIsInstallable(false);
        
        // Track successful prompt acceptance
        if (typeof gtag !== 'undefined') {
          gtag('event', 'pwa_install_prompt_accepted', {
            event_category: 'engagement'
          });
        }
        
        return true;
      } else {
        // Track prompt dismissal
        if (typeof gtag !== 'undefined') {
          gtag('event', 'pwa_install_prompt_dismissed', {
            event_category: 'engagement'
          });
        }
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
    canInstall
  };
};
