
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { getDeviceId } from '@/utils/deviceId';

export const useDeviceThoughtsQuery = (selectedTag: string | null) => {
  const deviceId = getDeviceId();
  
  return useQuery({
    queryKey: ['device-thoughts', 'active', selectedTag, deviceId],
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
        .eq('device_id', deviceId)
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
