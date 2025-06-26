
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Check } from 'lucide-react';
import { usePWA } from '@/contexts/PWAContext';
import { useLanguage } from '@/lib/i18n/LanguageContext';

const InstallButton = () => {
  const { canInstall, isInstalled, showInstallDialog } = usePWA();
  const { t } = useLanguage();

  if (isInstalled) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="text-green-600 border-green-600 hover:bg-green-50"
        disabled
      >
        <Check className="h-4 w-4 mr-2" />
        {t('pwa.button.installed')}
      </Button>
    );
  }

  if (!canInstall) return null;

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={showInstallDialog}
      className="text-sage-600 border-sage-600 hover:bg-sage-50"
    >
      <Download className="h-4 w-4 mr-2" />
      {t('pwa.button.install')}
    </Button>
  );
};

export default InstallButton;
