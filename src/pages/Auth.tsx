import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from '@/integrations/supabase/client';
import { Mail } from "lucide-react";
import { generateSessionKey } from '@/utils/session';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLoading || cooldown) return;
    setIsLoading(true);

    try {
      const sessionKey = generateSessionKey();
      
      // Try to update existing session
      const { error: updateError } = await supabase
        .rpc('update_session_key', {
          p_email: email,
          p_new_session_key: sessionKey
        });

      if (updateError && !updateError.message.includes('no rows')) {
        throw updateError;
      }

      // Send verification email
      const { error: emailError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/verify?sessionKey=${sessionKey}`,
          data: {
            session_key: sessionKey
          }
        }
      });

      if (emailError) {
        if (emailError.message.includes('rate_limit')) {
          setCooldown(true);
          setTimeout(() => setCooldown(false), 60000); // 60 second cooldown
        }
        throw emailError;
      }

    } catch (error: any) {
      console.error('Auth error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 bg-white/80 backdrop-blur-sm">
        <h1 className="text-2xl font-bold text-center mb-6 text-sage-700">Welcome to Clear Mind</h1>
        <p className="text-center text-gray-600 mb-8">
          Enter your email to access the app. We'll send you a verification link.
        </p>
        
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full"
            disabled={isLoading || cooldown}
          />
          <Button 
            type="submit" 
            className="w-full bg-sage-500 hover:bg-sage-600"
            disabled={isLoading || cooldown}
          >
            <Mail className="mr-2 h-4 w-4" />
            {cooldown ? "Please wait 60 seconds..." : 
             isLoading ? "Sending..." : "Send Verification Link"}
          </Button>
        </form>

        <div className="mt-4 text-sm text-center text-gray-500">
          Whether you're a new or existing user, we'll help you access your account securely.
        </div>
      </Card>
    </div>
  );
};

export default Auth;