
-- Fix security warnings by setting immutable search_path for all functions

-- Update get_current_month_usage function with secure search_path
CREATE OR REPLACE FUNCTION public.get_current_month_usage(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  current_month TEXT;
  usage_count INTEGER;
BEGIN
  current_month := to_char(now(), 'YYYY-MM');
  
  SELECT thoughts_count INTO usage_count
  FROM public.usage_tracking
  WHERE user_id = p_user_id AND month_year = current_month;
  
  RETURN COALESCE(usage_count, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path TO '';

-- Update increment_usage_count function with secure search_path
CREATE OR REPLACE FUNCTION public.increment_usage_count(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  current_month TEXT;
  new_count INTEGER;
BEGIN
  current_month := to_char(now(), 'YYYY-MM');
  
  INSERT INTO public.usage_tracking (user_id, month_year, thoughts_count)
  VALUES (p_user_id, current_month, 1)
  ON CONFLICT (user_id, month_year) 
  DO UPDATE SET 
    thoughts_count = usage_tracking.thoughts_count + 1,
    updated_at = now()
  RETURNING thoughts_count INTO new_count;
  
  RETURN new_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path TO '';

-- Update can_create_thought function with secure search_path
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
  
  -- If limit is 0, allow unlimited usage for free tier
  IF free_limit = 0 THEN
    RETURN TRUE;
  END IF;
  
  -- Check usage for free tier with actual limit
  current_usage := public.get_current_month_usage(p_user_id);
  
  RETURN current_usage < free_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path TO '';

-- Update get_subscription_config function with secure search_path
CREATE OR REPLACE FUNCTION public.get_subscription_config(p_config_key TEXT)
RETURNS TEXT AS $$
DECLARE
  config_value TEXT;
BEGIN
  SELECT config_value INTO config_value
  FROM public.subscription_config
  WHERE config_key = p_config_key;
  
  RETURN config_value;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path TO '';

-- Update get_subscription_config_json function with secure search_path
CREATE OR REPLACE FUNCTION public.get_subscription_config_json()
RETURNS JSON AS $$
BEGIN
  RETURN (
    SELECT json_object_agg(config_key, config_value)
    FROM public.subscription_config
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path TO '';

-- Update get_free_tier_limit function with secure search_path
CREATE OR REPLACE FUNCTION public.get_free_tier_limit()
RETURNS INTEGER AS $$
DECLARE
  free_limit INTEGER;
BEGIN
  SELECT config_value::INTEGER INTO free_limit
  FROM public.subscription_config
  WHERE config_key = 'free_tier_thought_limit';
  
  -- Return the configured value (including 0 for unlimited) or default to 20
  RETURN COALESCE(free_limit, 20);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path TO '';
