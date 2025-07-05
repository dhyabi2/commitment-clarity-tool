import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Chrome, UserX } from "lucide-react";
import ThoughtsList from '@/components/thoughts/ThoughtsList';

const CompletedCommitments = () => {
  const { toast } = useToast();
  const { user, signInWithGoogle } = useAuth();
  const queryClient = useQueryClient();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const { data: thoughts, isLoading } = useQuery({
    queryKey: ['completed-thoughts', selectedTag, user?.id],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      let query = supabase
        .from('thoughts')
        .select(`
          *,
          tags:thought_tags(
            tag:tags(*)
          )
        `)
        .eq('completed', true)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) throw error;

      const transformedData = data.map(thought => ({
        ...thought,
        tags: thought.tags
          ?.map(t => t.tag)
          .filter(Boolean)
          .sort((a, b) => a.name.localeCompare(b.name))
      }));

      if (selectedTag) {
        return transformedData.filter(thought => 
          thought.tags?.some(tag => tag.name === selectedTag)
        );
      }

      return transformedData;
    },
    enabled: !!user?.id
  });

  const deleteThoughtMutation = useMutation({
    mutationFn: async (thoughtId: number) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('thoughts')
        .delete()
        .eq('id', thoughtId)
        .eq('user_id', user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['thoughts'] });
      toast({
        title: "Thought deleted",
        description: "Your thought has been successfully removed.",
      });
    }
  });

  const toggleCompleteMutation = useMutation({
    mutationFn: async ({ thoughtId, completed }: { thoughtId: number; completed: boolean }) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('thoughts')
        .update({ completed })
        .eq('id', thoughtId)
        .eq('user_id', user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['thoughts'] });
      queryClient.invalidateQueries({ queryKey: ['completed-thoughts'] });
      toast({
        title: "Thought updated",
        description: "The thought status has been updated.",
      });
    }
  });

  const handleTagClick = (tag: string | null) => {
    setSelectedTag(tag);
  };

  const handleAnonymousAccess = () => {
    localStorage.setItem('anonymousMode', 'true');
    // Refresh the page to apply anonymous mode
    window.location.reload();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-cream p-4 flex items-center justify-center">
        <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-xl font-semibold text-sage-600 mb-2">
              Sign in to view completed thoughts
            </CardTitle>
            <CardDescription className="text-sage-500">
              Please sign in to access your completed thoughts and commitments.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={signInWithGoogle}
              className="w-full bg-sage-600 hover:bg-sage-700 text-white min-h-[48px] flex items-center justify-center gap-3"
            >
              <Chrome className="h-5 w-5" />
              Continue with Google
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <Button
              onClick={handleAnonymousAccess}
              variant="outline"
              className="w-full"
            >
              <UserX className="h-4 w-4 mr-2" />
              Continue Anonymously
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-sage-600 mb-2">Completed Thoughts</h1>
          <p className="text-sage-500 mb-6">
            Review your completed thoughts and their associated commitments
          </p>
          <ThoughtsList 
            thoughts={thoughts || []}
            onDelete={(id) => deleteThoughtMutation.mutate(id)}
            onToggleComplete={(id, completed) => toggleCompleteMutation.mutate({ thoughtId: id, completed })}
            selectedTag={selectedTag}
            onTagClick={handleTagClick}
          />
        </div>
      </div>
    </div>
  );
};

export default CompletedCommitments;
