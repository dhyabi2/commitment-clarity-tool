import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { ArrowRightCircle, Trash2, CheckCircle, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Thoughts = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showCompleted, setShowCompleted] = useState(false);

  const { data: thoughts, isLoading } = useQuery({
    queryKey: ['thoughts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('thoughts')
        .select('*')
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

  const filteredThoughts = thoughts?.filter(thought => thought.completed === showCompleted) || [];

  const renderSuggestions = () => {
    if (!showCompleted) return null;
    
    return (
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
    );
  };

  return (
    <div className="min-h-screen bg-cream p-4 pb-20 md:pb-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-sage-600 mb-2">Your Captured Thoughts</h1>
          <p className="text-sage-500 mb-4">
            Review and clarify your thoughts to turn them into actionable commitments
          </p>
          <Button
            onClick={() => setShowCompleted(!showCompleted)}
            variant="outline"
            className="mb-4"
          >
            <Filter className="mr-2 h-4 w-4" />
            {showCompleted ? 'Show Active Thoughts' : 'Show Completed Thoughts'}
          </Button>
        </div>

        {renderSuggestions()}

        {filteredThoughts.length === 0 ? (
          <Card className="p-8 text-center bg-white/50 backdrop-blur-sm">
            <h2 className="text-xl font-semibold text-sage-600 mb-2">
              No {showCompleted ? 'completed' : 'active'} thoughts
            </h2>
            <p className="text-sage-500 mb-4">
              {showCompleted 
                ? 'Complete some thoughts to see them here'
                : 'Start by capturing your thoughts in the brain dump area'}
            </p>
            <Button 
              onClick={() => navigate('/')} 
              className="bg-sage-500 hover:bg-sage-600"
            >
              Go to Brain Dump
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredThoughts.map((thought) => (
              <Card key={thought.id} className="group hover:shadow-md transition-all duration-300 bg-white/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between p-4">
                  <time className="text-sm text-sage-500">
                    {format(new Date(thought.created_at), 'MMM d, yyyy h:mm a')}
                  </time>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:text-red-600"
                      onClick={() => deleteThoughtMutation.mutate(thought.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      onClick={() => toggleCompleteMutation.mutate({ 
                        thoughtId: thought.id, 
                        completed: !thought.completed 
                      })}
                    >
                      <CheckCircle className={`h-4 w-4 ${thought.completed ? 'text-green-500' : ''}`} />
                    </Button>
                    {!thought.completed && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        onClick={() => navigate('/commitment-clarifier', { state: { thought: thought.content } })}
                      >
                        Clarify <ArrowRightCircle className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-gray-800 text-left">{thought.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Thoughts;