import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabase';
import { Mail } from "lucide-react";
import { generateSessionKey } from '@/utils/session';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const sessionKey = generateSessionKey();
      
      // Check if user already exists
      const { data: existingUser, error: fetchError } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (existingUser) {
        // If user exists, update their session key
        const { error: updateError } = await supabase
          .from('user_sessions')
          .update({ 
            session_key: sessionKey,
            last_accessed: new Date().toISOString()
          })
          .eq('email', email);

        if (updateError) throw updateError;

        toast({
          title: "Access Restoration",
          description: "We've sent a verification link to restore your access.",
        });
      } else {
        // If new user, create new session
        const { error: insertError } = await supabase
          .from('user_sessions')
          .insert([{ 
            email, 
            session_key: sessionKey,
            last_accessed: new Date().toISOString()
          }]);

        if (insertError) throw insertError;

        toast({
          title: "Verification email sent",
          description: "Please check your email to verify and access the app.",
        });
      }

      // Send verification email in both cases
      const { error: emailError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          data: { sessionKey },
          emailRedirectTo: `${window.location.origin}/verify?sessionKey=${sessionKey}`
        }
      });

      if (emailError) throw emailError;

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
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
          />
          <Button 
            type="submit" 
            className="w-full bg-sage-500 hover:bg-sage-600"
            disabled={isLoading}
          >
            <Mail className="mr-2 h-4 w-4" />
            {isLoading ? "Sending..." : "Send Verification Link"}
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