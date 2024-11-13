import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabase';
import CommitmentCard from './CommitmentCard';

interface EditingState {
  id: number | null;
  field: 'outcome' | 'nextAction' | null;
  value: string;
}

const ActiveCommitments = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<EditingState>({
    id: null,
    field: null,
    value: '',
  });

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

  const updateCommitmentMutation = useMutation({
    mutationFn: async ({ id, field, value }: { id: number; field: string; value: string }) => {
      const { error } = await supabase
        .from('commitments')
        .update({ [field]: value })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commitments'] });
      toast({
        title: "Commitment updated",
        description: "Your changes have been saved successfully.",
      });
      setEditing({ id: null, field: null, value: '' });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update commitment. Please try again.",
        variant: "destructive",
      });
      console.error('Error updating commitment:', error);
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

  const handleEdit = (id: number, field: 'outcome' | 'nextAction', value: string) => {
    updateCommitmentMutation.mutate({
      id,
      field: field === 'nextAction' ? 'nextaction' : 'outcome',
      value,
    });
  };

  if (isLoading) {
    return <div className="p-4 text-center text-gray-600">Loading commitments...</div>;
  }

  return (
    <div className="animate-fade-in p-4 sm:p-0">
      <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Active Commitments</h2>
      <div className="grid gap-3 sm:gap-4">
        {commitments?.filter(c => !c.completed).map((commitment) => (
          <CommitmentCard
            key={commitment.id}
            commitment={commitment}
            onEdit={handleEdit}
            onComplete={(id) => completeCommitmentMutation.mutate(id)}
            editing={editing}
            setEditing={setEditing}
          />
        ))}
      </div>
    </div>
  );
};

export default ActiveCommitments;