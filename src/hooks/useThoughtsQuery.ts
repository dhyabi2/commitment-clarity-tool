
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useAnonymousMode } from '@/hooks/useAnonymousMode';
import { getDeviceId } from '@/utils/deviceId';

export const useThoughtsQuery = (selectedTag: string | null) => {
  const { user } = useAuth();
  const { isAnonymous } = useAnonymousMode();
  const deviceId = getDeviceId();
  
  return useQuery({
    queryKey: ['thoughts', 'active', selectedTag, user?.id, deviceId, isAnonymous],
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
      if (user?.id && !isAnonymous) {
        query = query.eq('user_id', user.id);
      } else if (isAnonymous || !user) {
        query = query.eq('device_id', deviceId);
      } else {
        // No user and not anonymous - return empty array
        return [];
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching thoughts:', error);
        throw error;
      }

      const transformedData = (data || []).map(thought => ({
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
    },
    enabled: !!(user || isAnonymous), // Only run query if user is authenticated or in anonymous mode
    staleTime: 30000, // Cache for 30 seconds
  });
};
