
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';
import { usePWA } from '@/contexts/PWAContext';
import { useLanguage } from '@/lib/i18n/LanguageContext';

const InstallBanner = () => {
  const { canInstall, isInstalled, showInstallDialog, dismissInstallPrompt } = usePWA();
  const { t, dir } = useLanguage();
  const isRTL = dir() === 'rtl';

  // Don't show if already installed or can't install
  if (isInstalled || !canInstall) return null;

  // Check if user has dismissed the banner recently (within 7 days)
  const dismissedTime = localStorage.getItem('pwa-install-prompt-dismissed');
  if (dismissedTime) {
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    if (parseInt(dismissedTime) > sevenDaysAgo) {
      return null;
    }
  }

  return (
    <div className={`bg-gradient-to-r from-sage-500 to-sage-600 text-white py-3 px-4 flex items-center justify-between shadow-lg animate-slide-down ${isRTL ? 'flex-row-reverse' : ''}`}>
      <div className={`flex items-center gap-3 flex-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className="bg-white/20 p-1.5 rounded-lg">
          <Download className="h-4 w-4" />
        </div>
        <div className="text-sm">
          <p className="font-medium">{t('pwa.banner.title')}</p>
          <p className="text-white/90 text-xs">{t('pwa.banner.subtitle')}</p>
        </div>
      </div>
      
      <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Button
          size="sm"
          onClick={showInstallDialog}
          className="bg-white text-sage-600 hover:bg-white/90 font-medium px-4 py-1.5 text-xs"
        >
          {t('pwa.banner.install')}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={dismissInstallPrompt}
          className="text-white hover:bg-white/20 p-1"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default InstallBanner;
