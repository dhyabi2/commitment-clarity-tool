
import React, { useRef, useEffect } from 'react';
import { Brain, Target, MessageSquare, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { gsap } from 'gsap';
import BrainDump from '@/components/BrainDump';
import ActiveCommitments from '@/components/ActiveCommitments';
import StepCard from './StepCard';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useThoughtsQuery } from '@/hooks/useThoughtsQuery';
import { useAuth } from '@/contexts/AuthContext';

const WelcomeSteps = () => {
  const { t, dir } = useLanguage();
  const { user, loading } = useAuth();
  const isRTL = dir() === 'rtl';
  const containerRef = useRef<HTMLDivElement>(null);
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);

  // Get user's thoughts to determine what to show in step 2
  const { data: thoughts, isLoading: thoughtsLoading } = useThoughtsQuery(user?.id || null);
  const hasThoughts = thoughts && Array.isArray(thoughts) && thoughts.length > 0;

  useEffect(() => {
    if (loading || thoughtsLoading) return;

    const ctx = gsap.context(() => {
      // Staggered entrance for steps
      gsap.fromTo([step1Ref.current, step2Ref.current], 
        { opacity: 0, y: 30, scale: 0.98 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          duration: 0.5,
          stagger: 0.15,
          ease: "power2.out",
          delay: 0.2
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [loading, thoughtsLoading]);

  return (
    <div ref={containerRef} className="w-full max-w-2xl mx-auto space-y-6">
      {/* Step 1: Brain Dump */}
      <StepCard
        ref={step1Ref}
        stepNumber={1}
        icon={Brain}
        title={t('index.step1.title') || 'Capture Your Thoughts'}
        isRTL={isRTL}
      >
        <BrainDump />
      </StepCard>

      {/* Step 2: Commitments or Placeholder */}
      <StepCard
        ref={step2Ref}
        stepNumber={2}
        icon={hasThoughts ? Target : MessageSquare}
        title={hasThoughts ? (t('commitments.clarifyTitle') || 'Clarify Your Commitments') : (t('index.step2.readyTitle') || 'Ready for Next Steps')}
        isRTL={isRTL}
      >
        {hasThoughts ? (
          <div className="space-y-6">
            <div className="space-y-4">
              <p className="text-gray-600 text-base leading-relaxed">
                {t('commitments.clarifyDescription') || 'Transform your thoughts into clear, actionable commitments.'}
              </p>
              <Link to="/commitment-flow" className="block">
                <Button className="w-full bg-sage-500 hover:bg-sage-600 text-white py-4 text-lg font-medium rounded-xl shadow-lg">
                  {t('commitments.clarifyButton') || 'Clarify Commitments'}
                  <ArrowRight className={`h-5 w-5 ${isRTL ? 'mr-3 rotate-180' : 'ml-3'}`} />
                </Button>
              </Link>
            </div>
            
            {/* Active Commitments Section */}
            <div className="border-t border-sage-200 pt-6">
              <ActiveCommitments />
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 text-base leading-relaxed">
              {t('index.step2.readyDescription') || 'Once you capture your thoughts, you can start clarifying your commitments.'}
            </p>
          </div>
        )}
      </StepCard>
    </div>
  );
};

export default WelcomeSteps;
