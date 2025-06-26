
-- Add free tier thought limit configuration
INSERT INTO public.subscription_config (config_key, config_value, description) VALUES
('free_tier_thought_limit', '20', 'Maximum number of thoughts allowed for free tier users per month');

-- Update the can_create_thought function to use configurable limit
CREATE OR REPLACE FUNCTION public.can_create_thought(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  current_usage INTEGER;
  subscription_status TEXT;
  free_limit INTEGER;
BEGIN
  -- Get current subscription status
  SELECT status INTO subscription_status
  FROM public.subscriptions
  WHERE user_id = p_user_id;
  
  -- If premium subscription, always allow
  IF subscription_status = 'active' THEN
    RETURN TRUE;
  END IF;
  
  -- Get configurable free tier limit
  SELECT config_value::INTEGER INTO free_limit
  FROM public.subscription_config
  WHERE config_key = 'free_tier_thought_limit';
  
  -- Default to 20 if not configured
  IF free_limit IS NULL THEN
    free_limit := 20;
  END IF;
  
  -- Check usage for free tier
  current_usage := public.get_current_month_usage(p_user_id);
  
  RETURN current_usage < free_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a helper function to get the free tier limit
CREATE OR REPLACE FUNCTION public.get_free_tier_limit()
RETURNS INTEGER AS $$
DECLARE
  free_limit INTEGER;
BEGIN
  SELECT config_value::INTEGER INTO free_limit
  FROM public.subscription_config
  WHERE config_key = 'free_tier_thought_limit';
  
  -- Default to 20 if not configured
  RETURN COALESCE(free_limit, 20);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;
