import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabase';
import { Loader2 } from "lucide-react";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      const sessionKey = searchParams.get('sessionKey');
      
      if (!sessionKey) {
        toast({
          title: "Error",
          description: "Invalid verification link",
          variant: "destructive",
        });
        navigate('/auth');
        return;
      }

      try {
        // Verify the session exists and is valid
        const { data: session, error } = await supabase
          .from('user_sessions')
          .select('*')
          .eq('session_key', sessionKey)
          .single();

        if (error || !session) throw new Error('Invalid session');

        // Store the session key in localStorage
        localStorage.setItem('sessionKey', sessionKey);
        localStorage.setItem('userEmail', session.email);

        toast({
          title: "Verification successful",
          description: "Welcome to Clear Mind!",
        });
        
        navigate('/');
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to verify session. Please try again.",
          variant: "destructive",
        });
        navigate('/auth');
      } finally {
        setIsVerifying(false);
      }
    };

    verifySession();
  }, [navigate, searchParams, toast]);

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Card className="p-6 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-sage-600" />
          <p className="text-gray-600">Verifying your session...</p>
        </Card>
      </div>
    );
  }

  return null;
};

export default Verify;