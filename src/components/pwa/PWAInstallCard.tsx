
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Download, Zap, Smartphone } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface PWAInstallCardProps {
  isInstalling: boolean;
  showManualInstructions: boolean;
  onInstall: () => void;
  onDismiss: () => void;
}

const PWAInstallCard = ({ 
  isInstalling, 
  showManualInstructions, 
  onInstall, 
  onDismiss 
}: PWAInstallCardProps) => {
  const { t } = useLanguage();

  return (
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
            onClick={onDismiss}
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
          onClick={onInstall}
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
      </div>
    </Card>
  );
};

export default PWAInstallCard;
