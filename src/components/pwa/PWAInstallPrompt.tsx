
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Download, Smartphone, Monitor } from 'lucide-react';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import PWAActionPlan from './PWAActionPlan';

const PWAInstallPrompt = () => {
  const { t } = useLanguage();
  const { isInstallable, isInstalled, promptInstall } = usePWAInstall();
  const [isVisible, setIsVisible] = useState(true);
  const [showActionPlan, setShowActionPlan] = useState(false);

  // Don't show if already installed or not installable
  if (!isInstallable || isInstalled || !isVisible) {
    return null;
  }

  const handleInstall = async () => {
    const success = await promptInstall();
    if (!success) {
      // If native prompt fails, show action plan
      setShowActionPlan(true);
    }
  };

  const handleShowActionPlan = () => {
    setShowActionPlan(true);
  };

  return (
    <>
      <Card className="fixed bottom-4 left-4 right-4 md:right-auto md:max-w-sm bg-white shadow-lg border border-sage-200 z-50">
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
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <Button
              onClick={handleInstall}
              className="w-full bg-sage-500 hover:bg-sage-600 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              {t('pwa.install.button') || 'Install Now'}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleShowActionPlan}
              className="w-full text-sage-600 border-sage-200"
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
