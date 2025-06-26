
-- Create subscription configuration table
CREATE TABLE public.subscription_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  config_key TEXT NOT NULL UNIQUE,
  config_value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Insert default configuration values
INSERT INTO public.subscription_config (config_key, config_value, description) VALUES
('subscription_duration_days', '30', 'Number of days for premium subscription period'),
('subscription_price_baiza', '1400', 'Subscription price in baiza (14 OMR)'),
('subscription_price_omr', '14', 'Subscription price in OMR for display');

-- Enable RLS on subscription_config table
ALTER TABLE public.subscription_config ENABLE ROW LEVEL SECURITY;

-- Create policy that allows everyone to read config (needed for the app to function)
CREATE POLICY "Anyone can view subscription config" 
  ON public.subscription_config 
  FOR SELECT 
  TO public
  USING (true);

-- No INSERT/UPDATE/DELETE policies - only superuser/admin can modify
-- This ensures only database administrators can change the configuration

-- Create function to get subscription configuration
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
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Create function to get all subscription configuration as JSON
CREATE OR REPLACE FUNCTION public.get_subscription_config_json()
RETURNS JSON AS $$
BEGIN
  RETURN (
    SELECT json_object_agg(config_key, config_value)
    FROM public.subscription_config
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;
