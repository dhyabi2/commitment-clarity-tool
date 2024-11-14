import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const BrainDump = () => {
  const [thought, setThought] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  const addThoughtMutation = useMutation({
    mutationFn: async (newThought: string) => {
      const { data, error } = await supabase
        .from('thoughts')
        .insert([{ content: newThought }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['thoughts'] });
      toast({
        title: "Thought captured",
        description: "Your thought has been safely stored.",
      });
      setThought("");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (thought.trim()) {
      addThoughtMutation.mutate(thought);
    }
  };

  return (
    <div className="animate-fade-in p-4 sm:p-0">
      <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Brain Dump</h2>
      <p className="text-gray-600 text-sm sm:text-base mb-4">
        Clear your mind by capturing any unfinished thoughts or tasks here.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <Textarea
          value={thought}
          onChange={(e) => setThought(e.target.value)}
          placeholder="What's on your mind?"
          className="min-h-[120px] sm:min-h-[150px] input-field text-sm sm:text-base"
        />
        <Button 
          type="submit" 
          className="w-full sm:w-auto btn-primary"
          disabled={addThoughtMutation.isPending}
        >
          <Plus className="mr-2 h-4 w-4" />
          Capture Thought
        </Button>
      </form>
    </div>
  );
};

export default BrainDump;