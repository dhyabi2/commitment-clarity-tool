
import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, Check, Brain, Target, Clock, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabase';
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useAuth } from '@/contexts/AuthContext';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import SignInModal from '@/components/auth/SignInModal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useThoughtsQuery } from '@/hooks/useThoughtsQuery';

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
  const isRTL = dir() === 'rtl';

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

  const progressPercentage = (step / 3) * 100;

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
          {/* Header with Back Button */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              className="text-base"
              onClick={handleBack}
            >
              <ArrowLeft className={`h-5 w-5 ${isRTL ? 'ml-3 rotate-180' : 'mr-3'}`} />
              {t('common.back')}
            </Button>
            
            {/* Progress Bar */}
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-sage-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <span className="text-sm text-gray-600">{step}/3</span>
          </div>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-3 mb-4">
                {step === 1 ? (
                  <MessageSquare className="h-8 w-8 text-sage-600" />
                ) : step === 2 ? (
                  <Target className="h-8 w-8 text-sage-600" />
                ) : (
                  <Clock className="h-8 w-8 text-sage-600" />
                )}
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-sage-600">
                    {t('commitments.clarifier.title')}
                  </h1>
                  <p className="text-sage-500 text-base md:text-lg">
                    {step === 1 ? 'Step 1: Select a thought' : 
                     step === 2 ? 'Step 2: Define your outcome' : 
                     'Step 3: Plan your action'}
                  </p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              {step === 1 ? (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-base font-medium text-gray-700">
                      Which thought would you like to clarify into a commitment?
                    </Label>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {thoughts?.map((thought) => (
                        <div
                          key={thought.id}
                          className={`p-4 rounded-lg border cursor-pointer transition-all ${
                            selectedThought?.id === thought.id
                              ? 'border-sage-500 bg-sage-50'
                              : 'border-gray-200 hover:border-sage-300 hover:bg-gray-50'
                          }`}
                          onClick={() => setSelectedThought(thought)}
                        >
                          <p className="text-gray-700 text-sm">{thought.content}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(thought.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button 
                    onClick={handleNext}
                    className="w-full bg-sage-500 hover:bg-sage-600 min-h-[56px] text-lg"
                    disabled={!selectedThought}
                  >
                    {t('commitments.clarifier.nextButton')}
                    <ArrowRight className={`h-5 w-5 ${isRTL ? 'mr-3 rotate-180' : 'ml-3'}`} />
                  </Button>
                </div>
              ) : step === 2 ? (
                <div className="space-y-6">
                  {/* Show selected thought */}
                  {selectedThought && (
                    <div className="bg-sage-50 p-4 rounded-lg border border-sage-200">
                      <Label className="text-sm font-medium text-sage-600 mb-2 block">
                        Selected Thought
                      </Label>
                      <p className="text-gray-700 text-sm">{selectedThought.content}</p>
                    </div>
                  )}

                  <div className="space-y-3">
                    <Label htmlFor="outcome" className="text-base font-medium text-gray-700">
                      {t('commitments.clarifier.outcomeQuestion')}
                    </Label>
                    <Textarea
                      id="outcome"
                      placeholder={t('commitments.clarifier.outcomePlaceholder')}
                      value={outcome}
                      onChange={(e) => setOutcome(e.target.value)}
                      className="min-h-[120px] text-base leading-relaxed p-4"
                      autoFocus
                    />
                  </div>

                  <Button 
                    onClick={handleNext}
                    className="w-full bg-sage-500 hover:bg-sage-600 min-h-[56px] text-lg"
                    disabled={!outcome.trim()}
                  >
                    {t('commitments.clarifier.nextButton')}
                    <ArrowRight className={`h-5 w-5 ${isRTL ? 'mr-3 rotate-180' : 'ml-3'}`} />
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Show the selected thought and outcome */}
                  {selectedThought && (
                    <div className="bg-sage-50 p-4 rounded-lg border border-sage-200">
                      <Label className="text-sm font-medium text-sage-600 mb-2 block">
                        Selected Thought
                      </Label>
                      <p className="text-gray-700 text-sm mb-3">{selectedThought.content}</p>
                      
                      <Label className="text-sm font-medium text-sage-600 mb-2 block">
                        {t('commitments.clarifier.outcomeLabel')}
                      </Label>
                      <p className="text-gray-700 text-sm">{outcome}</p>
                    </div>
                  )}

                  <div className="space-y-3">
                    <Label htmlFor="nextAction" className="text-base font-medium text-gray-700">
                      {t('commitments.clarifier.nextActionQuestion')}
                    </Label>
                    <Textarea
                      id="nextAction"
                      placeholder={t('commitments.clarifier.nextActionPlaceholder')}
                      value={nextAction}
                      onChange={(e) => setNextAction(e.target.value)}
                      className="min-h-[120px] text-base leading-relaxed p-4"
                      autoFocus
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-sage-500 hover:bg-sage-600 min-h-[56px] text-lg"
                    disabled={!nextAction.trim() || addCommitmentMutation.isPending}
                  >
                    <Check className={`h-5 w-5 ${isRTL ? 'ml-3' : 'mr-3'}`} />
                    {t('commitments.clarifier.submitButton')}
                  </Button>
                </form>
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
