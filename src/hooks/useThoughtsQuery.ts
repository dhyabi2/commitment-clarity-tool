
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useThoughtsQuery = (userId: string | null) => {
  return useQuery({
    queryKey: ['thoughts', userId],
    queryFn: async () => {
      if (!userId) {
        return [];
      }

      const { data, error } = await supabase
        .from('thoughts')
        .select(`
          *,
          tags:thought_tags(
            tag:tags(
              id,
              name
            )
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching thoughts:', error);
        throw error;
      }

      // Transform the data to match the expected format
      const transformedData = (data || []).map(thought => ({
        ...thought,
        tags: thought.tags?.map((tagRelation: any) => tagRelation.tag).filter(Boolean) || []
      }));

      return transformedData;
    },
    enabled: !!userId,
  });
};
