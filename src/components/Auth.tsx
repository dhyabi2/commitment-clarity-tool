import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const Auth = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== 'd995179620') {
      toast({
        variant: "destructive",
        title: "Incorrect password",
        description: "Please try again with the correct password",
      });
      return;
    }

    try {
      setLoading(true);

      // Check if user exists in allowed_users table
      const { data: allowedUser } = await supabase
        .from('allowed_users')
        .select('email')
        .eq('email', email)
        .single();

      if (!allowedUser) {
        toast({
          variant: "destructive",
          title: "Unauthorized",
          description: "This email is not authorized to access the system",
        });
        return;
      }

      // Try to sign up first (this is important for first-time users)
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
        }
      });

      if (signUpError && signUpError.message !== "User already registered") {
        toast({
          variant: "destructive",
          title: "Sign up failed",
          description: signUpError.message,
        });
        return;
      }

      // Now try to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: signInError.message,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Please try again later",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-sage-700 mb-8 text-center">
          {t('auth.welcome')}
        </h1>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full"
                placeholder="Enter password"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-sage-600 hover:bg-sage-700"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Sign In'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;