
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, AlertTriangle } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useSubscription } from "@/hooks/useSubscription";
import { SubscriptionModal } from "../subscription/SubscriptionModal";

export const BrainDumpUpgradePrompt: React.FC = () => {
  const { t } = useLanguage();
  const { usage, maxFreeThoughts } = useSubscription();
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  return (
    <>
      <Card className="bg-red-50 border-red-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-red-800">
            <AlertTriangle className="h-5 w-5" />
            {t('subscription.limitReached')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-red-700">
            You've used {usage}/{maxFreeThoughts} thoughts this month. Upgrade to Premium for unlimited thoughts and continue capturing your ideas.
          </p>
          <Button
            onClick={() => setShowSubscriptionModal(true)}
            className="w-full bg-sage-600 hover:bg-sage-700 text-white"
          >
            <Crown className="w-4 h-4 mr-2" />
            {t('subscription.upgradeNow')}
          </Button>
        </CardContent>
      </Card>

      <SubscriptionModal
        open={showSubscriptionModal}
        onOpenChange={setShowSubscriptionModal}
      />
    </>
  );
};
