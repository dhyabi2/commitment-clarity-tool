
import React, { useRef, useEffect } from 'react';
import { Brain, Target, MessageSquare, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BrainDump from '@/components/BrainDump';
import ActiveCommitments from '@/components/ActiveCommitments';
import StepCard from './StepCard';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useThoughtsQuery } from '@/hooks/useThoughtsQuery';

gsap.registerPlugin(ScrollTrigger);

interface WelcomeStepsProps {
  containerRef: React.RefObject<HTMLDivElement>;
}

const WelcomeSteps = ({ containerRef }: WelcomeStepsProps) => {
  const { t, dir } = useLanguage();
  const isRTL = dir() === 'rtl';
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step1NumberRef = useRef<HTMLDivElement>(null);
  const step2NumberRef = useRef<HTMLDivElement>(null);

  // Get user's thoughts to determine what to show in step 2
  const { data: thoughts } = useThoughtsQuery(null);
  const hasThoughts = thoughts && thoughts.length > 0;

  useEffect(() => {
    const ctx = gsap.context(() => {
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
  }, [containerRef]);

  return (
    <div className="space-y-6">
      {/* Step 1 */}
      <StepCard
        ref={step1Ref}
        stepNumber={1}
        icon={Brain}
        isRTL={isRTL}
        numberRef={step1NumberRef}
      >
        <BrainDump />
      </StepCard>

      {/* Step 2 - Show different content based on whether user has thoughts */}
      <StepCard
        ref={step2Ref}
        stepNumber={2}
        icon={hasThoughts ? Target : MessageSquare}
        isRTL={isRTL}
        numberRef={step2NumberRef}
      >
        {hasThoughts ? (
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-sage-700">
              {t('commitments.clarifyTitle')}
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mb-4">
              {t('commitments.clarifyDescription')}
            </p>
            <Link to="/commitment-flow">
              <Button className="bg-sage-500 hover:bg-sage-600 text-white px-6 py-3 text-base font-medium">
                {t('commitments.clarifyButton')}
                <ArrowRight className={`h-5 w-5 ${isRTL ? 'mr-3 rotate-180' : 'ml-3'}`} />
              </Button>
            </Link>
            
            {/* Show Active Commitments Below */}
            <div className="mt-8 pt-6 border-t border-sage-200">
              <ActiveCommitments />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-gray-600">
              Ready to Get Organized?
            </h2>
            <p className="text-gray-500 text-sm sm:text-base">
              Start by capturing your thoughts above. Once you have some thoughts recorded, you'll be able to clarify them into actionable commitments.
            </p>
          </div>
        )}
      </StepCard>
    </div>
  );
};

export default WelcomeSteps;
