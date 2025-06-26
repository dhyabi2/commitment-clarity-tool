
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/components/ui/use-toast";

export const useSubscription = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: subscription, isLoading: subscriptionLoading } = useQuery({
    queryKey: ['subscription', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // Create default subscription record
        const { data: newSub, error: createError } = await supabase
          .from('subscriptions')
          .insert([{
            user_id: user.id,
            status: 'free',
            plan_type: 'free'
          }])
          .select()
          .single();

        if (createError) throw createError;
        return newSub;
      }

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  const { data: usage, isLoading: usageLoading } = useQuery({
    queryKey: ['usage', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
      
      const { data, error } = await supabase
        .from('usage_tracking')
        .select('thoughts_count')
        .eq('user_id', user.id)
        .eq('month_year', currentMonth)
        .single();

      if (error && error.code === 'PGRST116') {
        return { thoughts_count: 0 };
      }

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  const createSubscriptionMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase.functions.invoke('create-subscription', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      window.location.href = data.checkout_url;
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create subscription. Please try again.",
        variant: "destructive",
      });
    }
  });

  const isPremium = subscription?.status === 'active' && subscription?.plan_type === 'premium';
  const currentUsage = usage?.thoughts_count || 0;
  const canCreateThought = isPremium || currentUsage < 20;
  const isNearLimit = !isPremium && currentUsage >= 18;
  const hasExceededLimit = !isPremium && currentUsage >= 20;

  return {
    subscription,
    usage: currentUsage,
    isPremium,
    canCreateThought,
    isNearLimit,
    hasExceededLimit,
    isLoading: subscriptionLoading || usageLoading,
    createSubscription: () => createSubscriptionMutation.mutate(),
    isCreatingSubscription: createSubscriptionMutation.isPending
  };
};
