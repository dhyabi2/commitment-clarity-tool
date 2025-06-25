
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import CommitmentCard from './commitments/CommitmentCard';
import { Target, Lightbulb } from 'lucide-react';

interface Commitment {
  id: number;
  outcome: string;
  nextAction: string;
  completed: boolean;
  created_at: string;
}

interface EditingState {
  id: number | null;
  field: 'outcome' | 'nextAction' | null;
  value: string;
}

const ActiveCommitments = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<EditingState>({
    id: null,
    field: null,
    value: '',
  });

  const { data: commitments, isLoading } = useQuery({
    queryKey: ['commitments', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('commitments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  const updateCommitmentMutation = useMutation({
    mutationFn: async ({ id, field, value }: { id: number; field: string; value: string }) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('commitments')
        .update({ [field]: value })
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commitments'] });
      toast({
        title: "Commitment updated",
        description: "Your commitment has been successfully updated.",
      });
      setEditing({ id: null, field: null, value: '' });
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: "There was an error updating your commitment. Please try again.",
        variant: "destructive",
      });
      console.error('Error updating commitment:', error);
    }
  });

  const completeCommitmentMutation = useMutation({
    mutationFn: async (id: number) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('commitments')
        .update({ completed: true })
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commitments'] });
      toast({
        title: "Commitment completed! 🎉",
        description: "Congratulations on completing your commitment. Keep up the great work!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error completing commitment",
        description: "There was an error marking your commitment as complete. Please try again.",
        variant: "destructive",
      });
      console.error('Error completing commitment:', error);
    }
  });

  const handleEdit = (commitment: Commitment, field: 'outcome' | 'nextAction') => {
    setEditing({
      id: commitment.id,
      field,
      value: commitment[field],
    });
  };

  const handleSave = () => {
    if (editing.id && editing.field) {
      updateCommitmentMutation.mutate({
        id: editing.id,
        field: editing.field === 'nextAction' ? 'nextaction' : 'outcome',
        value: editing.value,
      });
    }
  };

  const handleCancel = () => {
    setEditing({ id: null, field: null, value: '' });
  };

  if (!user) {
    return (
      <div className="p-6 text-center bg-gray-50 rounded-lg border border-gray-200">
        <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-600 mb-2">Sign in to view commitments</h3>
        <p className="text-gray-500">Please sign in to see your active commitments and track your progress.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const activeCommitments = commitments?.filter(c => !c.completed) || [];

  if (activeCommitments.length === 0) {
    return (
      <div className="p-6 text-center bg-sage-50 rounded-lg border border-sage-200">
        <Target className="h-12 w-12 text-sage-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-sage-600 mb-2">No active commitments</h3>
        <p className="text-sage-500">You don't have any active commitments yet. Start by clarifying some of your thoughts into actionable commitments.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <Target className="h-6 w-6 text-sage-600" />
        <h2 className="text-xl sm:text-2xl font-semibold text-sage-700">
          Active Commitments
        </h2>
        <span className="bg-sage-100 text-sage-600 px-3 py-1 rounded-full text-sm font-medium">
          {activeCommitments.length}
        </span>
      </div>
      
      <div className="space-y-4">
        {activeCommitments.map((commitment) => (
          <CommitmentCard
            key={commitment.id}
            commitment={commitment}
            editing={editing}
            onEdit={handleEdit}
            onSave={handleSave}
            onCancel={handleCancel}
            onComplete={(id) => completeCommitmentMutation.mutate(id)}
            setEditing={setEditing}
            isPending={updateCommitmentMutation.isPending || completeCommitmentMutation.isPending}
          />
        ))}
      </div>
      
      {activeCommitments.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700">
            💡 <strong>Tip:</strong> Focus on completing one commitment at a time. You can edit the outcome or next action if your plans change.
          </p>
        </div>
      )}
    </div>
  );
};

export default ActiveCommitments;
