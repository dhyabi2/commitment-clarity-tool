
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Crown, AlertTriangle } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";

export const UsageIndicator: React.FC = () => {
  const { usage, maxFreeThoughts, isPremium, isNearLimit, hasExceededLimit } = useSubscription();

  if (isPremium) {
    return (
      <Card className="bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200">
        <CardContent className="p-3">
          <div className="flex items-center gap-2">
            <Crown className="h-4 w-4 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-800">Premium Active</span>
            <span className="text-xs text-yellow-600">Unlimited thoughts</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const percentage = Math.min((usage / maxFreeThoughts) * 100, 100);
  const isWarning = isNearLimit || hasExceededLimit;

  return (
    <Card className={`${isWarning ? 'bg-red-50 border-red-200' : 'bg-sage-50 border-sage-200'}`}>
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {isWarning && <AlertTriangle className="h-4 w-4 text-red-500" />}
            <span className={`text-sm font-medium ${isWarning ? 'text-red-800' : 'text-sage-800'}`}>
              {usage}/{maxFreeThoughts} thoughts used
            </span>
          </div>
          <span className={`text-xs ${isWarning ? 'text-red-600' : 'text-sage-600'}`}>
            Free plan
          </span>
        </div>
        <Progress 
          value={percentage} 
          className={`h-2 ${isWarning ? '[&>div]:bg-red-500' : '[&>div]:bg-sage-500'}`}
        />
        {hasExceededLimit && (
          <p className="text-xs text-red-600 mt-2">
            Limit reached! Upgrade to continue adding thoughts.
          </p>
        )}
      </CardContent>
    </Card>
  );
};
