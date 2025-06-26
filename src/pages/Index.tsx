
import React, { useEffect, useRef } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { gsap } from 'gsap';
import WelcomeSteps from '@/components/home/WelcomeSteps';
import ElegantLanguageSwitcher from '@/components/ElegantLanguageSwitcher';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { dir } = useLanguage();
  const { loading } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loading) return;

    const ctx = gsap.context(() => {
      // Initial page load animation
      gsap.fromTo(containerRef.current, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-sage-500" />
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
    </div>
  );
};

export default Index;
