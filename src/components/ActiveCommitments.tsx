import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import CommitmentCard from './commitments/CommitmentCard';

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
        title: t('commitments.updated'),
        description: t('commitments.updatedDesc'),
      });
      setEditing({ id: null, field: null, value: '' });
    },
    onError: (error) => {
      toast({
        title: t('common.error'),
        description: t('commitments.updateError'),
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
        title: t('commitments.completed'),
        description: t('commitments.completedDesc'),
      });
    },
    onError: (error) => {
      toast({
        title: t('common.error'),
        description: t('commitments.completeError'),
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
    return <div className="p-4 text-center text-gray-600">Please sign in to view your commitments.</div>;
  }

  if (isLoading) {
    return <div className="p-4 text-center text-gray-600">{t('common.loading')}</div>;
  }

  return (
    <div className="animate-fade-in p-4 sm:p-0">
      <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">
        {t('commitments.activeTitle')}
      </h2>
      <div className="grid gap-3 sm:gap-4">
        {commitments?.filter(c => !c.completed).map((commitment) => (
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
    </div>
  );
};

export default ActiveCommitments;
