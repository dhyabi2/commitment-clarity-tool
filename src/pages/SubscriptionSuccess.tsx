
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Crown } from "lucide-react";
import { useQueryClient } from '@tanstack/react-query';

const SubscriptionSuccess = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Invalidate subscription queries to refresh the data
    queryClient.invalidateQueries({ queryKey: ['subscription'] });
    queryClient.invalidateQueries({ queryKey: ['usage'] });
  }, [queryClient]);

  return (
    <div className="min-h-screen bg-cream p-4 flex items-center justify-center">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-xl">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-xl font-semibold text-sage-600 mb-2 flex items-center justify-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            Welcome to Premium!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-sage-600">
            Your subscription has been activated successfully. You now have unlimited access to create thoughts.
          </p>
          
          <div className="bg-sage-50 p-4 rounded-lg">
            <h3 className="font-medium text-sage-800 mb-2">What's included:</h3>
            <ul className="text-sm text-sage-600 space-y-1">
              <li>✓ Unlimited thoughts</li>
              <li>✓ All existing features</li>
              <li>✓ Priority support</li>
            </ul>
          </div>

          <Button
            onClick={() => navigate('/')}
            className="w-full bg-sage-600 hover:bg-sage-700 text-white"
          >
            Start Creating Thoughts
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionSuccess;
