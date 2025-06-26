
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

const SubscriptionCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-cream p-4 flex items-center justify-center">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-xl">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-xl font-semibold text-sage-600 mb-2">
            Subscription Cancelled
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-sage-600">
            Your subscription process was cancelled. No charges have been made to your account.
          </p>
          
          <p className="text-sm text-sage-500">
            You can still use our free plan with up to 20 thoughts per month.
          </p>

          <div className="space-y-2">
            <Button
              onClick={() => navigate('/')}
              className="w-full bg-sage-600 hover:bg-sage-700 text-white"
            >
              Continue with Free Plan
            </Button>
            <Button
              onClick={() => window.history.back()}
              variant="outline"
              className="w-full"
            >
              Try Upgrading Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionCancel;
