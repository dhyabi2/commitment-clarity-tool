
-- Revert the RLS policy changes and implement anonymous access as ADDITIONAL feature
-- First, restore the original RLS policies for thoughts table
DROP POLICY IF EXISTS "Users and devices can view their own thoughts" ON public.thoughts;
DROP POLICY IF EXISTS "Users and devices can create their own thoughts" ON public.thoughts;
DROP POLICY IF EXISTS "Users and devices can update their own thoughts" ON public.thoughts;
DROP POLICY IF EXISTS "Users and devices can delete their own thoughts" ON public.thoughts;

-- Restore original authenticated-only policies
CREATE POLICY "Users can view their own thoughts" 
  ON public.thoughts 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own thoughts" 
  ON public.thoughts 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own thoughts" 
  ON public.thoughts 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own thoughts" 
  ON public.thoughts 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add ADDITIONAL policies for anonymous device access (not replacing, but adding)
CREATE POLICY "Devices can view their own thoughts" 
  ON public.thoughts 
  FOR SELECT 
  USING (auth.uid() IS NULL AND device_id IS NOT NULL);

CREATE POLICY "Devices can create their own thoughts" 
  ON public.thoughts 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NULL AND user_id IS NULL AND device_id IS NOT NULL);

CREATE POLICY "Devices can update their own thoughts" 
  ON public.thoughts 
  FOR UPDATE 
  USING (auth.uid() IS NULL AND device_id IS NOT NULL);

CREATE POLICY "Devices can delete their own thoughts" 
  ON public.thoughts 
  FOR DELETE 
  USING (auth.uid() IS NULL AND device_id IS NOT NULL);

-- Revert and fix commitments table policies
DROP POLICY IF EXISTS "Users and devices can view their own commitments" ON public.commitments;
DROP POLICY IF EXISTS "Users and devices can create their own commitments" ON public.commitments;
DROP POLICY IF EXISTS "Users and devices can update their own commitments" ON public.commitments;
DROP POLICY IF EXISTS "Users and devices can delete their own commitments" ON public.commitments;

-- Restore original authenticated-only policies
CREATE POLICY "Users can view their own commitments" 
  ON public.commitments 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own commitments" 
  ON public.commitments 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own commitments" 
  ON public.commitments 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own commitments" 
  ON public.commitments 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add ADDITIONAL policies for anonymous device access
CREATE POLICY "Devices can view their own commitments" 
  ON public.commitments 
  FOR SELECT 
  USING (auth.uid() IS NULL AND device_id IS NOT NULL);

CREATE POLICY "Devices can create their own commitments" 
  ON public.commitments 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NULL AND user_id IS NULL AND device_id IS NOT NULL);

CREATE POLICY "Devices can update their own commitments" 
  ON public.commitments 
  FOR UPDATE 
  USING (auth.uid() IS NULL AND device_id IS NOT NULL);

CREATE POLICY "Devices can delete their own commitments" 
  ON public.commitments 
  FOR DELETE 
  USING (auth.uid() IS NULL AND device_id IS NOT NULL);

-- Fix usage tracking policies - revert and add separate policies
DROP POLICY IF EXISTS "Users and devices can view their own usage" ON public.usage_tracking;
DROP POLICY IF EXISTS "Users and devices can update their own usage" ON public.usage_tracking;

-- Restore original authenticated policies
CREATE POLICY "Users can view their own usage" 
  ON public.usage_tracking 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own usage" 
  ON public.usage_tracking 
  FOR ALL 
  USING (auth.uid() = user_id);

-- Add ADDITIONAL policies for device access
CREATE POLICY "Devices can view their own usage" 
  ON public.usage_tracking 
  FOR SELECT 
  USING (auth.uid() IS NULL AND device_id IS NOT NULL);

CREATE POLICY "Devices can update their own usage" 
  ON public.usage_tracking 
  FOR ALL 
  USING (auth.uid() IS NULL AND device_id IS NOT NULL);

-- Keep the device sessions table and functions as they are additional features
-- No changes needed for device_sessions table or the new functions
