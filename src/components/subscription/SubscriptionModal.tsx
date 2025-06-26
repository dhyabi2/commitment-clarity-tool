
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Crown, Loader2 } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface SubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  open,
  onOpenChange,
}) => {
  const { createSubscription, isCreatingSubscription, usage, priceOMR, durationDays, isLoading } = useSubscription();
  const { t } = useLanguage();

  const handleUpgrade = () => {
    createSubscription();
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            {t('subscription.title')}
          </DialogTitle>
          <DialogDescription>
            {t('subscription.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Card className="border-sage-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center justify-between">
                {t('subscription.premiumPlan')}
                <span className="text-2xl font-bold">{priceOMR} OMR</span>
              </CardTitle>
              <CardDescription>{t('subscription.per')} {durationDays} {t('subscription.days')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
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
            </CardContent>
          </Card>

          <div className="bg-sage-50 p-4 rounded-lg">
            <p className="text-sm text-sage-600 text-center">
              {t('subscription.currentUsage')}: <strong>{usage}/20</strong> {t('subscription.thoughts')}
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
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
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('subscription.processing')}
                </>
              ) : (
                t('subscription.upgradeNow')
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
