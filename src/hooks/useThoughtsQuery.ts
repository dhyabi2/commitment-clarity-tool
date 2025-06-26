
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
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching thoughts:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!userId,
  });
};
