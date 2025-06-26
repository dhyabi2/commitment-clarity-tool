
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';

interface BrainDumpData {
  content: string;
  tags: string[];
}

export const useBrainDumpMutation = ({ 
  onSuccess, 
  onLimitReached 
}: { 
  onSuccess?: () => void;
  onLimitReached?: () => void;
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const addThoughtMutation = useMutation({
    mutationFn: async ({ content, tags }: BrainDumpData) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      // Check if user can create thought
      const { data: canCreate, error: checkError } = await supabase
        .rpc('can_create_thought', { p_user_id: user.id });

      if (checkError) throw checkError;

      if (!canCreate) {
        onLimitReached?.();
        throw new Error('Monthly thought limit reached');
      }

      console.log('Adding thought for user:', user.id);
      console.log('Thought content:', content);
      console.log('Tags:', tags);

      // First, ensure the user has a profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code === 'PGRST116') {
        // Profile doesn't exist, create it
        console.log('Creating profile for user:', user.id);
        const { error: createProfileError } = await supabase
          .from('profiles')
          .insert([{
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0],
            avatar_url: user.user_metadata?.avatar_url
          }]);

        if (createProfileError) {
          console.error('Error creating profile:', createProfileError);
          throw createProfileError;
        }
      } else if (profileError) {
        console.error('Error checking profile:', profileError);
        throw profileError;
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

      if (thoughtError) {
        console.error('Error inserting thought:', thoughtError);
        throw thoughtError;
      }

      console.log('Thought created successfully:', thought);

      // Increment usage count
      const { error: usageError } = await supabase
        .rpc('increment_usage_count', { p_user_id: user.id });

      if (usageError) {
        console.error('Error incrementing usage:', usageError);
      }

      if (tags.length > 0) {
        console.log('Adding tags:', tags);
        
        const { error: tagError } = await supabase
          .from('tags')
          .upsert(
            tags.map(tag => ({ name: tag })),
            { onConflict: 'name' }
          );

        if (tagError) {
          console.error('Error upserting tags:', tagError);
          throw tagError;
        }

        const { data: existingTags, error: existingTagsError } = await supabase
          .from('tags')
          .select('*')
          .in('name', tags);

        if (existingTagsError) {
          console.error('Error fetching existing tags:', existingTagsError);
          throw existingTagsError;
        }

        const { error: relationError } = await supabase
          .from('thought_tags')
          .insert(
            existingTags.map(tag => ({
              thought_id: thought.id,
              tag_id: tag.id
            }))
          );

        if (relationError) {
          console.error('Error creating thought-tag relations:', relationError);
          throw relationError;
        }

        console.log('Tags added successfully');
      }

      return thought;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['thoughts'] });
      queryClient.invalidateQueries({ queryKey: ['usage'] });
      toast({
        title: "Thought added",
        description: "Your thought has been captured successfully.",
      });
      onSuccess?.();
    },
    onError: (error) => {
      console.error('Error adding thought:', error);
      if (error.message !== 'Monthly thought limit reached') {
        toast({
          title: "Error",
          description: "Failed to add thought. Please try again.",
          variant: "destructive",
        });
      }
    }
  });

  return { addThoughtMutation };
};
