
import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Plus, Tag as TagIcon, Loader2 } from "lucide-react";
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface BrainDumpFormProps {
  thought: string;
  setThought: (value: string) => void;
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
  tagInput: string;
  setTagInput: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isPending: boolean;
  disabled?: boolean;
}

export const BrainDumpForm: React.FC<BrainDumpFormProps> = ({
  thought,
  setThought,
  tags,
  setTags,
  tagInput,
  setTagInput,
  onSubmit,
  isPending,
  disabled = false
}) => {
  const { t } = useLanguage();

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Textarea
          value={thought}
          onChange={(e) => setThought(e.target.value)}
          placeholder={t('brainDump.placeholder')}
          className="min-h-[120px] resize-none border-sage-300 focus:border-sage-500 focus:ring-sage-500 text-base"
          disabled={disabled || isPending}
        />
        
        {disabled && (
          <p className="text-sm text-red-600">
            {t('subscription.limitReached')}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <TagIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              placeholder={t('brainDump.tagPlaceholder')}
              className="pl-10 border-sage-300 focus:border-sage-500 focus:ring-sage-500"
              disabled={disabled || isPending}
            />
          </div>
          <Button
            type="button"
            onClick={addTag}
            variant="outline"
            size="icon"
            className="border-sage-300 hover:bg-sage-50"
            disabled={!tagInput.trim() || disabled || isPending}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-sage-100 text-sage-700 border border-sage-200"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-2 hover:text-sage-900 focus:outline-none"
                  disabled={disabled || isPending}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-sage-600 hover:bg-sage-700 text-white py-3 text-base font-medium transition-all duration-200 transform hover:scale-105"
        disabled={!thought.trim() || disabled || isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t('brainDump.adding')}
          </>
        ) : (
          t('brainDump.submit')
        )}
      </Button>
    </form>
  );
};
