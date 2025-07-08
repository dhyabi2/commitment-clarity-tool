
import { getPWAStateCookie } from './pwaState';

// Comprehensive PWA installation detection
export const detectPWAInstallation = (): boolean => {
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

  // Method 6: Check cookie state for previous installations
  const cookieState = getPWAStateCookie();
  if (cookieState === 'installed') {
    console.log('PWA detected: Cookie indicates previous installation');
    return true;
  }

  return false;
};

export const isIOSDevice = (): boolean => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

export const isInIOSStandaloneMode = (): boolean => {
  return window.navigator.standalone === true;
};
