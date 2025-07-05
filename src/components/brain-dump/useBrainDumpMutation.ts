
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { useAnonymousMode } from '@/hooks/useAnonymousMode';
import { getDeviceId } from '@/utils/deviceId';

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
} = {}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { isAnonymous } = useAnonymousMode();
  const deviceId = getDeviceId();

  const addThoughtMutation = useMutation({
    mutationFn: async ({ content, tags }: BrainDumpData) => {
      console.log('Adding thought...', { 
        hasUser: !!user, 
        isAnonymous, 
        deviceId: deviceId.substring(0, 8) + '...' 
      });

      // Determine if user is authenticated or anonymous
      if (user && !isAnonymous) {
        // Authenticated user path
        console.log('Processing as authenticated user...', user.id);
        
        const { data: canCreate, error: checkError } = await supabase
          .rpc('can_create_thought', { p_user_id: user.id });

        if (checkError) {
          console.error('Error checking thought limit:', checkError);
          throw checkError;
        }

        console.log('User can create thought:', canCreate);

        if (!canCreate) {
          console.log('Monthly thought limit reached, triggering onLimitReached');
          const error = new Error('Monthly thought limit reached');
          error.name = 'LIMIT_REACHED';
          throw error;
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

        // Increment usage count for user
        const { error: usageError } = await supabase
          .rpc('increment_usage_count', { p_user_id: user.id });

        if (usageError) {
          console.error('Error incrementing usage:', usageError);
        }

        // Handle tags if provided
        if (tags.length > 0) {
          await handleTags(tags, thought.id);
        }

        return thought;
      } else {
        // Anonymous device path
        console.log('Processing as anonymous user...', deviceId.substring(0, 8) + '...');
        
        const { data: canCreate, error: checkError } = await supabase
          .rpc('can_create_thought_by_device', { p_device_id: deviceId });

        if (checkError) {
          console.error('Error checking thought limit:', checkError);
          throw checkError;
        }

        console.log('Device can create thought:', canCreate);

        if (!canCreate) {
          console.log('Monthly thought limit reached for device, triggering onLimitReached');
          const error = new Error('Monthly thought limit reached');
          error.name = 'LIMIT_REACHED';
          throw error;
        }

        // Update device session
        await supabase.rpc('update_device_session', { p_device_id: deviceId });

        const { data: thought, error: thoughtError } = await supabase
          .from('thoughts')
          .insert([{ 
            content, 
            completed: false,
            device_id: deviceId
          }])
          .select()
          .single();

        if (thoughtError) {
          console.error('Error inserting thought:', thoughtError);
          throw thoughtError;
        }

        console.log('Thought created successfully:', thought);

        // Increment usage count for device
        const { error: usageError } = await supabase
          .rpc('increment_usage_count_by_device', { p_device_id: deviceId });

        if (usageError) {
          console.error('Error incrementing usage:', usageError);
        }

        // Handle tags if provided
        if (tags.length > 0) {
          await handleTags(tags, thought.id);
        }

        return thought;
      }
    },
    onSuccess: () => {
      // Invalidate queries for both authenticated and anonymous users
      queryClient.invalidateQueries({ queryKey: ['thoughts'] });
      toast({
        title: "Thought added",
        description: "Your thought has been captured successfully.",
      });
      onSuccess?.();
    },
    onError: (error: any) => {
      console.error('Error adding thought:', error);
      
      if (error.name === 'LIMIT_REACHED' || error.message === 'Monthly thought limit reached') {
        onLimitReached?.();
        return;
      }
      
      toast({
        title: "Error",
        description: "Failed to add thought. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Helper function to handle tags
  const handleTags = async (tags: string[], thoughtId: number) => {
    try {
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
            thought_id: thoughtId,
            tag_id: tag.id
          }))
        );

      if (relationError) {
        console.error('Error creating thought-tag relations:', relationError);
        throw relationError;
      }

      console.log('Tags added successfully');
    } catch (error) {
      console.error('Error handling tags:', error);
      // Don't throw here - tags are secondary to the main thought creation
    }
  };

  return { addThoughtMutation };
};
