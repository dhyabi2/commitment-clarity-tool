
import React, { useEffect, useRef } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
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
    <div className="min-h-screen" ref={containerRef}>
      <ScrollArea className="h-full bg-gradient-to-b from-cream to-sage-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <WelcomeSteps containerRef={containerRef} />
        </div>
      </ScrollArea>
    </div>
  );
};

export default Index;
