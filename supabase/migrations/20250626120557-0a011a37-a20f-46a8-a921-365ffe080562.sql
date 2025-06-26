
-- Create subscriptions table to track user subscription status
CREATE TABLE public.subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  thawani_customer_id TEXT,
  thawani_subscription_id TEXT,
  status TEXT NOT NULL DEFAULT 'free' CHECK (status IN ('free', 'active', 'cancelled', 'past_due')),
  plan_type TEXT NOT NULL DEFAULT 'free' CHECK (plan_type IN ('free', 'premium')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Create payments table for payment history
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  thawani_payment_id TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'OMR',
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Create usage tracking table for monthly thought counts
CREATE TABLE public.usage_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  month_year TEXT NOT NULL, -- Format: YYYY-MM
  thoughts_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, month_year)
);

-- Add RLS policies for subscriptions
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscription" 
  ON public.subscriptions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription" 
  ON public.subscriptions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Add RLS policies for payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payments" 
  ON public.payments 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Add RLS policies for usage tracking
ALTER TABLE public.usage_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own usage" 
  ON public.usage_tracking 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own usage" 
  ON public.usage_tracking 
  FOR ALL 
  USING (auth.uid() = user_id);

-- Create function to get current month usage
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to increment usage count
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if user can create thoughts
CREATE OR REPLACE FUNCTION public.can_create_thought(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  current_usage INTEGER;
  subscription_status TEXT;
BEGIN
  -- Get current subscription status
  SELECT status INTO subscription_status
  FROM public.subscriptions
  WHERE user_id = p_user_id;
  
  -- If premium subscription, always allow
  IF subscription_status = 'active' THEN
    RETURN TRUE;
  END IF;
  
  -- Check usage for free tier
  current_usage := public.get_current_month_usage(p_user_id);
  
  RETURN current_usage < 20;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
