
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { getDeviceId } from '@/utils/deviceId';

export const useAnonymousCommitments = () => {
  const deviceId = getDeviceId();
  
  return useQuery({
    queryKey: ['commitments', 'anonymous', deviceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('commitments')
        .select('*')
        .eq('device_id', deviceId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Map database fields to UI fields
      return data?.map(commitment => ({
        ...commitment,
        nextAction: commitment.nextaction
      })) || [];
    },
    enabled: !!deviceId
  });
};
