
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

interface SubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  open,
  onOpenChange,
}) => {
  const { createSubscription, isCreatingSubscription, usage, priceOMR, durationDays, isLoading } = useSubscription();

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
            Upgrade to Premium
          </DialogTitle>
          <DialogDescription>
            You've reached your monthly limit of 20 thoughts. Upgrade to continue capturing your ideas.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Card className="border-sage-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center justify-between">
                Premium Plan
                <span className="text-2xl font-bold">{priceOMR} OMR</span>
              </CardTitle>
              <CardDescription>per {durationDays} days</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Unlimited thoughts</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">All existing features</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Priority support</span>
              </div>
            </CardContent>
          </Card>

          <div className="bg-sage-50 p-4 rounded-lg">
            <p className="text-sm text-sage-600 text-center">
              Current usage: <strong>{usage}/20</strong> thoughts this month
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Maybe Later
            </Button>
            <Button
              onClick={handleUpgrade}
              disabled={isCreatingSubscription}
              className="flex-1 bg-sage-600 hover:bg-sage-700"
            >
              {isCreatingSubscription ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Upgrade Now'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
