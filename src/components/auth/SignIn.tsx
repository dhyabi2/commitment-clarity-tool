
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Loader2 } from 'lucide-react';
import AnonymousAccessButton from '@/components/home/AnonymousAccessButton';

const SignIn = () => {
  const { signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const { t, dir } = useLanguage();
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
    } catch (error) {
      toast({
        title: t('auth.errorTitle') || "Error",
        description: t('auth.signInError') || "Failed to sign in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-sage-50 flex items-center justify-center p-4" dir={dir()}>
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-xl">
        <CardHeader className="text-center pb-8">
          <CardTitle className="text-3xl font-bold text-sage-600 mb-4">
            {t('auth.welcome') || 'Welcome to Mind Garden'}
          </CardTitle>
          <p className="text-sage-500 text-lg">
            {t('auth.signInDescription') || 'Sign in to access your thoughts and commitments'}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm min-h-[56px] text-lg font-medium flex items-center justify-center gap-3"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                {t('auth.signInWithGoogle') || 'Continue with Google'}
              </>
            )}
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <AnonymousAccessButton />
          
          <div className="text-center text-sm text-gray-500">
            {t('auth.termsText') || 'By signing in, you agree to our Terms of Service and Privacy Policy'}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignIn;
