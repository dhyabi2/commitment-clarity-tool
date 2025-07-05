
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useToast } from "@/hooks/use-toast";
import { getDeviceId } from '@/utils/deviceId';
import { useAnonymousMode } from '@/hooks/useAnonymousMode';

export const useDeviceDataMigration = () => {
  const { toast } = useToast();
  const { disableAnonymousMode } = useAnonymousMode();
  const deviceId = getDeviceId();

  const migrationMutation = useMutation({
    mutationFn: async (userId: string) => {
      console.log('Starting device data migration...', { deviceId, userId });
      
      const { error } = await supabase
        .rpc('migrate_device_data_to_user', {
          p_device_id: deviceId,
          p_user_id: userId
        });

      if (error) {
        console.error('Migration error:', error);
        throw error;
      }

      console.log('Device data migration completed successfully');
      return true;
    },
    onSuccess: () => {
      // Disable anonymous mode after successful migration
      disableAnonymousMode();
      
      toast({
        title: "Data migrated successfully",
        description: "Your anonymous data has been linked to your account.",
      });
    },
    onError: (error: any) => {
      console.error('Failed to migrate device data:', error);
      
      toast({
        title: "Migration failed",
        description: "Failed to migrate your anonymous data. Please try again.",
        variant: "destructive",
      });
    }
  });

  return {
    migrateDeviceData: migrationMutation.mutate,
    isMigrating: migrationMutation.isPending
  };
};
