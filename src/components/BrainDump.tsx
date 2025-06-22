
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Plus, Tag as TagIcon } from "lucide-react";
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { BrainDumpForm } from './brain-dump/BrainDumpForm';
import { useBrainDumpMutation } from './brain-dump/useBrainDumpMutation';
import { gsap } from 'gsap';

const BrainDump = () => {
  const { t, dir } = useLanguage();
  const [thought, setThought] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  
  const { addThoughtMutation } = useBrainDumpMutation({
    onSuccess: () => {
      // Success animation
      gsap.to(formRef.current, {
        scale: 1.05,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
        onComplete: () => {
          setThought("");
          setTags([]);
          setTagInput("");
        }
      });
    }
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Staggered entrance animation
      gsap.fromTo([titleRef.current, descriptionRef.current, formRef.current], 
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.6,
          stagger: 0.1,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (thought.trim()) {
      // Submit animation
      gsap.to(formRef.current, {
        y: -10,
        duration: 0.3,
        ease: "power2.out",
        onComplete: () => {
          addThoughtMutation.mutate({ content: thought, tags });
          gsap.to(formRef.current, {
            y: 0,
            duration: 0.3,
            ease: "bounce.out"
          });
        }
      });
    }
  };

  return (
    <div className="animate-fade-in p-4 sm:p-0" dir={dir()} ref={containerRef}>
      <h2 
        ref={titleRef}
        className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 transform"
      >
        {t('brainDump.title')}
      </h2>
      <p 
        ref={descriptionRef}
        className="text-gray-600 text-sm sm:text-base mb-4 transform"
      >
        {t('brainDump.description')}
      </p>
      <div ref={formRef} className="transform">
        <BrainDumpForm
          thought={thought}
          setThought={setThought}
          tags={tags}
          setTags={setTags}
          tagInput={tagInput}
          setTagInput={setTagInput}
          onSubmit={handleSubmit}
          isPending={addThoughtMutation.isPending}
        />
      </div>
    </div>
  );
};

export default BrainDump;
