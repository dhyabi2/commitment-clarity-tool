import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { getDeviceId } from '@/utils/deviceId';

const CommitmentFlow = () => {
  const { user } = useAuth();
  const deviceId = getDeviceId();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t, dir } = useLanguage();

  const [outcome, setOutcome] = useState('');
  const [nextaction, setNextaction] = useState('');

  const createCommitmentMutation = useMutation({
    mutationFn: async (commitment: { outcome: string; nextaction: string }) => {
      const data = user ? 
        { ...commitment, user_id: user.id } :
        { ...commitment, device_id: deviceId };

      const { data: newCommitment, error } = await supabase
        .from('commitments')
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      return newCommitment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commitments'] });
      queryClient.invalidateQueries({ queryKey: ['active-commitments'] });
      toast({
        title: t('commitment.success') || "Commitment created!",
        description: t('commitment.successDescription') || "Your commitment has been successfully created.",
      });
      navigate('/thoughts');
    },
    onError: (error) => {
      console.error('Error creating commitment:', error);
      toast({
        title: t('commitment.error') || "Error",
        description: t('commitment.errorDescription') || "Failed to create commitment. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!outcome.trim() || !nextaction.trim()) {
      toast({
        title: t('commitment.validationError') || "Error",
        description: t('commitment.validationErrorDescription') || "Please fill in both the outcome and next action.",
        variant: "destructive",
      });
      return;
    }

    await createCommitmentMutation.mutateAsync({
      outcome: outcome.trim(),
      nextaction: nextaction.trim()
    });
  };

  return (
    <div dir={dir()}>
      <h2 className="text-2xl font-semibold mb-4">{t('commitment.title') || 'Create a New Commitment'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="outcome">{t('commitment.outcomeLabel') || 'Desired Outcome'}</Label>
          <Input
            type="text"
            id="outcome"
            value={outcome}
            onChange={(e) => setOutcome(e.target.value)}
            placeholder={t('commitment.outcomePlaceholder') || 'e.g., Launch a new product'}
          />
        </div>
        <div>
          <Label htmlFor="nextaction">{t('commitment.nextActionLabel') || 'Next Action'}</Label>
          <Textarea
            id="nextaction"
            value={nextaction}
            onChange={(e) => setNextaction(e.target.value)}
            placeholder={t('commitment.nextActionPlaceholder') || 'e.g., Schedule a meeting with the engineering team'}
          />
        </div>
        <div>
          <Button type="submit" className="bg-sage-600 hover:bg-sage-700 text-white">
            {t('commitment.createButton') || 'Create Commitment'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CommitmentFlow;
