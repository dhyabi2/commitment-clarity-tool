import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { supabase } from '@/lib/supabase';
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from '@tanstack/react-query';

const CommitmentClarifier = () => {
  const [step, setStep] = useState(1);
  const [outcome, setOutcome] = useState("");
  const [nextAction, setNextAction] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
        title: "Commitment saved",
        description: "Your commitment has been successfully recorded.",
      });
      setOutcome("");
      setNextAction("");
      setStep(1);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save commitment. Please try again.",
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
    <Card className="p-6 animate-fade-in">
      <h2 className="text-2xl font-semibold mb-4">Clarify Your Commitment</h2>
      <div className="space-y-6">
        {step === 1 ? (
          <div className="space-y-4">
            <p className="text-gray-600">
              What would need to happen for this to be complete?
            </p>
            <Input
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
              placeholder="Describe the successful outcome..."
              className="input-field"
            />
            <Button 
              onClick={handleNext} 
              className="btn-primary"
              disabled={!outcome}
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-gray-600">
              What's the very next physical action required?
            </p>
            <Input
              value={nextAction}
              onChange={(e) => setNextAction(e.target.value)}
              placeholder="What's the next action?"
              className="input-field"
            />
            <Button 
              type="submit" 
              className="btn-primary"
              disabled={addCommitmentMutation.isPending}
            >
              Save Commitment
            </Button>
          </form>
        )}
      </div>
    </Card>
  );
};

export default CommitmentClarifier;