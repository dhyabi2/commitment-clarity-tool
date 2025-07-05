
-- Fix the usage_tracking table to properly support anonymous device usage
-- Make user_id nullable and add proper constraints

ALTER TABLE public.usage_tracking ALTER COLUMN user_id DROP NOT NULL;

-- Add constraint to ensure either user_id OR device_id is present (but not both)
ALTER TABLE public.usage_tracking ADD CONSTRAINT usage_tracking_user_or_device_check 
CHECK (
  (user_id IS NOT NULL AND device_id IS NULL) OR 
  (user_id IS NULL AND device_id IS NOT NULL)
);

-- Update the unique constraint to handle both scenarios
ALTER TABLE public.usage_tracking DROP CONSTRAINT IF EXISTS usage_tracking_user_id_month_year_key;
ALTER TABLE public.usage_tracking DROP CONSTRAINT IF EXISTS usage_tracking_device_id_month_year_key;

-- Create a unique index that handles both user and device scenarios
CREATE UNIQUE INDEX usage_tracking_user_month_unique 
ON public.usage_tracking (user_id, month_year) 
WHERE user_id IS NOT NULL;

CREATE UNIQUE INDEX usage_tracking_device_month_unique 
ON public.usage_tracking (device_id, month_year) 
WHERE device_id IS NOT NULL;

-- Update the increment_usage_count_by_device function to handle the new schema
CREATE OR REPLACE FUNCTION public.increment_usage_count_by_device(p_device_id UUID)
RETURNS INTEGER AS $$
DECLARE
  current_month TEXT;
  new_count INTEGER;
BEGIN
  current_month := to_char(now(), 'YYYY-MM');
  
  INSERT INTO public.usage_tracking (device_id, month_year, thoughts_count, user_id)
  VALUES (p_device_id, current_month, 1, NULL)
  ON CONFLICT (device_id, month_year) 
  WHERE device_id IS NOT NULL
  DO UPDATE SET 
    thoughts_count = usage_tracking.thoughts_count + 1,
    updated_at = now()
  RETURNING thoughts_count INTO new_count;
  
  RETURN new_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Also update the get_current_month_usage_by_device function for consistency
CREATE OR REPLACE FUNCTION public.get_current_month_usage_by_device(p_device_id UUID)
RETURNS INTEGER AS $$
DECLARE
  current_month TEXT;
  usage_count INTEGER;
BEGIN
  current_month := to_char(now(), 'YYYY-MM');
  
  SELECT thoughts_count INTO usage_count
  FROM public.usage_tracking
  WHERE device_id = p_device_id AND month_year = current_month AND user_id IS NULL;
  
  RETURN COALESCE(usage_count, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the data migration function to properly handle usage tracking
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
  
  -- Migrate usage tracking - merge device usage with user usage
  INSERT INTO public.usage_tracking (user_id, month_year, thoughts_count)
  SELECT p_user_id, month_year, thoughts_count
  FROM public.usage_tracking 
  WHERE device_id = p_device_id
  ON CONFLICT (user_id, month_year) 
  WHERE user_id IS NOT NULL
  DO UPDATE SET 
    thoughts_count = usage_tracking.thoughts_count + EXCLUDED.thoughts_count,
    updated_at = now();
  
  -- Remove device usage tracking after migration
  DELETE FROM public.usage_tracking WHERE device_id = p_device_id;
  
  -- Remove device session
  DELETE FROM public.device_sessions WHERE device_id = p_device_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
