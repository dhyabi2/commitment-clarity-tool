
import React, { useEffect, useRef } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { gsap } from 'gsap';
import WelcomeSteps from '@/components/home/WelcomeSteps';
import ElegantLanguageSwitcher from '@/components/ElegantLanguageSwitcher';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Chrome, UserX } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AnonymousAccessButton from '@/components/home/AnonymousAccessButton';

const Index = () => {
  const { dir, t } = useLanguage();
  const { user } = useAuth();
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
      
      {/* Authentication Options */}
      {!user && (
        <div className="max-w-md mx-auto mt-8 space-y-4">
          <Link to="/auth">
            <Button className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm min-h-[56px] text-lg font-medium flex items-center justify-center gap-3">
              <Chrome className="h-5 w-5" />
              {t('auth.signInWithGoogle')}
            </Button>
          </Link>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-cream px-2 text-muted-foreground">{t('auth.or')}</span>
            </div>
          </div>

          <AnonymousAccessButton />
        </div>
      )}
    </div>
  );
};

export default Index;
