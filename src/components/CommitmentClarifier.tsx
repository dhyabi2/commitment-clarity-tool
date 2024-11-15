import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { supabase } from '@/lib/supabase';
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLanguage } from "@/lib/i18n/LanguageContext";

const CommitmentClarifier = () => {
  const [step, setStep] = useState(1);
  const [outcome, setOutcome] = useState("");
  const [nextAction, setNextAction] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t, dir } = useLanguage();
  const isRTL = dir() === 'rtl';

  const addCommitmentMutation = useMutation({
    mutationFn: async (commitment: { outcome: string; nextAction: string }) => {
      const { data, error } = await supabase
        .from('commitments')
        .insert([commitment])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commitments'] });
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
    if (outcome && nextAction) {
      addCommitmentMutation.mutate({ outcome, nextAction });
    }
  };

  return (
    <Card className="p-4 sm:p-6 animate-fade-in" dir={dir()}>
      <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">
        {t('commitments.clarifier.title')}
      </h2>
      <div className="space-y-4 sm:space-y-6">
        {step === 1 ? (
          <div className="space-y-3 sm:space-y-4">
            <p className="text-gray-600 text-sm sm:text-base">
              {t('commitments.clarifier.outcomeQuestion')}
            </p>
            <Input
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
              placeholder={t('commitments.clarifier.outcomePlaceholder')}
              className="input-field text-sm sm:text-base"
            />
            <Button 
              onClick={handleNext} 
              className="w-full sm:w-auto btn-primary"
              disabled={!outcome}
            >
              {t('commitments.clarifier.nextButton')}
              <ArrowRight className={`${isRTL ? 'mr-2' : 'ml-2'} h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <p className="text-gray-600 text-sm sm:text-base">
              {t('commitments.clarifier.nextActionQuestion')}
            </p>
            <Input
              value={nextAction}
              onChange={(e) => setNextAction(e.target.value)}
              placeholder={t('commitments.clarifier.nextActionPlaceholder')}
              className="input-field text-sm sm:text-base"
            />
            <Button 
              type="submit" 
              className="w-full sm:w-auto btn-primary"
              disabled={addCommitmentMutation.isPending}
            >
              {t('commitments.clarifier.saveButton')}
            </Button>
          </form>
        )}
      </div>
    </Card>
  );
};

export default CommitmentClarifier;