
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useToast } from "@/components/ui/use-toast";
import { getDeviceId } from '@/utils/deviceId';

export const useAnonymousCommitmentsMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const deviceId = getDeviceId();

  const updateCommitmentMutation = useMutation({
    mutationFn: async ({ id, field, value }: { id: number; field: string; value: string }) => {
      const { error } = await supabase
        .from('commitments')
        .update({ [field]: value })
        .eq('id', id)
        .eq('device_id', deviceId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commitments', 'anonymous', deviceId] });
      toast({
        title: "Commitment updated",
        description: "Your commitment has been successfully updated.",
      });
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
      const { error } = await supabase
        .from('commitments')
        .update({ completed: true })
        .eq('id', id)
        .eq('device_id', deviceId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commitments', 'anonymous', deviceId] });
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

  return {
    updateCommitmentMutation,
    completeCommitmentMutation
  };
};
