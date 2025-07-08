
import React from 'react';
import PWAInstallCard from './PWAInstallCard';
import PWAManualInstructions from './PWAManualInstructions';

interface PWAInstallPromptProps {
  isVisible: boolean;
  isInstalling: boolean;
  showManualInstructions: boolean;
  onInstall: () => void;
  onDismiss: () => void;
}

const PWAInstallPrompt = ({ 
  isVisible, 
  isInstalling, 
  showManualInstructions, 
  onInstall, 
  onDismiss 
}: PWAInstallPromptProps) => {
  console.log('PWAInstallPrompt render:', {
    isVisible,
    isInstalling,
    showManualInstructions,
    timestamp: new Date().toISOString()
  });

  if (!isVisible) {
    console.log('PWAInstallPrompt: Not showing because isVisible is false');
    return null;
  }

  console.log('PWAInstallPrompt: Rendering popup');

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40" 
        onClick={onDismiss}
      />
      
      {/* Popup positioned in center */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <PWAInstallCard
          isInstalling={isInstalling}
          showManualInstructions={showManualInstructions}
          onInstall={onInstall}
          onDismiss={onDismiss}
        />
      </div>

      {/* Manual installation instructions for iOS */}
      {showManualInstructions && (
        <PWAManualInstructions onDismiss={onDismiss} />
      )}
    </>
  );
};

export default PWAInstallPrompt;
