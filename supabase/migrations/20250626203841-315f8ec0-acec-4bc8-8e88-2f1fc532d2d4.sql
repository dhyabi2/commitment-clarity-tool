
-- Fix the handle_new_user function to use secure search_path (it was missing SET search_path)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  -- Insert profile for new user, handling both Google OAuth and email/password signup
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    new.id,
    new.email,
    COALESCE(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      split_part(new.email, '@', 1)  -- fallback to email username
    ),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
    updated_at = timezone('utc'::text, now());
  
  RETURN new;
END;
$function$;

-- Enhance subscription_config table security by restricting public access
-- Remove the overly permissive policy
DROP POLICY IF EXISTS "Anyone can view subscription config" ON public.subscription_config;

-- Create a more secure policy that only allows authenticated users to read config
CREATE POLICY "Authenticated users can view subscription config" 
  ON public.subscription_config 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Add an audit trigger for subscription changes (optional security enhancement)
CREATE OR REPLACE FUNCTION public.audit_subscription_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  -- Log subscription status changes for security monitoring
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.audit_log (table_name, record_id, action, old_values, new_values, user_id, timestamp)
    VALUES (
      'subscriptions',
      NEW.id,
      'status_change',
      json_build_object('status', OLD.status),
      json_build_object('status', NEW.status),
      NEW.user_id,
      now()
    );
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Create audit log table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  action TEXT NOT NULL,
  old_values JSONB,
  new_values JSONB,
  user_id UUID,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Only allow viewing audit logs for admins (you can adjust this policy as needed)
CREATE POLICY "Admins can view audit logs" 
  ON public.audit_log 
  FOR SELECT 
  USING (false); -- Restrict access - can be modified later for admin access

-- Create the audit trigger
DROP TRIGGER IF EXISTS subscription_audit_trigger ON public.subscriptions;
CREATE TRIGGER subscription_audit_trigger
  AFTER UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.audit_subscription_changes();
