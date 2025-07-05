
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useToast } from "@/hooks/use-toast";
import { getDeviceId } from '@/utils/deviceId';

export const useAnonymousMigration = () => {
  const { toast } = useToast();

  const migrateAnonymousDataMutation = useMutation({
    mutationFn: async (userId: string) => {
      const deviceId = getDeviceId();
      
      console.log('Starting anonymous data migration...', { deviceId, userId });
      
      // Call the Supabase function to migrate device data to user
      const { error } = await supabase.rpc('migrate_device_data_to_user', {
        p_device_id: deviceId,
        p_user_id: userId
      });

      if (error) {
        console.error('Migration error:', error);
        throw error;
      }

      console.log('Anonymous data migration completed successfully');
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Data migrated successfully",
        description: "Your anonymous data has been transferred to your account.",
      });
    },
    onError: (error) => {
      console.error('Failed to migrate anonymous data:', error);
      toast({
        title: "Migration failed",
        description: "Failed to transfer your anonymous data. Your data is still safe.",
        variant: "destructive",
      });
    }
  });

  const checkHasAnonymousData = async (): Promise<boolean> => {
    const deviceId = getDeviceId();
    
    try {
      // Check if device has any thoughts
      const { data: thoughts, error: thoughtsError } = await supabase
        .from('thoughts')
        .select('id')
        .eq('device_id', deviceId)
        .limit(1);

      if (thoughtsError) {
        console.error('Error checking anonymous thoughts:', thoughtsError);
        return false;
      }

      // Check if device has any commitments
      const { data: commitments, error: commitmentsError } = await supabase
        .from('commitments')
        .select('id')
        .eq('device_id', deviceId)
        .limit(1);

      if (commitmentsError) {
        console.error('Error checking anonymous commitments:', commitmentsError);
        return false;
      }

      return (thoughts?.length || 0) > 0 || (commitments?.length || 0) > 0;
    } catch (error) {
      console.error('Error checking for anonymous data:', error);
      return false;
    }
  };

  return {
    migrateAnonymousDataMutation,
    checkHasAnonymousData
  };
};
