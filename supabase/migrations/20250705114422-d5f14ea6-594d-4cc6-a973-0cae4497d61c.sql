
-- Update RLS policies for thoughts table to allow device-based access
DROP POLICY IF EXISTS "Users can view their own thoughts" ON public.thoughts;
DROP POLICY IF EXISTS "Users can create their own thoughts" ON public.thoughts;
DROP POLICY IF EXISTS "Users can update their own thoughts" ON public.thoughts;
DROP POLICY IF EXISTS "Users can delete their own thoughts" ON public.thoughts;

-- New policies for thoughts - support both authenticated and device-based access
CREATE POLICY "Users and devices can view their own thoughts" 
  ON public.thoughts 
  FOR SELECT 
  USING (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR 
    (auth.uid() IS NULL AND device_id IS NOT NULL)
  );

CREATE POLICY "Users and devices can create their own thoughts" 
  ON public.thoughts 
  FOR INSERT 
  WITH CHECK (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id AND device_id IS NULL) OR 
    (auth.uid() IS NULL AND user_id IS NULL AND device_id IS NOT NULL)
  );

CREATE POLICY "Users and devices can update their own thoughts" 
  ON public.thoughts 
  FOR UPDATE 
  USING (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR 
    (auth.uid() IS NULL AND device_id IS NOT NULL)
  );

CREATE POLICY "Users and devices can delete their own thoughts" 
  ON public.thoughts 
  FOR DELETE 
  USING (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR 
    (auth.uid() IS NULL AND device_id IS NOT NULL)
  );

-- Update RLS policies for commitments table
DROP POLICY IF EXISTS "Users can view their own commitments" ON public.commitments;
DROP POLICY IF EXISTS "Users can create their own commitments" ON public.commitments;
DROP POLICY IF EXISTS "Users can update their own commitments" ON public.commitments;
DROP POLICY IF EXISTS "Users can delete their own commitments" ON public.commitments;

CREATE POLICY "Users and devices can view their own commitments" 
  ON public.commitments 
  FOR SELECT 
  USING (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR 
    (auth.uid() IS NULL AND device_id IS NOT NULL)
  );

CREATE POLICY "Users and devices can create their own commitments" 
  ON public.commitments 
  FOR INSERT 
  WITH CHECK (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id AND device_id IS NULL) OR 
    (auth.uid() IS NULL AND user_id IS NULL AND device_id IS NOT NULL)
  );

CREATE POLICY "Users and devices can update their own commitments" 
  ON public.commitments 
  FOR UPDATE 
  USING (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR 
    (auth.uid() IS NULL AND device_id IS NOT NULL)
  );

CREATE POLICY "Users and devices can delete their own commitments" 
  ON public.commitments 
  FOR DELETE 
  USING (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR 
    (auth.uid() IS NULL AND device_id IS NOT NULL)
  );

-- Create device sessions table for anonymous usage tracking
CREATE TABLE public.device_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id UUID NOT NULL UNIQUE,
  first_seen TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_activity TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  thoughts_count INTEGER NOT NULL DEFAULT 0,
  commitments_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for device sessions (public access for device-based operations)
ALTER TABLE public.device_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view device sessions" 
  ON public.device_sessions 
  FOR SELECT 
  TO public 
  USING (true);

CREATE POLICY "Anyone can create device sessions" 
  ON public.device_sessions 
  FOR INSERT 
  TO public 
  WITH CHECK (true);

CREATE POLICY "Anyone can update device sessions" 
  ON public.device_sessions 
  FOR UPDATE 
  TO public 
  USING (true);

-- Add device-based usage tracking to existing usage_tracking table
ALTER TABLE public.usage_tracking ADD COLUMN device_id UUID;
ALTER TABLE public.usage_tracking ADD UNIQUE (device_id, month_year);

-- Update RLS policies for usage tracking to support device access
DROP POLICY IF EXISTS "Users can view their own usage" ON public.usage_tracking;
DROP POLICY IF EXISTS "Users can update their own usage" ON public.usage_tracking;

CREATE POLICY "Users and devices can view their own usage" 
  ON public.usage_tracking 
  FOR SELECT 
  USING (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR 
    (auth.uid() IS NULL AND device_id IS NOT NULL)
  );

CREATE POLICY "Users and devices can update their own usage" 
  ON public.usage_tracking 
  FOR ALL 
  USING (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR 
    (auth.uid() IS NULL AND device_id IS NOT NULL)
  );

-- Update database functions to support device-based access
CREATE OR REPLACE FUNCTION public.get_current_month_usage_by_device(p_device_id UUID)
RETURNS INTEGER AS $$
DECLARE
  current_month TEXT;
  usage_count INTEGER;
BEGIN
  current_month := to_char(now(), 'YYYY-MM');
  
  SELECT thoughts_count INTO usage_count
  FROM public.usage_tracking
  WHERE device_id = p_device_id AND month_year = current_month;
  
  RETURN COALESCE(usage_count, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment usage count for device
CREATE OR REPLACE FUNCTION public.increment_usage_count_by_device(p_device_id UUID)
RETURNS INTEGER AS $$
DECLARE
  current_month TEXT;
  new_count INTEGER;
BEGIN
  current_month := to_char(now(), 'YYYY-MM');
  
  INSERT INTO public.usage_tracking (device_id, month_year, thoughts_count)
  VALUES (p_device_id, current_month, 1)
  ON CONFLICT (device_id, month_year) 
  DO UPDATE SET 
    thoughts_count = usage_tracking.thoughts_count + 1,
    updated_at = now()
  RETURNING thoughts_count INTO new_count;
  
  RETURN new_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update can_create_thought function to support device access
CREATE OR REPLACE FUNCTION public.can_create_thought_by_device(p_device_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  current_usage INTEGER;
  free_limit INTEGER;
BEGIN
  -- Get configurable free tier limit
  SELECT config_value::INTEGER INTO free_limit
  FROM public.subscription_config
  WHERE config_key = 'free_tier_thought_limit';
  
  -- Default to 20 if not configured
  IF free_limit IS NULL THEN
    free_limit := 20;
  END IF;
  
  -- If limit is 0, allow unlimited usage
  IF free_limit = 0 THEN
    RETURN TRUE;
  END IF;
  
  -- Check usage for device
  current_usage := public.get_current_month_usage_by_device(p_device_id);
  
  RETURN current_usage < free_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update or create device session
CREATE OR REPLACE FUNCTION public.update_device_session(p_device_id UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.device_sessions (device_id, last_activity)
  VALUES (p_device_id, now())
  ON CONFLICT (device_id) 
  DO UPDATE SET 
    last_activity = now(),
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to migrate device data to user account
CREATE OR REPLACE FUNCTION public.migrate_device_data_to_user(p_device_id UUID, p_user_id UUID)
RETURNS VOID AS $$
BEGIN
  -- Update thoughts to belong to user
  UPDATE public.thoughts 
  SET user_id = p_user_id, device_id = NULL 
  WHERE device_id = p_device_id;
  
  -- Update commitments to belong to user
  UPDATE public.commitments 
  SET user_id = p_user_id, device_id = NULL 
  WHERE device_id = p_device_id;
  
  -- Migrate usage tracking
  UPDATE public.usage_tracking 
  SET user_id = p_user_id, device_id = NULL 
  WHERE device_id = p_device_id;
  
  -- Remove device session
  DELETE FROM public.device_sessions WHERE device_id = p_device_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
