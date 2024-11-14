import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { getSessionKey, getUserEmail } from '@/utils/session';

const supabaseUrl = "https://ducwbcjvmkxaqsglvhui.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1Y3diY2p2bWt4YXFzZ2x2aHVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE0ODY4NDQsImV4cCI6MjA0NzA2Mjg0NH0.tyT8rGWuDVdRmiowmlQjOck9HwlFCyyRQJ8a6qh979M";

// Create a single instance of the Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false, // Disable session persistence to prevent multiple instances
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'x-session-key': getSessionKey() || '',
      'x-user-email': getUserEmail() || '',
    },
  },
});