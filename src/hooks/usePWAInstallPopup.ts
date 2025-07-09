
import { useState } from 'react';
import { usePWAInstall } from './usePWAInstall';

export const usePWAInstallPopup = () => {
  const { 
    isInstallable, 
    isInstalled, 
    promptInstall, 
    deferredPrompt 
  } = usePWAInstall();
  
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  const showPopup = () => {
    if (!isInstalled && (isInstallable || import.meta.env.DEV)) {
      setIsPopupVisible(true);
      console.log('PWA install popup opened by user');
    }
  };

  const handleDirectInstall = async () => {
    // Detect platforms for logging
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    
    // If no deferred prompt is available (dev mode, iOS, or unsupported browsers), show popup
    if (!deferredPrompt) {
      setIsPopupVisible(true);
      console.log('PWA install popup opened - no deferred prompt available', {
        isIOS,
        isAndroid,
        isDev: import.meta.env.DEV,
        userAgent: navigator.userAgent
      });
      return;
    }

    // For devices with native install prompt, install directly
    if (!isInstalled && (isInstallable || import.meta.env.DEV)) {
      console.log('Direct install initiated from icon click', {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      });
      
      setIsInstalling(true);
      
      try {
        const success = await promptInstall();
        console.log('Direct install result:', success);
      } catch (error) {
        console.error('Direct install failed:', error);
      } finally {
        setIsInstalling(false);
      }
    }
  };

  const hidePopup = () => {
    setIsPopupVisible(false);
    console.log('PWA install popup closed');
  };

  const handleInstall = async () => {
    console.log('Install button clicked from popup', {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    });
    
    setIsInstalling(true);
    
    try {
      const success = await promptInstall();
      console.log('Install result:', success);
      
      // Always hide the popup after install attempt
      hidePopup();
    } catch (error) {
      console.error('Install failed:', error);
      hidePopup();
    } finally {
      setIsInstalling(false);
    }
  };

  // Detect if we should show manual installation instructions
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);
  const isInStandaloneMode = window.navigator.standalone;
  const showManualInstructions = (isIOS && !isInStandaloneMode && !deferredPrompt) || 
                                (isAndroid && !deferredPrompt && import.meta.env.DEV);

  console.log('PWA Install Popup State:', {
    isPopupVisible,
    isInstallable,
    isInstalled,
    showManualInstructions,
    isIOS,
    isAndroid,
    isInStandaloneMode,
    hasDeferredPrompt: !!deferredPrompt,
    isDev: import.meta.env.DEV
  });

  return {
    isPopupVisible,
    isInstalling,
    showManualInstructions,
    showPopup,
    hidePopup,
    handleInstall,
    handleDirectInstall,
    // Expose install state for the icon
    isInstallable: isInstallable || import.meta.env.DEV,
    isInstalled
  };
};
