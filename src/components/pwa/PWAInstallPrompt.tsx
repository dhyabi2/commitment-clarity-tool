
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

  if (!shouldShow) {
    return null;
  }

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
