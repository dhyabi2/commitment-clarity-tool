import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://ducwbcjvmkxaqsglvhui.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1Y3diY2p2bWt4YXFzZ2x2aHVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE0ODY4NDQsImV4cCI6MjA0NzA2Mjg0NH0.tyT8rGWuDVdRmiowmlQjOck9HwlFCyyRQJ8a6qh979M";

const mobileNumber = localStorage.getItem('mobileNumber');
const headers: Record<string, string> = {};

if (mobileNumber) {
  headers['request-mobile-number'] = mobileNumber;
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: { headers }
});