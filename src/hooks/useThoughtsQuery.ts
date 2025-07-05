
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { getDeviceId } from '@/utils/deviceId';

export const useThoughtsQuery = (selectedTag: string | null) => {
  const { user } = useAuth();
  const deviceId = getDeviceId();
  
  return useQuery({
    queryKey: ['thoughts', 'active', selectedTag, user?.id, deviceId],
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

      // Filter by user or device based on authentication status
      if (user?.id) {
        query = query.eq('user_id', user.id);
      } else {
        query = query.eq('device_id', deviceId);
      }
      
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
