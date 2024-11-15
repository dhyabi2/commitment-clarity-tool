import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useToast } from "@/components/ui/use-toast";
import { getDeviceId } from '@/utils/deviceId';

export const useThoughtsMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
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
    }
  });

  const deleteThoughtMutation = useMutation({
    mutationFn: async (thoughtId: number) => {
      const { error } = await supabase
        .from('thoughts')
        .delete()
        .eq('id', thoughtId)
        .eq('device_id', deviceId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['thoughts'] });
      toast({
        title: "Thought deleted",
        description: "Your thought has been successfully removed.",
      });
    }
  });

  const toggleCompleteMutation = useMutation({
    mutationFn: async ({ thoughtId, completed }: { thoughtId: number; completed: boolean }) => {
      const { error } = await supabase
        .from('thoughts')
        .update({ completed })
        .eq('id', thoughtId)
        .eq('device_id', deviceId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['thoughts'] });
      queryClient.invalidateQueries({ queryKey: ['completed-thoughts'] });
      toast({
        title: "Thought updated",
        description: "The thought status has been updated.",
      });
    }
  });

  return {
    addTagMutation,
    deleteThoughtMutation,
    toggleCompleteMutation
  };
};