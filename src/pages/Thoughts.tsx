import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useToast } from "@/components/ui/use-toast";
import ThoughtsList from '@/components/thoughts/ThoughtsList';

const Thoughts = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: thoughts, isLoading } = useQuery({
    queryKey: ['thoughts', 'active'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('thoughts')
        .select('*')
        .eq('completed', false)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const deleteThoughtMutation = useMutation({
    mutationFn: async (thoughtId: number) => {
      const { error } = await supabase
        .from('thoughts')
        .delete()
        .eq('id', thoughtId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['thoughts'] });
      toast({
        title: "Thought deleted",
        description: "Your thought has been successfully removed.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete thought. Please try again.",
        variant: "destructive",
      });
    }
  });

  const toggleCompleteMutation = useMutation({
    mutationFn: async ({ thoughtId, completed }: { thoughtId: number; completed: boolean }) => {
      const { error } = await supabase
        .from('thoughts')
        .update({ completed })
        .eq('id', thoughtId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['thoughts'] });
      queryClient.invalidateQueries({ queryKey: ['completed-thoughts'] });
      toast({
        title: "Thought updated",
        description: "The thought status has been updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update thought status. Please try again.",
        variant: "destructive",
      });
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream p-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-32 bg-sage-100 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream p-4 pb-20 md:pb-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-sage-600 mb-2">Your Thoughts</h1>
          <p className="text-sage-500 mb-6">
            Review and clarify your thoughts to turn them into actionable commitments
          </p>
          <ThoughtsList 
            thoughts={thoughts || []}
            onDelete={(id) => deleteThoughtMutation.mutate(id)}
            onToggleComplete={(id, completed) => toggleCompleteMutation.mutate({ thoughtId: id, completed })}
          />
        </div>
      </div>
    </div>
  );
};

export default Thoughts;