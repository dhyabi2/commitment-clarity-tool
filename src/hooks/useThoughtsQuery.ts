import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export const useThoughtsQuery = (selectedTag: string | null) => {
  return useQuery({
    queryKey: ['thoughts', 'active', selectedTag],
    queryFn: async () => {
      let query = supabase
        .from('thoughts')
        .select(`
          *,
          tags:thought_tags(
            tag:tags(*)
          )
        `)
        .eq('completed', false)
        .order('created_at', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) throw error;

      const transformedData = data.map(thought => ({
        ...thought,
        tags: thought.tags
          ?.map(t => t.tag)
          .filter(Boolean)
          .sort((a, b) => a.name.localeCompare(b.name))
      }));

      if (selectedTag) {
        return transformedData.filter(thought => 
          thought.tags?.some(tag => tag.name === selectedTag)
        );
      }

      return transformedData;
    }
  });
};