
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, AlertTriangle, UserX } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useSubscription } from "@/hooks/useSubscription";
import { SubscriptionModal } from "../subscription/SubscriptionModal";

interface BrainDumpUpgradePromptProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BrainDumpUpgradePrompt: React.FC<BrainDumpUpgradePromptProps> = ({
  open,
  onOpenChange
}) => {
  const { t } = useLanguage();
  const { usage, maxFreeThoughts, isUnlimitedFree } = useSubscription();
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  // Don't show upgrade prompt if unlimited free usage is enabled
  if (!open || isUnlimitedFree) return null;

  const handleAnonymousAccess = () => {
    localStorage.setItem('anonymousMode', 'true');
    onOpenChange(false);
    // Refresh the page to apply anonymous mode
    window.location.reload();
  };

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
            You've used {usage}/{maxFreeThoughts} thoughts this month. Upgrade to Premium for unlimited thoughts or continue anonymously with local storage.
          </p>
          <div className="flex flex-col gap-3">
            <Button
              onClick={() => setShowSubscriptionModal(true)}
              className="w-full bg-sage-600 hover:bg-sage-700 text-white"
            >
              <Crown className="w-4 h-4 mr-2" />
              {t('subscription.upgradeNow')}
            </Button>
            <Button
              onClick={handleAnonymousAccess}
              variant="outline"
              className="w-full"
            >
              <UserX className="w-4 h-4 mr-2" />
              Continue Anonymously
            </Button>
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="w-full"
            >
              Maybe later
            </Button>
          </div>
        </CardContent>
      </Card>

      <SubscriptionModal
        open={showSubscriptionModal}
        onOpenChange={setShowSubscriptionModal}
      />
    </>
  );
};
