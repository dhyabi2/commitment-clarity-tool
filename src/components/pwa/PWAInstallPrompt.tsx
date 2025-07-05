
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Download, Zap } from 'lucide-react';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { useLanguage } from '@/lib/i18n/LanguageContext';

const PWAInstallPrompt = () => {
  const { t } = useLanguage();
  const { isInstallable, isInstalled, promptInstall, deferredPrompt } = usePWAInstall();
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  // Show prompt after a short delay if installable
  useEffect(() => {
    if (isInstallable && !isInstalled) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        console.log('Showing PWA install prompt');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isInstallable, isInstalled]);

  // Don't show if already installed
  if (isInstalled) {
    return null;
  }

  // Don't show if not installable and not visible
  if (!isInstallable && !isVisible) {
    return null;
  }

  const handleInstall = async () => {
    console.log('Install button clicked');
    setIsInstalling(true);
    
    try {
      const success = await promptInstall();
      console.log('Install result:', success);
      if (success) {
        setIsVisible(false);
      }
    } catch (error) {
      console.error('Install failed:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  const shouldShow = isVisible || (import.meta.env.DEV && isInstallable);

  if (!shouldShow) {
    return null;
  }

  return (
    <Card className="fixed bottom-4 left-4 right-4 md:right-auto md:max-w-sm bg-white shadow-lg border border-sage-200 z-50 animate-in slide-in-from-bottom-2">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-sage-100 p-3 rounded-lg">
              <Download className="h-6 w-6 text-sage-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-sage-800">
                {t('pwa.install.title') || 'Install App'}
              </h3>
              <p className="text-sm text-gray-600">
                {t('pwa.install.subtitle') || 'Access offline & faster loading'}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="h-8 w-8 p-0 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <Button
          onClick={handleInstall}
          disabled={isInstalling}
          className="w-full h-14 text-lg bg-sage-500 hover:bg-sage-600 text-white disabled:opacity-50"
        >
          {isInstalling ? (
            <>
              <Zap className="h-6 w-6 mr-3 animate-pulse" />
              {t('pwa.install.installing') || 'Installing...'}
            </>
          ) : (
            <>
              <Download className="h-6 w-6 mr-3" />
              {t('pwa.install.button') || 'Install Now'}
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};

export default PWAInstallPrompt;
