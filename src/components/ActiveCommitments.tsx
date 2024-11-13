import React from 'react';
import { Card } from "@/components/ui/card";
import { Check, Clock } from "lucide-react";
import { supabase } from '@/lib/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from "@/components/ui/use-toast";

const ActiveCommitments = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: commitments, isLoading } = useQuery({
    queryKey: ['commitments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('commitments')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const completeCommitmentMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('commitments')
        .update({ completed: true })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commitments'] });
      toast({
        title: "Commitment completed",
        description: "Great job completing your commitment!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to complete commitment. Please try again.",
        variant: "destructive",
      });
      console.error('Error completing commitment:', error);
    }
  });

  if (isLoading) {
    return <div className="p-4 text-center text-gray-600">Loading commitments...</div>;
  }

  return (
    <div className="animate-fade-in p-4 sm:p-0">
      <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Active Commitments</h2>
      <div className="grid gap-3 sm:gap-4">
        {commitments?.filter(c => !c.completed).map((commitment) => (
          <Card key={commitment.id} className="commitment-card p-4 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0 overflow-hidden">
                <h3 className="font-medium text-base sm:text-lg break-words">{commitment.outcome}</h3>
                <div className="flex items-start mt-2 text-gray-600">
                  <Clock className="h-4 w-4 mr-2 flex-shrink-0 mt-1" />
                  <p className="text-sm sm:text-base break-words">{commitment.nextAction}</p>
                </div>
              </div>
              <button 
                className="p-2 hover:bg-sage-100 rounded-full transition-colors flex-shrink-0"
                onClick={() => completeCommitmentMutation.mutate(commitment.id)}
                disabled={completeCommitmentMutation.isPending}
              >
                <Check className="h-5 w-5 text-sage-500" />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ActiveCommitments;