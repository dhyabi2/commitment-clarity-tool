
import React, { useEffect, useRef } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import WelcomeSteps from '@/components/home/WelcomeSteps';

gsap.registerPlugin(ScrollTrigger);

const Index = () => {
  const { dir } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial page load animation
      gsap.fromTo(containerRef.current, 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div 
      className="min-h-screen bg-gradient-to-b from-cream to-sage-50 px-4 py-8" 
      ref={containerRef}
      dir={dir()}
    >
      <WelcomeSteps containerRef={containerRef} />
    </div>
  );
};

export default Index;
