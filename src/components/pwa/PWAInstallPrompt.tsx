
import React from 'react';
import { usePWAInstallPrompt } from '@/hooks/usePWAInstallPrompt';
import PWAInstallCard from './PWAInstallCard';
import PWAManualInstructions from './PWAManualInstructions';

const PWAInstallPrompt = () => {
  const {
    shouldShow,
    isInstalling,
    showManualInstructions,
    handleInstall,
    handleDismiss
  } = usePWAInstallPrompt();

  console.log('PWAInstallPrompt render:', {
    shouldShow,
    isInstalling,
    showManualInstructions,
    timestamp: new Date().toISOString()
  });

  if (!shouldShow) {
    console.log('PWAInstallPrompt: Not showing because shouldShow is false');
    return null;
  }

  console.log('PWAInstallPrompt: Rendering prompt');

  return (
    <>
      <PWAInstallCard
        isInstalling={isInstalling}
        showManualInstructions={showManualInstructions}
        onInstall={handleInstall}
        onDismiss={handleDismiss}
      />

      {/* Manual installation instructions for iOS */}
      {showManualInstructions && (
        <PWAManualInstructions onDismiss={handleDismiss} />
      )}
    </>
  );
};

export default PWAInstallPrompt;
