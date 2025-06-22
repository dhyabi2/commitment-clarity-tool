
import React, { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Plus, Tag as TagIcon } from "lucide-react";
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { gsap } from 'gsap';

interface BrainDumpFormProps {
  thought: string;
  setThought: (thought: string) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
  tagInput: string;
  setTagInput: (input: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isPending: boolean;
}

export const BrainDumpForm = ({
  thought,
  setThought,
  tags,
  setTags,
  tagInput,
  setTagInput,
  onSubmit,
  isPending
}: BrainDumpFormProps) => {
  const { t } = useLanguage();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const tagsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Button pulse animation when form is ready
    if (thought.trim() && buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 1.05,
        duration: 0.5,
        ease: "power2.inOut",
        yoyo: true,
        repeat: 1
      });
    }
  }, [thought]);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
        
        // Animate new tag addition
        setTimeout(() => {
          const newTag = tagsContainerRef.current?.lastElementChild;
          if (newTag) {
            gsap.fromTo(newTag, 
              { scale: 0, opacity: 0, rotation: 180 },
              { scale: 1, opacity: 1, rotation: 0, duration: 0.5, ease: "back.out(1.7)" }
            );
          }
        }, 10);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const tagElement = tagsContainerRef.current?.querySelector(`[data-tag="${tagToRemove}"]`);
    if (tagElement) {
      gsap.to(tagElement, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          setTags(tags.filter(tag => tag !== tagToRemove));
        }
      });
    }
  };

  const handleTextareaFocus = () => {
    gsap.to(textareaRef.current, {
      scale: 1.02,
      duration: 0.3,
      ease: "power2.out"
    });
  };

  const handleTextareaBlur = () => {
    gsap.to(textareaRef.current, {
      scale: 1,
      duration: 0.3,
      ease: "power2.out"
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3 sm:space-y-4">
      <Textarea
        ref={textareaRef}
        value={thought}
        onChange={(e) => setThought(e.target.value)}
        onFocus={handleTextareaFocus}
        onBlur={handleTextareaBlur}
        placeholder={t('brainDump.placeholder')}
        className="min-h-[120px] sm:min-h-[150px] input-field text-sm sm:text-base transform transition-all duration-300"
      />
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <TagIcon className="h-4 w-4 text-gray-500 transform transition-transform hover:scale-110" />
          <Input
            ref={tagInputRef}
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder={t('brainDump.addTags')}
            className="flex-1 transform transition-all duration-300 focus:scale-105"
          />
        </div>
        {tags.length > 0 && (
          <div ref={tagsContainerRef} className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <span
                key={tag}
                data-tag={tag}
                className="bg-sage-100 text-sage-700 px-2 py-1 rounded-md text-sm flex items-center gap-1 transform transition-all duration-200 hover:scale-105 hover:bg-sage-200"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:text-sage-900 transform transition-all duration-200 hover:scale-125"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
      <Button 
        ref={buttonRef}
        type="submit" 
        className="w-full sm:w-auto btn-primary transform transition-all duration-300 hover:scale-105 active:scale-95"
        disabled={isPending}
      >
        <Plus className="mr-2 h-4 w-4 transform transition-transform group-hover:rotate-90" />
        {t('brainDump.capture')}
      </Button>
    </form>
  );
};
