import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { supabase, withMobileNumber, getMobileNumber } from '@/lib/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const BrainDump = () => {
  const [thought, setThought] = useState("");
  const queryClient = useQueryClient();
  const mobileNumber = getMobileNumber();

  const { data: thoughts, isLoading } = useQuery({
    queryKey: ['thoughts'],
    queryFn: async () => {
      if (!mobileNumber) return [];
      
      const { data, error } = await supabase
        .from('thoughts')
        .select('*')
        .order('created_at', { ascending: false })
        .headers(withMobileNumber().headers);
      
      if (error) throw error;
      return data;
    },
    enabled: !!mobileNumber
  });

  const addThoughtMutation = useMutation({
    mutationFn: async (newThought: string) => {
      if (!mobileNumber) {
        throw new Error('No mobile number available');
      }

      const { data, error } = await supabase
        .from('thoughts')
        .insert([{ content: newThought }])
        .select()
        .single()
        .headers(withMobileNumber().headers);
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['thoughts'] });
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
          disabled={addThoughtMutation.isPending || !mobileNumber}
        >
          <Plus className="mr-2 h-4 w-4" />
          Capture Thought
        </Button>
      </form>
    </div>
  );
};

export default BrainDump;