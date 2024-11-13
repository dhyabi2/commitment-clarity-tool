import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Filter } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ThoughtsList from '@/components/thoughts/ThoughtsList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  const { data: completedThoughts, isLoading: isLoadingCompleted } = useQuery({
    queryKey: ['thoughts', 'completed'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('thoughts')
        .select('*')
        .eq('completed', true)
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

  if (isLoading || isLoadingCompleted) {
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
          <h1 className="text-3xl font-bold text-sage-600 mb-6">Your Thoughts</h1>
          
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="active" className="text-lg">Active Thoughts</TabsTrigger>
              <TabsTrigger value="completed" className="text-lg">Completed Thoughts</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="mt-0">
              <p className="text-sage-500 mb-6">
                Review and clarify your thoughts to turn them into actionable commitments
              </p>
              <ThoughtsList 
                thoughts={thoughts || []}
                onDelete={(id) => deleteThoughtMutation.mutate(id)}
                onToggleComplete={(id, completed) => toggleCompleteMutation.mutate({ thoughtId: id, completed })}
              />
            </TabsContent>

            <TabsContent value="completed" className="mt-0">
              <Alert className="mb-6">
                <AlertDescription>
                  <p className="font-medium mb-2">Suggestions for completed thoughts:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Archive them if they don't require further action</li>
                    <li>Review if any learning can be extracted from them</li>
                    <li>Consider if they form part of a larger pattern or project</li>
                    <li>Share relevant insights with team members or stakeholders</li>
                  </ul>
                </AlertDescription>
              </Alert>
              <ThoughtsList 
                thoughts={completedThoughts || []}
                onDelete={(id) => deleteThoughtMutation.mutate(id)}
                onToggleComplete={(id, completed) => toggleCompleteMutation.mutate({ thoughtId: id, completed })}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Thoughts;