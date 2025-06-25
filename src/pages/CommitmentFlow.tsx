
import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabase';
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useAuth } from '@/contexts/AuthContext';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import SignInModal from '@/components/auth/SignInModal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useThoughtsQuery } from '@/hooks/useThoughtsQuery';
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
  const { executeWithAuth, showSignInModal, setShowSignInModal, modalConfig } = useAuthGuard();
  const [step, setStep] = useState(1);
  const [selectedThought, setSelectedThought] = useState<Thought | null>(null);
  const [outcome, setOutcome] = useState('');
  const [nextAction, setNextAction] = useState('');

  // Get user's thoughts
  const { data: thoughts, isLoading: thoughtsLoading } = useThoughtsQuery(null);

  const addCommitmentMutation = useMutation({
    mutationFn: async (commitment: { outcome: string; nextAction: string; thoughtId?: number }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('commitments')
        .insert([{
          outcome: commitment.outcome,
          nextaction: commitment.nextAction,
          user_id: user.id
        }])
        .select()
        .single();
      
      if (error) throw error;

      // Mark the thought as completed if we have a thought ID
      if (commitment.thoughtId) {
        await supabase
          .from('thoughts')
          .update({ completed: true })
          .eq('id', commitment.thoughtId)
          .eq('user_id', user.id);
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
      executeWithAuth(
        () => {
          addCommitmentMutation.mutate({ 
            outcome, 
            nextAction, 
            thoughtId: selectedThought.id 
          });
        },
        { selectedThought, outcome, nextAction },
        {
          title: "Save your commitments",
          description: "Sign in to track your outcomes and next actions. Stay organized and accountable across all your devices."
        }
      );
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
    <>
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

      <SignInModal
        open={showSignInModal}
        onOpenChange={setShowSignInModal}
        title={modalConfig.title}
        description={modalConfig.description}
      />
    </>
  );
};

export default CommitmentFlow;
