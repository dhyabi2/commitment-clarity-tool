
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Download, Smartphone, Monitor, Zap } from 'lucide-react';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import PWAActionPlan from './PWAActionPlan';

const PWAInstallPrompt = () => {
  const { t } = useLanguage();
  const { isInstallable, isInstalled, installSource, promptInstall } = usePWAInstall();
  const [isVisible, setIsVisible] = useState(false);
  const [showActionPlan, setShowActionPlan] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  // Show prompt after a short delay if installable
  useEffect(() => {
    if (isInstallable && !isInstalled) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000); // Show after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [isInstallable, isInstalled]);

  // Don't show if already installed or not installable
  if (!isInstallable || isInstalled || !isVisible) {
    return null;
  }

  const handleInstall = async () => {
    setIsInstalling(true);
    
    try {
      const success = await promptInstall();
      if (success) {
        setIsVisible(false);
      } else {
        // If native prompt fails or is dismissed, show action plan
        setShowActionPlan(true);
      }
    } catch (error) {
      console.error('Install failed:', error);
      setShowActionPlan(true);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleShowActionPlan = () => {
    setShowActionPlan(true);
  };

  const getInstallButtonText = () => {
    if (isInstalling) return t('pwa.install.installing') || 'Installing...';
    if (installSource === 'browser') return t('pwa.install.button') || 'Install Now';
    return t('pwa.install.howTo') || 'How to Install';
  };

  const getInstallIcon = () => {
    if (isInstalling) return Zap;
    if (installSource === 'browser') return Download;
    return installSource === 'ios' ? Smartphone : Monitor;
  };

  const InstallIcon = getInstallIcon();

  return (
    <>
      <Card className="fixed bottom-4 left-4 right-4 md:right-auto md:max-w-sm bg-white shadow-lg border border-sage-200 z-50 animate-in slide-in-from-bottom-2">
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="bg-sage-100 p-2 rounded-lg">
                <Download className="h-5 w-5 text-sage-600" />
              </div>
              <div>
                <h3 className="font-semibold text-sage-800">
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
              className="h-6 w-6 p-0 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            {installSource === 'browser' ? (
              <Button
                onClick={handleInstall}
                disabled={isInstalling}
                className="w-full bg-sage-500 hover:bg-sage-600 text-white disabled:opacity-50"
              >
                <InstallIcon className={`h-4 w-4 mr-2 ${isInstalling ? 'animate-pulse' : ''}`} />
                {getInstallButtonText()}
              </Button>
            ) : (
              <Button
                onClick={handleShowActionPlan}
                className="w-full bg-sage-500 hover:bg-sage-600 text-white"
              >
                <InstallIcon className="h-4 w-4 mr-2" />
                {getInstallButtonText()}
              </Button>
            )}
            
            <Button
              variant="outline"
              onClick={handleShowActionPlan}
              className="w-full text-sage-600 border-sage-200 hover:bg-sage-50"
            >
              <Monitor className="h-4 w-4 mr-2" />
              {t('pwa.install.howTo') || 'How to Install'}
            </Button>
          </div>

          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Smartphone className="h-3 w-3" />
              <span>{t('pwa.features.mobile') || 'Mobile Ready'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              <span>{t('pwa.features.offline') || 'Works Offline'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              <span>{t('pwa.features.fast') || 'Lightning Fast'}</span>
            </div>
          </div>
        </div>
      </Card>

      <PWAActionPlan 
        isOpen={showActionPlan}
        onClose={() => setShowActionPlan(false)}
      />
    </>
  );
};

export default PWAInstallPrompt;
