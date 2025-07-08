
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
  const isInStandaloneMode = window.navigator.standalone;
  const showManualInstructions = isIOS && !isInStandaloneMode && !deferredPrompt;

  console.log('PWA Install Popup State:', {
    isPopupVisible,
    isInstallable,
    isInstalled,
    showManualInstructions,
    isIOS,
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
    // Expose install state for the icon
    isInstallable: isInstallable || import.meta.env.DEV,
    isInstalled
  };
};
