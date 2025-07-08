
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Smartphone } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PWAInstallIconProps {
  onInstallClick: () => void;
}

const PWAInstallIcon = ({ onInstallClick }: PWAInstallIconProps) => {
  const { t } = useLanguage();

  // Detect if we should show mobile icon (for iOS manual instructions)
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isInStandaloneMode = window.navigator.standalone;
  const showMobileIcon = isIOS && !isInStandaloneMode;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          onClick={onInstallClick}
          className="flex items-center gap-2 px-3 py-2 h-auto bg-sage-50 hover:bg-sage-100 border border-sage-200 rounded-full transition-all duration-200 text-sage-700 hover:text-sage-800"
        >
           {showMobileIcon ? (
             <Smartphone className="h-4 w-4 animate-pulse hover:animate-bounce" />
           ) : (
             <Download className="h-4 w-4 animate-pulse hover:animate-bounce" />
           )}
          <span className="text-sm font-medium hidden sm:inline">
            {t('pwa.install.button')}
          </span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{t('pwa.install.title')}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default PWAInstallIcon;
