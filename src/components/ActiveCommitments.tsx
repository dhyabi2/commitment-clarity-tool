import React, { useState } from 'react';
import { supabase, withMobileNumber, getMobileNumber } from '@/lib/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CommitmentList } from './CommitmentList';

interface EditingState {
  id: number | null;
  field: 'outcome' | 'nextAction' | null;
  value: string;
}

const ActiveCommitments = () => {
  const queryClient = useQueryClient();
  const mobileNumber = getMobileNumber();
  const [editing, setEditing] = useState<EditingState>({
    id: null,
    field: null,
    value: '',
  });

  const { data: commitments, isLoading } = useQuery({
    queryKey: ['commitments'],
    queryFn: async () => {
      if (!mobileNumber) return [];
      
      const { data, error } = await supabase
        .from('commitments')
        .select('*')
        .order('created_at', { ascending: false })
        .headers(withMobileNumber().headers);
      
      if (error) throw error;
      return data;
    },
    enabled: !!mobileNumber
  });

  const updateCommitmentMutation = useMutation({
    mutationFn: async ({ id, field, value }: { id: number; field: string; value: string }) => {
      const { error } = await supabase
        .from('commitments')
        .update({ [field]: value })
        .eq('id', id)
        .headers(withMobileNumber().headers);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commitments'] });
      setEditing({ id: null, field: null, value: '' });
    }
  });

  const completeCommitmentMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('commitments')
        .update({ completed: true })
        .eq('id', id)
        .headers(withMobileNumber().headers);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commitments'] });
    }
  });

  if (isLoading) {
    return <div className="p-4 text-center text-gray-600">Loading commitments...</div>;
  }

  return (
    <CommitmentList
      commitments={commitments?.filter(c => !c.completed) || []}
      editing={editing}
      setEditing={setEditing}
      onUpdate={updateCommitmentMutation.mutate}
      onComplete={completeCommitmentMutation.mutate}
      isUpdating={updateCommitmentMutation.isPending}
      isCompleting={completeCommitmentMutation.isPending}
    />
  );
};

export default ActiveCommitments;