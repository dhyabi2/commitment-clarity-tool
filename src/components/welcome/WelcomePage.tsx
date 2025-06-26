
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Brain, Target, CheckCircle, Lightbulb, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface WelcomePageProps {
  onComplete: () => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ onComplete }) => {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<HTMLDivElement[]>([]);
  const progressRef = useRef<HTMLDivElement>(null);
  
  const slides = [
    {
      icon: Brain,
      title: t('welcome.slide1.title'),
      description: t('welcome.slide1.description'),
      bgColor: 'bg-gradient-to-br from-sage-100 to-sage-200',
      iconColor: 'text-sage-600'
    },
    {
      icon: Lightbulb,
      title: t('welcome.slide2.title'),
      description: t('welcome.slide2.description'),
      bgColor: 'bg-gradient-to-br from-blue-100 to-blue-200',
      iconColor: 'text-blue-600'
    },
    {
      icon: Target,
      title: t('welcome.slide3.title'),
      description: t('welcome.slide3.description'),
      bgColor: 'bg-gradient-to-br from-purple-100 to-purple-200',
      iconColor: 'text-purple-600'
    },
    {
      icon: CheckCircle,
      title: t('welcome.slide4.title'),
      description: t('welcome.slide4.description'),
      bgColor: 'bg-gradient-to-br from-green-100 to-green-200',
      iconColor: 'text-green-600'
    }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial page animation
      gsap.fromTo(containerRef.current, 
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)" }
      );

      // Animate first slide
      animateSlideIn(0);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const animateSlideIn = (slideIndex: number) => {
    const slide = slidesRef.current[slideIndex];
    if (!slide) return;

    const icon = slide.querySelector('.slide-icon');
    const title = slide.querySelector('.slide-title');
    const description = slide.querySelector('.slide-description');

    gsap.set([icon, title, description], { opacity: 0, y: 50 });
    
    const tl = gsap.timeline();
    
    tl.to(icon, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "back.out(1.7)",
      scale: 1.1
    })
    .to(icon, {
      scale: 1,
      duration: 0.3,
      ease: "power2.out"
    }, "-=0.2")
    .to(title, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: "power2.out"
    }, "-=0.3")
    .to(description, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: "power2.out"
    }, "-=0.2");
  };

  const animateSlideOut = (slideIndex: number, direction: 'left' | 'right') => {
    const slide = slidesRef.current[slideIndex];
    if (!slide) return;

    const elements = slide.querySelectorAll('.slide-icon, .slide-title, .slide-description');
    
    return gsap.to(elements, {
      opacity: 0,
      x: direction === 'left' ? -100 : 100,
      duration: 0.4,
      ease: "power2.in",
      stagger: 0.1
    });
  };

  const updateProgress = (slideIndex: number) => {
    if (progressRef.current) {
      gsap.to(progressRef.current, {
        width: `${((slideIndex + 1) / slides.length) * 100}%`,
        duration: 0.5,
        ease: "power2.out"
      });
    }
  };

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      const nextIndex = currentSlide + 1;
      
      animateSlideOut(currentSlide, 'left').then(() => {
        setCurrentSlide(nextIndex);
        updateProgress(nextIndex);
        setTimeout(() => animateSlideIn(nextIndex), 100);
      });
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      const prevIndex = currentSlide - 1;
      
      animateSlideOut(currentSlide, 'right').then(() => {
        setCurrentSlide(prevIndex);
        updateProgress(prevIndex);
        setTimeout(() => animateSlideIn(prevIndex), 100);
      });
    }
  };

  const handleGetStarted = () => {
    gsap.to(containerRef.current, {
      opacity: 0,
      scale: 0.9,
      duration: 0.5,
      ease: "power2.in",
      onComplete: onComplete
    });
  };

  const currentSlideData = slides[currentSlide];
  const IconComponent = currentSlideData.icon;

  return (
    <div ref={containerRef} className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              ref={progressRef}
              className="h-full bg-sage-500 rounded-full"
              style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
            />
          </div>
          <div className="text-center mt-2 text-sm text-gray-600">
            {currentSlide + 1} {t('welcome.of')} {slides.length}
          </div>
        </div>

        {/* Slide Content */}
        <Card className={`p-8 text-center ${currentSlideData.bgColor} border-0 shadow-xl`}>
          <div 
            ref={el => el && (slidesRef.current[currentSlide] = el)}
            className="space-y-6"
          >
            <div className={`slide-icon flex justify-center`}>
              <div className={`p-6 bg-white rounded-full shadow-lg ${currentSlideData.iconColor}`}>
                <IconComponent size={48} />
              </div>
            </div>
            
            <h2 className="slide-title text-2xl font-bold text-gray-800">
              {currentSlideData.title}
            </h2>
            
            <p className="slide-description text-lg text-gray-600 leading-relaxed">
              {currentSlideData.description}
            </p>
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <Button
            variant="ghost"
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            {t('welcome.previous')}
          </Button>

          {currentSlide === slides.length - 1 ? (
            <Button
              onClick={handleGetStarted}
              className="bg-sage-500 hover:bg-sage-600 text-white px-8 py-3 rounded-lg font-semibold"
            >
              {t('welcome.getStarted')}
            </Button>
          ) : (
            <Button
              onClick={nextSlide}
              className="flex items-center gap-2 bg-sage-500 hover:bg-sage-600 text-white"
            >
              {t('welcome.next')}
              <ArrowRight size={20} />
            </Button>
          )}
        </div>

        {/* PWA Install Prompt */}
        <div className="text-center mt-6 p-4 bg-sage-50 rounded-lg border border-sage-200">
          <p className="text-sm text-sage-700 mb-3">
            💡 للحصول على أفضل تجربة، قم بتثبيت التطبيق على جهازك
          </p>
          <div className="text-xs text-sage-600 space-y-1">
            <p>• على الأندرويد: اضغط على القائمة ← "إضافة إلى الشاشة الرئيسية"</p>
            <p>• على الآيفون: اضغط على أيقونة المشاركة ← "إضافة إلى الشاشة الرئيسية"</p>
          </div>
        </div>

        {/* Skip Button */}
        <div className="text-center mt-6">
          <Button 
            variant="ghost" 
            onClick={handleGetStarted}
            className="text-gray-500 hover:text-gray-700"
          >
            {t('welcome.skip')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
