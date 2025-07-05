import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { supabase } from '@/lib/supabase';
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useAuth } from '@/contexts/AuthContext';
import { useAnonymousMode } from '@/hooks/useAnonymousMode';
import SignInModal from './auth/SignInModal';
import { getDeviceId } from '@/utils/deviceId';

const CommitmentClarifier = () => {
  const [step, setStep] = useState(1);
  const [outcome, setOutcome] = useState("");
  const [nextAction, setNextAction] = useState("");
  const [showSignInModal, setShowSignInModal] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t, dir } = useLanguage();
  const { user } = useAuth();
  const { isAnonymous } = useAnonymousMode();
  const isRTL = dir() === 'rtl';

  const addCommitmentMutation = useMutation({
    mutationFn: async (commitment: { outcome: string; nextAction: string }) => {
      let insertData;
      
      if (user) {
        // Authenticated user
        insertData = {
          outcome: commitment.outcome,
          nextaction: commitment.nextAction,
          user_id: user.id
        };
      } else if (isAnonymous) {
        // Anonymous user
        const deviceId = getDeviceId();
        insertData = {
          outcome: commitment.outcome,
          nextaction: commitment.nextAction,
          device_id: deviceId
        };
      } else {
        throw new Error('No authentication method available');
      }

      const { data, error } = await supabase
        .from('commitments')
        .insert([insertData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate both authenticated and anonymous queries
      queryClient.invalidateQueries({ queryKey: ['commitments'] });
      const deviceId = getDeviceId();
      queryClient.invalidateQueries({ queryKey: ['commitments', 'anonymous', deviceId] });
      
      toast({
        title: t('commitments.clarifier.successTitle'),
        description: t('commitments.clarifier.successDescription'),
      });
      setOutcome("");
      setNextAction("");
      setStep(1);
    },
    onError: (error) => {
      toast({
        title: t('commitments.clarifier.errorTitle'),
        description: t('commitments.clarifier.errorDescription'),
        variant: "destructive",
      });
      console.error('Error saving commitment:', error);
    }
  });

  const handleNext = () => {
    if (step === 1 && outcome) {
      setStep(2);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!outcome || !nextAction) {
      toast({
        title: t('commitments.clarifier.errorTitle'),
        description: "Please fill in both fields",
        variant: "destructive",
      });
      return;
    }

    // If user is not authenticated and not in anonymous mode, show sign-in modal
    if (!user && !isAnonymous) {
      setShowSignInModal(true);
      return;
    }

    // Proceed with saving the commitment
    addCommitmentMutation.mutate({ outcome, nextAction });
  };

  return (
    <>
      <Card className="p-6 sm:p-8 animate-fade-in" dir={dir()}>
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6">
          {t('commitments.clarifier.title')}
        </h2>
        <div className="space-y-6 sm:space-y-8">
          {step === 1 ? (
            <div className="space-y-4 sm:space-y-6">
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                {t('commitments.clarifier.outcomeQuestion')}
              </p>
              <Input
                value={outcome}
                onChange={(e) => setOutcome(e.target.value)}
                placeholder={t('commitments.clarifier.outcomePlaceholder')}
                className="input-field text-base"
              />
              <Button 
                onClick={handleNext} 
                className="w-full sm:w-auto btn-primary text-base"
                disabled={!outcome}
              >
                {t('commitments.clarifier.nextButton')}
                <ArrowRight className={`${isRTL ? 'mr-3' : 'ml-3'} h-5 w-5 ${isRTL ? 'rotate-180' : ''}`} />
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                {t('commitments.clarifier.nextActionQuestion')}
              </p>
              <Input
                value={nextAction}
                onChange={(e) => setNextAction(e.target.value)}
                placeholder={t('commitments.clarifier.nextActionPlaceholder')}
                className="input-field text-base"
              />
              <Button 
                type="submit" 
                className="w-full sm:w-auto btn-primary text-base"
                disabled={addCommitmentMutation.isPending}
              >
                {addCommitmentMutation.isPending ? t('common.saving') : t('commitments.clarifier.saveButton')}
              </Button>
            </form>
          )}
        </div>
      </Card>

      <SignInModal
        open={showSignInModal}
        onOpenChange={setShowSignInModal}
        title={t('commitments.clarifier.title')}
        description="Sign in to save your commitments securely across all your devices, or continue anonymously to store them locally."
      />
    </>
  );
};

export default CommitmentClarifier;
