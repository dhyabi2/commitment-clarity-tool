
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Download, Smartphone, Zap } from 'lucide-react';
import { usePWA } from '@/contexts/PWAContext';
import { useLanguage } from '@/lib/i18n/LanguageContext';

const InstallPrompt = () => {
  const { installApp, dismissInstallPrompt, showInstallPrompt } = usePWA();
  const { t, dir } = useLanguage();
  const isRTL = dir() === 'rtl';

  if (!showInstallPrompt) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-white shadow-2xl border-0 overflow-hidden animate-scale-in">
        {/* Header with close button */}
        <div className={`flex items-center justify-between p-4 bg-gradient-to-r from-sage-500 to-sage-600 text-white ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Smartphone className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-lg">
              {t('pwa.install.title')}
            </h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={dismissInstallPrompt}
            className="text-white hover:bg-white/20 p-1"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="text-center space-y-2">
            <div className="bg-sage-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
              <Download className="h-8 w-8 text-sage-600" />
            </div>
            <p className="text-gray-600 leading-relaxed">
              {t('pwa.install.description')}
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Zap className="h-4 w-4 text-sage-500 flex-shrink-0" />
              <span>{t('pwa.install.benefit1')}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Smartphone className="h-4 w-4 text-sage-500 flex-shrink-0" />
              <span>{t('pwa.install.benefit2')}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Download className="h-4 w-4 text-sage-500 flex-shrink-0" />
              <span>{t('pwa.install.benefit3')}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={installApp}
              className="flex-1 bg-sage-500 hover:bg-sage-600 text-white font-medium py-3"
            >
              <Download className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t('pwa.install.button')}
            </Button>
            <Button
              variant="outline"
              onClick={dismissInstallPrompt}
              className="px-6 text-gray-600 hover:text-gray-800"
            >
              {t('pwa.install.later')}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default InstallPrompt;
