
import React, { useEffect, useRef } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { gsap } from 'gsap';
import WelcomeSteps from '@/components/home/WelcomeSteps';
import ElegantLanguageSwitcher from '@/components/ElegantLanguageSwitcher';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Chrome, UserX } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAnonymousMode } from '@/hooks/useAnonymousMode';
import AnonymousAccessButton from '@/components/home/AnonymousAccessButton';

const Index = () => {
  const { dir, t } = useLanguage();
  const { user, signInWithGoogle } = useAuth();
  const { isAnonymous } = useAnonymousMode();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial page load animation
      gsap.fromTo(containerRef.current, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // If user is authenticated, redirect to thoughts
  if (user) {
    React.useEffect(() => {
      window.location.href = '/thoughts';
    }, []);
    
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <p className="text-sage-600">Redirecting to your thoughts...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-b from-cream to-sage-50 px-4 py-6" 
      ref={containerRef}
      dir={dir()}
    >
      {/* Mobile Language Switcher */}
      <div className="md:hidden mb-4 flex justify-center">
        <ElegantLanguageSwitcher />
      </div>
      
      <WelcomeSteps />
      
      {/* Authentication Options - Only show if not anonymous */}
      {!isAnonymous && (
        <div className="max-w-md mx-auto mt-8 space-y-4">
          {/* Primary: Google Sign-In */}
          <Button 
            onClick={signInWithGoogle}
            className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-lg min-h-[60px] text-lg font-semibold flex items-center justify-center gap-3 transition-all duration-200 hover:shadow-xl"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24">
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
            {t('auth.signInWithGoogle')}
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm uppercase">
              <span className="bg-cream px-3 text-gray-500 font-medium">{t('auth.or')}</span>
            </div>
          </div>

          {/* Secondary: Anonymous Access */}
          <AnonymousAccessButton />
          
          <p className="text-xs text-center text-gray-500 mt-4 leading-relaxed">
            {t('auth.anonymousNote')}
          </p>
        </div>
      )}
    </div>
  );
};

export default Index;
