
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';

interface BrainDumpData {
  content: string;
  tags: string[];
}

export const useBrainDumpMutation = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const addThoughtMutation = useMutation({
    mutationFn: async ({ content, tags }: BrainDumpData) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const { data: thought, error: thoughtError } = await supabase
        .from('thoughts')
        .insert([{ 
          content, 
          completed: false,
          user_id: user.id
        }])
        .select()
        .single();

      if (thoughtError) throw thoughtError;

      if (tags.length > 0) {
        const { error: tagError } = await supabase
          .from('tags')
          .upsert(
            tags.map(tag => ({ name: tag })),
            { onConflict: 'name' }
          );

        if (tagError) throw tagError;

        const { data: existingTags, error: existingTagsError } = await supabase
          .from('tags')
          .select('*')
          .in('name', tags);

        if (existingTagsError) throw existingTagsError;

        const { error: relationError } = await supabase
          .from('thought_tags')
          .insert(
            existingTags.map(tag => ({
              thought_id: thought.id,
              tag_id: tag.id
            }))
          );

        if (relationError) throw relationError;
      }

      return thought;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['thoughts'] });
      toast({
        title: "Thought added",
        description: "Your thought has been captured successfully.",
      });
      onSuccess?.();
    },
    onError: (error) => {
      console.error('Error adding thought:', error);
      toast({
        title: "Error",
        description: "Failed to add thought. Please try again.",
        variant: "destructive",
      });
    }
  });

  return { addThoughtMutation };
};
