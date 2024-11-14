import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabase';
import { Loader2 } from "lucide-react";
import { setSession } from '@/utils/session';

const Verify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      const sessionKey = searchParams.get('sessionKey');
      
      if (!sessionKey) {
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

        // Store session information
        setSession(sessionKey, session.email);
        
        // Update last accessed timestamp
        await supabase.rpc('update_session_key', {
          p_email: session.email,
          p_new_session_key: sessionKey
        });

        navigate('/');
      } catch (error) {
        navigate('/auth');
      } finally {
        setIsVerifying(false);
      }
    };

    verifySession();
  }, [navigate, searchParams]);

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