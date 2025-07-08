
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Download, Zap, Smartphone } from 'lucide-react';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { useLanguage } from '@/lib/i18n/LanguageContext';

const PWAInstallPrompt = () => {
  const { t } = useLanguage();
  const { 
    isInstallable, 
    isInstalled, 
    isDismissed,
    promptInstall, 
    dismissPrompt,
    deferredPrompt,
    resetPWAState 
  } = usePWAInstall();
  
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  // Show prompt with delay if installable and not dismissed
  useEffect(() => {
    if (isInstallable && !isInstalled && !isDismissed) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        console.log('Showing PWA install prompt', {
          isInstallable,
          isInstalled,
          isDismissed,
          hasDeferredPrompt: deferredPrompt,
          timestamp: new Date().toISOString()
        });
      }, 2000); // Reduced delay for better UX

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isInstallable, isInstalled, isDismissed, deferredPrompt]);

  // Don't render if already installed
  if (isInstalled) {
    console.log('PWA already installed, not showing prompt');
    return null;
  }

  // Don't render if dismissed recently
  if (isDismissed && !import.meta.env.DEV) {
    console.log('PWA prompt dismissed recently, not showing');
    return null;
  }

  const handleInstall = async () => {
    console.log('Install button clicked', {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    });
    
    setIsInstalling(true);
    
    try {
      const success = await promptInstall();
      console.log('Install result:', success);
      
      if (success) {
        setIsVisible(false);
      } else {
        // Installation failed or was cancelled
        setIsVisible(false);
      }
    } catch (error) {
      console.error('Install failed:', error);
      setIsVisible(false);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleDismiss = () => {
    dismissPrompt();
    setIsVisible(false);
    console.log('PWA prompt dismissed by user');
  };

  // Show in development mode for testing, or if conditions are met
  const shouldShow = isVisible && (isInstallable || (import.meta.env.DEV && !isInstalled));

  if (!shouldShow) {
    return null;
  }

  // Detect if we should show manual installation instructions
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isInStandaloneMode = window.navigator.standalone;
  const showManualInstructions = isIOS && !isInStandaloneMode && !deferredPrompt;

  return (
    <>
      <Card className="fixed bottom-4 left-4 right-4 md:right-auto md:max-w-sm bg-white shadow-xl border border-sage-200 z-50 animate-in slide-in-from-bottom-2 backdrop-blur-sm">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-sage-100 p-3 rounded-lg">
                {showManualInstructions ? (
                  <Smartphone className="h-6 w-6 text-sage-600" />
                ) : (
                  <Download className="h-6 w-6 text-sage-600" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-lg text-sage-800">
                  {t('pwa.install.title')}
                </h3>
                <p className="text-sm text-gray-600">
                  {t('pwa.install.subtitle')}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-8 w-8 p-0 hover:bg-gray-100 flex-shrink-0"
              aria-label="Close install prompt"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Benefits section for better conversion */}
          <div className="mb-4 text-sm text-gray-600">
            <ul className="space-y-1">
              <li>• {t('pwa.benefits.offline.desc')}</li>
              <li>• {t('pwa.benefits.fast.desc')}</li>
              <li>• {t('pwa.benefits.native.desc')}</li>
            </ul>
          </div>

          <Button
            onClick={handleInstall}
            disabled={isInstalling}
            className="w-full h-12 text-base bg-sage-500 hover:bg-sage-600 text-white disabled:opacity-50 transition-all duration-200"
          >
            {isInstalling ? (
              <>
                <Zap className="h-5 w-5 mr-2 animate-pulse" />
                {t('pwa.install.installing')}
              </>
            ) : showManualInstructions ? (
              <>
                <Smartphone className="h-5 w-5 mr-2" />
                {t('pwa.actionPlan.title')}
              </>
            ) : (
              <>
                <Download className="h-5 w-5 mr-2" />
                {t('pwa.install.button')}
              </>
            )}
          </Button>

          {/* Development reset button */}
          {import.meta.env.DEV && resetPWAState && (
            <Button
              onClick={resetPWAState}
              variant="outline"
              size="sm"
              className="w-full mt-2 text-xs"
            >
              Reset PWA State (Dev Only)
            </Button>
          )}
        </div>
      </Card>

      {/* Manual installation instructions for iOS */}
      {showManualInstructions && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-white">
            <div className="p-6">
              <h3 className="font-semibold text-lg mb-4">{t('pwa.ios.title')}</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <span className="bg-sage-100 text-sage-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold flex-shrink-0">1</span>
                  <div>
                    <p className="font-medium">{t('pwa.ios.step2.title')}</p>
                    <p className="text-gray-600">{t('pwa.ios.step2.desc')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-sage-100 text-sage-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold flex-shrink-0">2</span>
                  <div>
                    <p className="font-medium">{t('pwa.ios.step3.title')}</p>
                    <p className="text-gray-600">{t('pwa.ios.step3.desc')}</p>
                  </div>
                </div>
              </div>
              <Button
                onClick={handleDismiss}
                className="w-full mt-4"
                variant="outline"
              >
                {t('pwa.actionPlan.gotIt')}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

export default PWAInstallPrompt;
