
-- Enable RLS on all public tables that are missing it
ALTER TABLE public.allowed_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thought_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

-- RLS policies for allowed_users table
-- This table seems to be for admin purposes, so restrict access
CREATE POLICY "Only authenticated users can view allowed users" 
  ON public.allowed_users 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);

-- RLS policies for user_sessions table
-- Users can only access their own sessions
CREATE POLICY "Users can view their own sessions" 
  ON public.user_sessions 
  FOR SELECT 
  USING (email = auth.jwt() ->> 'email');

CREATE POLICY "Users can update their own sessions" 
  ON public.user_sessions 
  FOR UPDATE 
  USING (email = auth.jwt() ->> 'email');

CREATE POLICY "Users can insert their own sessions" 
  ON public.user_sessions 
  FOR INSERT 
  WITH CHECK (email = auth.jwt() ->> 'email');

CREATE POLICY "Users can delete their own sessions" 
  ON public.user_sessions 
  FOR DELETE 
  USING (email = auth.jwt() ->> 'email');

-- RLS policies for tags table
-- Tags can be viewed by all authenticated users, but only created by authenticated users
CREATE POLICY "Authenticated users can view tags" 
  ON public.tags 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create tags" 
  ON public.tags 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

-- RLS policies for thought_tags table
-- Users can only access thought_tags for their own thoughts
CREATE POLICY "Users can view their own thought tags" 
  ON public.thought_tags 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.thoughts 
      WHERE thoughts.id = thought_tags.thought_id 
      AND thoughts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own thought tags" 
  ON public.thought_tags 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.thoughts 
      WHERE thoughts.id = thought_tags.thought_id 
      AND thoughts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own thought tags" 
  ON public.thought_tags 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.thoughts 
      WHERE thoughts.id = thought_tags.thought_id 
      AND thoughts.user_id = auth.uid()
    )
  );
