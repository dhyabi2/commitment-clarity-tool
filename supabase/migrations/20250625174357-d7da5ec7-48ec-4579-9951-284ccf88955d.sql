
-- Fix the search_path security issue for the update_session_key functions
CREATE OR REPLACE FUNCTION public.update_session_key(p_email text, p_new_session_key text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  UPDATE user_sessions 
  SET session_key = p_new_session_key,
      last_accessed = timezone('utc'::text, now())
  WHERE email = p_email;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_session_key(p_email text, p_mobile_number text, p_new_session_key text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  UPDATE user_sessions 
  SET session_key = p_new_session_key,
      mobile_number = p_mobile_number,
      last_accessed = timezone('utc'::text, now())
  WHERE email = p_email;
  
  -- Insert if not exists
  INSERT INTO user_sessions (email, mobile_number, session_key)
  SELECT p_email, p_mobile_number, p_new_session_key
  WHERE NOT EXISTS (
    SELECT 1 FROM user_sessions WHERE email = p_email
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.verify_session()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_sessions 
    WHERE email = current_setting('request.user_email'::text, true)
    AND session_key = current_setting('request.session_key'::text, true)
    AND mobile_number = current_setting('request.mobile_number'::text, true)
    AND last_accessed > (now() - interval '30 days')
  );
END;
$function$;
