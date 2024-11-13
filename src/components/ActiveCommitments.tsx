import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Check, Clock, X, Pencil, Save } from "lucide-react";
import { supabase } from '@/lib/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";

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

  if (isLoading) {
    return <div className="p-4 text-center text-gray-600">Loading commitments...</div>;
  }

  return (
    <div className="animate-fade-in p-4 sm:p-0">
      <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Active Commitments</h2>
      <div className="grid gap-3 sm:gap-4">
        {commitments?.filter(c => !c.completed).map((commitment) => (
          <Card key={commitment.id} className="commitment-card p-4 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0 overflow-hidden">
                <div className="flex items-start gap-2">
                  {editing.id === commitment.id && editing.field === 'outcome' ? (
                    <div className="flex-1">
                      <Input
                        value={editing.value}
                        onChange={(e) => setEditing(prev => ({ ...prev, value: e.target.value }))}
                        className="mb-2"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleSave}
                          className="p-1 hover:bg-sage-100 rounded-full transition-colors"
                          disabled={updateCommitmentMutation.isPending}
                        >
                          <Save className="h-4 w-4 text-sage-500" />
                        </button>
                        <button
                          onClick={handleCancel}
                          className="p-1 hover:bg-red-100 rounded-full transition-colors"
                        >
                          <X className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="font-medium text-base sm:text-lg break-words flex-1">
                        {commitment.outcome}
                      </h3>
                      <button
                        onClick={() => handleEdit(commitment, 'outcome')}
                        className="p-1 hover:bg-sage-100 rounded-full transition-colors"
                      >
                        <Pencil className="h-4 w-4 text-sage-500" />
                      </button>
                    </>
                  )}
                </div>
                <div className="flex items-start mt-2 text-gray-600">
                  <Clock className="h-4 w-4 mr-2 flex-shrink-0 mt-1" />
                  {editing.id === commitment.id && editing.field === 'nextAction' ? (
                    <div className="flex-1">
                      <Input
                        value={editing.value}
                        onChange={(e) => setEditing(prev => ({ ...prev, value: e.target.value }))}
                        className="mb-2"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleSave}
                          className="p-1 hover:bg-sage-100 rounded-full transition-colors"
                          disabled={updateCommitmentMutation.isPending}
                        >
                          <Save className="h-4 w-4 text-sage-500" />
                        </button>
                        <button
                          onClick={handleCancel}
                          className="p-1 hover:bg-red-100 rounded-full transition-colors"
                        >
                          <X className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2 flex-1">
                      <p className="text-sm sm:text-base break-words flex-1">{commitment.nextAction}</p>
                      <button
                        onClick={() => handleEdit(commitment, 'nextAction')}
                        className="p-1 hover:bg-sage-100 rounded-full transition-colors"
                      >
                        <Pencil className="h-4 w-4 text-sage-500" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <button 
                className="p-2 hover:bg-sage-100 rounded-full transition-colors flex-shrink-0"
                onClick={() => completeCommitmentMutation.mutate(commitment.id)}
                disabled={completeCommitmentMutation.isPending}
              >
                <Check className="h-5 w-5 text-sage-500" />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ActiveCommitments;