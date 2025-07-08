
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface PWAManualInstructionsProps {
  onDismiss: () => void;
}

const PWAManualInstructions = ({ onDismiss }: PWAManualInstructionsProps) => {
  const { t } = useLanguage();

  return (
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
            onClick={onDismiss}
            className="w-full mt-4"
            variant="outline"
          >
            {t('pwa.actionPlan.gotIt')}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default PWAManualInstructions;
