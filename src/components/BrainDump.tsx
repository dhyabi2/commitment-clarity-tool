
import React, { useEffect, useRef } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import BrainDumpForm from './brain-dump/BrainDumpForm';
import { gsap } from 'gsap';

const BrainDump = () => {
  const { dir } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Staggered entrance animation
      gsap.fromTo([formRef.current], 
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.6,
          ease: "power2.out",
          delay: 0.8
        }
      );

      // Breathing animation for the container
      gsap.to(containerRef.current, {
        scale: 1.01,
        duration: 3,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="animate-fade-in p-4 sm:p-0" dir={dir()} ref={containerRef}>
      <div ref={formRef} className="transform">
        <BrainDumpForm />
      </div>
    </div>
  );
};

export default BrainDump;
