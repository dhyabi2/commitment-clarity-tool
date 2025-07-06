
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useAnonymousMode } from '@/hooks/useAnonymousMode';
import { useAnonymousCommitments } from '@/hooks/useAnonymousCommitments';
import { useAnonymousCommitmentsMutations } from '@/hooks/useAnonymousCommitmentsMutations';
import CommitmentCard from './commitments/CommitmentCard';
import { Target, Lightbulb, UserX } from 'lucide-react';
import { Button } from "@/components/ui/button";

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
  const { isAnonymous, enableAnonymousMode } = useAnonymousMode();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<EditingState>({
    id: null,
    field: null,
    value: '',
  });

  // Use appropriate query based on authentication state
  const authenticatedQuery = useQuery({
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
      
      // Map database fields to UI fields
      return data?.map(commitment => ({
        ...commitment,
        nextAction: commitment.nextaction
      })) || [];
    },
    enabled: !!user?.id
  });

  const anonymousQuery = useAnonymousCommitments();
  const anonymousMutations = useAnonymousCommitmentsMutations();

  // Choose the appropriate data and mutations
  const { data: commitments, isLoading } = user ? authenticatedQuery : anonymousQuery;

  // Authenticated user mutations
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
        title: t('notifications.commitmentUpdated'),
        description: t('notifications.commitmentUpdatedDescription'),
      });
      setEditing({ id: null, field: null, value: '' });
    },
    onError: (error) => {
      toast({
        title: t('notifications.commitmentUpdateFailed'),
        description: t('notifications.commitmentUpdateFailedDescription'),
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
        title: t('notifications.commitmentCompleted'),
        description: t('notifications.commitmentCompletedDescription'),
      });
    },
    onError: (error) => {
      toast({
        title: t('notifications.commitmentCompleteFailed'),
        description: t('notifications.commitmentCompleteFailedDescription'),
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
      const fieldName = editing.field === 'nextAction' ? 'nextaction' : 'outcome';
      
      if (user) {
        updateCommitmentMutation.mutate({
          id: editing.id,
          field: fieldName,
          value: editing.value,
        });
      } else {
        anonymousMutations.updateCommitmentMutation.mutate({
          id: editing.id,
          field: fieldName,
          value: editing.value,
        });
      }
    }
  };

  const handleCancel = () => {
    setEditing({ id: null, field: null, value: '' });
  };

  const handleComplete = (id: number) => {
    if (user) {
      completeCommitmentMutation.mutate(id);
    } else {
      anonymousMutations.completeCommitmentMutation.mutate(id);
    }
  };

  const handleAnonymousAccess = () => {
    enableAnonymousMode();
    window.location.reload(); // Refresh to show anonymous data
  };

  if (!user && !isAnonymous) {
    return (
      <div className="p-4 sm:p-6 text-center bg-gray-50 rounded-lg border border-gray-200 mx-2 sm:mx-0">
        <Lightbulb className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
        <h3 className="text-base sm:text-lg font-medium text-gray-600 mb-2">{t('auth.signInToViewCommitments')}</h3>
        <p className="text-sm sm:text-base text-gray-500 mb-4">{t('auth.signInCommitmentsDescription')}</p>
        <Button
          onClick={handleAnonymousAccess}
          variant="outline"
          className="w-full"
        >
          <UserX className="h-4 w-4 mr-2" />
          {t('auth.continueAnonymously')}
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 text-center">
        <div className="animate-pulse space-y-3 sm:space-y-4">
          <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="h-20 sm:h-24 bg-gray-200 rounded"></div>
          <div className="h-20 sm:h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const activeCommitments = commitments?.filter(c => !c.completed) || [];

  if (activeCommitments.length === 0) {
    return (
      <div className="p-4 sm:p-6 text-center bg-sage-50 rounded-lg border border-sage-200 mx-2 sm:mx-0">
        <Target className="h-10 w-10 sm:h-12 sm:w-12 text-sage-400 mx-auto mb-3 sm:mb-4" />
        <h3 className="text-base sm:text-lg font-medium text-sage-600 mb-2">{t('commitments.noActiveCommitments')}</h3>
        <p className="text-sm sm:text-base text-sage-500">{t('commitments.noActiveCommitmentsDescription')}</p>
      </div>
    );
  }

  const mutations = user 
    ? { updateCommitmentMutation, completeCommitmentMutation }
    : anonymousMutations;

  return (
    <div className="animate-fade-in px-2 sm:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <Target className="h-5 w-5 sm:h-6 sm:w-6 text-sage-600 flex-shrink-0" />
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-sage-700">
            {t('commitments.activeCommitments')}
          </h2>
        </div>
        <span className="bg-sage-100 text-sage-600 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium self-start sm:self-auto">
          {activeCommitments.length}
        </span>
      </div>
      
      <div className="space-y-3 sm:space-y-4">
        {activeCommitments.map((commitment) => (
          <CommitmentCard
            key={commitment.id}
            commitment={commitment}
            editing={editing}
            onEdit={handleEdit}
            onSave={handleSave}
            onCancel={handleCancel}
            onComplete={handleComplete}
            setEditing={setEditing}
            isPending={mutations.updateCommitmentMutation.isPending || mutations.completeCommitmentMutation.isPending}
          />
        ))}
      </div>
      
      {activeCommitments.length > 0 && (
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs sm:text-sm text-blue-700 leading-relaxed">
            {t('commitments.tip')}
          </p>
        </div>
      )}
    </div>
  );
};

export default ActiveCommitments;
