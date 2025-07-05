
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { useAnonymousMode } from '@/hooks/useAnonymousMode';
import { getDeviceId } from '@/utils/deviceId';

export const useThoughtsMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { isAnonymous } = useAnonymousMode();
  const deviceId = getDeviceId();

  const addTagMutation = useMutation({
    mutationFn: async ({ thoughtId, tagName }: { thoughtId: number; tagName: string }) => {
      const { data: tagData, error: tagError } = await supabase
        .from('tags')
        .upsert({ name: tagName }, { onConflict: 'name' })
        .select()
        .single();
      
      if (tagError) throw tagError;

      const { error: relationError } = await supabase
        .from('thought_tags')
        .insert({ thought_id: thoughtId, tag_id: tagData.id });

      if (relationError) throw relationError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['thoughts'] });
      toast({
        title: "Tag added",
        description: "The tag has been added to your thought.",
      });
    },
    onError: (error) => {
      console.error('Error adding tag:', error);
      toast({
        title: "Failed to add tag",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  });

  const deleteThoughtMutation = useMutation({
    mutationFn: async (thoughtId: number) => {
      let query = supabase.from('thoughts').delete().eq('id', thoughtId);
      
      if (user?.id && !isAnonymous) {
        query = query.eq('user_id', user.id);
      } else if (isAnonymous || !user) {
        query = query.eq('device_id', deviceId);
      } else {
        throw new Error('Invalid user state');
      }
      
      const { error } = await query;
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['thoughts'] });
      toast({
        title: "Thought deleted",
        description: "Your thought has been successfully removed.",
      });
    },
    onError: (error) => {
      console.error('Error deleting thought:', error);
      toast({
        title: "Failed to delete thought",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  });

  const toggleCompleteMutation = useMutation({
    mutationFn: async ({ thoughtId, completed }: { thoughtId: number; completed: boolean }) => {
      let query = supabase.from('thoughts').update({ completed }).eq('id', thoughtId);
      
      if (user?.id && !isAnonymous) {
        query = query.eq('user_id', user.id);
      } else if (isAnonymous || !user) {
        query = query.eq('device_id', deviceId);
      } else {
        throw new Error('Invalid user state');
      }
      
      const { error } = await query;
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['thoughts'] });
      queryClient.invalidateQueries({ queryKey: ['completed-thoughts'] });
      toast({
        title: "Thought updated",
        description: "The thought status has been updated.",
      });
    },
    onError: (error) => {
      console.error('Error updating thought:', error);
      toast({
        title: "Failed to update thought",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  });

  return {
    addTagMutation,
    deleteThoughtMutation,
    toggleCompleteMutation
  };
};
