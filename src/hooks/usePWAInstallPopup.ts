
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
    console.log('🚀 Install button clicked from popup', {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      hasDeferredPrompt: !!deferredPrompt,
      isInstallable,
      showManualInstructions
    });
    
    // If showing manual instructions, try alternative installation methods
    if (showManualInstructions) {
      console.log('📱 Manual installation needed - trying alternative methods');
      
      // For Android: try to trigger browser's install dialog
      if (isAndroid) {
        console.log('🤖 Android: Attempting to trigger install via browser');
        
        // Try to prompt user about browser menu
        alert(`To install this app:
1. Tap the Chrome menu (⋮)
2. Select "Install app" or "Add to Home screen"
3. Confirm installation

If you don't see an install option, this app may already be installed or your browser doesn't support PWA installation.`);
        
        // Don't hide popup - let user try again
        return;
      }
      
      // For iOS: instructions are already shown
      if (isIOS) {
        console.log('🍎 iOS: Manual installation instructions displayed');
        return;
      }
      
      // For other platforms
      console.log('🖥️ Desktop: Manual installation instructions displayed');
      return;
    }
    
    setIsInstalling(true);
    
    try {
      const success = await promptInstall();
      console.log('✅ Install result:', success);
      
      if (success) {
        hidePopup();
      } else {
        console.log('❌ Install was not successful - keeping popup open');
      }
    } catch (error) {
      console.error('💥 Install failed:', error);
      // Don't hide popup on error - let user try again
    } finally {
      setIsInstalling(false);
    }
  };

  // Detect if we should show manual installation instructions
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);
  const isInStandaloneMode = window.navigator.standalone;
  const showManualInstructions = (isIOS && !isInStandaloneMode && !deferredPrompt) || 
                                (isAndroid && !deferredPrompt && !isInstalled);

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
