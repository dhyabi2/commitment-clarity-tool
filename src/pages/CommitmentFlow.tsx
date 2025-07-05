
import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabase';
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useAuth } from '@/contexts/AuthContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useThoughtsQuery } from '@/hooks/useThoughtsQuery';
import { getDeviceId } from '@/utils/deviceId';
import ProgressHeader from '@/components/commitment-flow/ProgressHeader';
import ThoughtSelectionStep from '@/components/commitment-flow/ThoughtSelectionStep';
import OutcomeDefinitionStep from '@/components/commitment-flow/OutcomeDefinitionStep';
import NextActionStep from '@/components/commitment-flow/NextActionStep';

interface Thought {
  id: number;
  content: string;
  created_at: string;
}

const CommitmentFlow = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, dir } = useLanguage();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const deviceId = getDeviceId();
  const [step, setStep] = useState(1);
  const [selectedThought, setSelectedThought] = useState<Thought | null>(null);
  const [outcome, setOutcome] = useState('');
  const [nextAction, setNextAction] = useState('');

  // Get user's thoughts (works for both authenticated and anonymous users)
  const { data: thoughts, isLoading: thoughtsLoading } = useThoughtsQuery(null);

  const addCommitmentMutation = useMutation({
    mutationFn: async (commitment: { outcome: string; nextAction: string; thoughtId?: number }) => {
      const commitmentData: any = {
        outcome: commitment.outcome,
        nextaction: commitment.nextAction
      };

      if (user?.id) {
        commitmentData.user_id = user.id;
      } else {
        commitmentData.device_id = deviceId;
        // Update device session
        await supabase.rpc('update_device_session', { p_device_id: deviceId });
      }

      const { data, error } = await supabase
        .from('commitments')
        .insert([commitmentData])
        .select()
        .single();
      
      if (error) throw error;

      // Mark the thought as completed if we have a thought ID
      if (commitment.thoughtId) {
        let updateQuery = supabase
          .from('thoughts')
          .update({ completed: true })
          .eq('id', commitment.thoughtId);

        if (user?.id) {
          updateQuery = updateQuery.eq('user_id', user.id);
        } else {
          updateQuery = updateQuery.eq('device_id', deviceId);
        }

        await updateQuery;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commitments'] });
      queryClient.invalidateQueries({ queryKey: ['thoughts'] });
      toast({
        title: t('commitments.clarifier.successTitle'),
        description: t('commitments.clarifier.successDescription'),
      });
      navigate('/');
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

  // Check if user has thoughts, redirect if none
  React.useEffect(() => {
    if (!thoughtsLoading && thoughts && thoughts.length === 0) {
      toast({
        title: "No thoughts to clarify",
        description: "Please add some thoughts first before creating commitments.",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [thoughts, thoughtsLoading, navigate, toast]);

  const handleNext = () => {
    if (step === 1 && selectedThought) {
      setStep(2);
    } else if (step === 2 && outcome.trim()) {
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step === 3) {
      setStep(2);
    } else if (step === 2) {
      setStep(1);
    } else {
      navigate('/');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedThought && outcome.trim() && nextAction.trim()) {
      addCommitmentMutation.mutate({ 
        outcome, 
        nextAction, 
        thoughtId: selectedThought.id 
      });
    }
  };

  if (thoughtsLoading) {
    return (
      <div className="min-h-screen bg-cream p-4 flex items-center justify-center">
        <div className="text-sage-600">Loading your thoughts...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream p-4 pb-24 md:pb-6" dir={dir()}>
      <div className="max-w-2xl mx-auto">
        <ProgressHeader 
          step={step}
          totalSteps={3}
          onBack={handleBack}
        />

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-6">
            {/* Step content will be rendered by step components */}
            {!user && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <p className="text-sm text-orange-700">
                  💡 You're using anonymous mode. Your commitments are saved locally on this device.
                </p>
              </div>
            )}
          </CardHeader>
          
          <CardContent>
            {step === 1 && (
              <ThoughtSelectionStep
                thoughts={thoughts}
                selectedThought={selectedThought}
                onThoughtSelect={setSelectedThought}
                onNext={handleNext}
              />
            )}

            {step === 2 && (
              <OutcomeDefinitionStep
                selectedThought={selectedThought}
                outcome={outcome}
                onOutcomeChange={setOutcome}
                onNext={handleNext}
              />
            )}

            {step === 3 && (
              <NextActionStep
                selectedThought={selectedThought}
                outcome={outcome}
                nextAction={nextAction}
                onNextActionChange={setNextAction}
                onSubmit={handleSubmit}
                isPending={addCommitmentMutation.isPending}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CommitmentFlow;
