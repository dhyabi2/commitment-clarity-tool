
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Check, Loader2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useSubscription } from "@/hooks/useSubscription";

interface SubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  open,
  onOpenChange
}) => {
  const { t } = useLanguage();
  const { createSubscription, isCreatingSubscription, priceOMR, durationDays } = useSubscription();

  const handleUpgrade = () => {
    createSubscription();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            {t('subscription.title')}
          </DialogTitle>
          <DialogDescription>
            {t('subscription.description')}
          </DialogDescription>
        </DialogHeader>
        
        <Card className="border-2 border-sage-200">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              {t('subscription.premiumPlan')}
            </CardTitle>
            <div className="text-3xl font-bold text-sage-700">
              {priceOMR} OMR
              <span className="text-sm font-normal text-sage-600">
                /{t('subscription.per')} {durationDays} {t('subscription.days')}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">{t('subscription.unlimitedThoughts')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">{t('subscription.allFeatures')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">{t('subscription.prioritySupport')}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
                disabled={isCreatingSubscription}
              >
                {t('subscription.maybeLater')}
              </Button>
              <Button
                onClick={handleUpgrade}
                disabled={isCreatingSubscription}
                className="flex-1 bg-sage-600 hover:bg-sage-700"
              >
                {isCreatingSubscription ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t('subscription.processing')}
                  </>
                ) : (
                  <>
                    <Crown className="w-4 h-4 mr-2" />
                    {t('subscription.upgradeNow')}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};
