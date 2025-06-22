
import React, { useEffect, useRef } from 'react';
import BrainDump from '@/components/BrainDump';
import ActiveCommitments from '@/components/ActiveCommitments';
import { Card } from "@/components/ui/card";
import { Brain, ListTodo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Index = () => {
  const { t, dir } = useLanguage();
  const isRTL = dir() === 'rtl';
  const containerRef = useRef<HTMLDivElement>(null);
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step1NumberRef = useRef<HTMLDivElement>(null);
  const step2NumberRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial page load animation
      gsap.fromTo(containerRef.current, 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );

      // Staggered entrance for steps
      gsap.fromTo([step1Ref.current, step2Ref.current], 
        { opacity: 0, y: 50, scale: 0.95 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          duration: 0.6,
          stagger: 0.2,
          ease: "back.out(1.7)",
          delay: 0.3
        }
      );

      // Number badge animations
      gsap.fromTo([step1NumberRef.current, step2NumberRef.current], 
        { scale: 0, rotation: 180 },
        { 
          scale: 1, 
          rotation: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "elastic.out(1, 0.75)",
          delay: 0.6
        }
      );

      // Floating animation for step numbers
      gsap.to([step1NumberRef.current, step2NumberRef.current], {
        y: -5,
        duration: 2,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1,
        stagger: 0.3,
        delay: 1.5
      });

      // Card hover animations
      const cards = [step1Ref.current, step2Ref.current];
      cards.forEach(card => {
        if (card) {
          const cardElement = card.querySelector('.card-content');
          gsap.set(cardElement, { transformOrigin: "center center" });
          
          card.addEventListener('mouseenter', () => {
            gsap.to(cardElement, {
              scale: 1.02,
              y: -5,
              duration: 0.3,
              ease: "power2.out"
            });
          });
          
          card.addEventListener('mouseleave', () => {
            gsap.to(cardElement, {
              scale: 1,
              y: 0,
              duration: 0.3,
              ease: "power2.out"
            });
          });
        }
      });

      // Parallax effect for background
      gsap.to(containerRef.current, {
        backgroundPosition: "50% 100%",
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen" ref={containerRef}>
      <ScrollArea className="h-full bg-gradient-to-b from-cream to-sage-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="space-y-6">
            {/* Step 1 */}
            <div className="relative" ref={step1Ref}>
              <div 
                ref={step1NumberRef}
                className={`absolute ${isRTL ? '-right-4 sm:-right-8' : '-left-4 sm:-left-8'} top-6 flex items-center justify-center w-8 h-8 bg-sage-500 text-white rounded-full font-bold shadow-lg transform transition-transform hover:scale-110 z-10`}
              >
                1
              </div>
              <Card className={`card-content p-6 sm:p-8 ${isRTL ? 'mr-6 sm:mr-4' : 'ml-6 sm:ml-4'} bg-white/80 backdrop-blur-sm border-sage-200 shadow-lg hover:shadow-xl transition-all duration-300`}>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-sage-100 p-3 rounded-xl shadow-inner transform transition-transform hover:scale-105">
                      <Brain className="h-6 w-6 text-sage-600" />
                    </div>
                    <div className="flex-1">
                      <BrainDump />
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Step 2 */}
            <div className="relative" ref={step2Ref}>
              <div 
                ref={step2NumberRef}
                className={`absolute ${isRTL ? '-right-4 sm:-right-8' : '-left-4 sm:-left-8'} top-6 flex items-center justify-center w-8 h-8 bg-sage-500 text-white rounded-full font-bold shadow-lg transform transition-transform hover:scale-110 z-10`}
              >
                2
              </div>
              <div className={`${isRTL ? 'mr-6 sm:mr-4' : 'ml-6 sm:ml-4'}`}>
                <Card className="card-content bg-white/80 backdrop-blur-sm p-6 sm:p-8 border-sage-200 shadow-lg hover:shadow-xl transition-all duration-300">
                  <h2 className="text-xl font-semibold mb-4 text-sage-700">{t('index.step2.title')}</h2>
                  <ActiveCommitments />
                </Card>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default Index;
