import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Plus, Tag as TagIcon } from "lucide-react";
import { useLanguage } from '@/lib/i18n/LanguageContext';

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

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3 sm:space-y-4">
      <Textarea
        value={thought}
        onChange={(e) => setThought(e.target.value)}
        placeholder={t('brainDump.placeholder')}
        className="min-h-[120px] sm:min-h-[150px] input-field text-sm sm:text-base"
      />
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <TagIcon className="h-4 w-4 text-gray-500" />
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder={t('brainDump.addTags')}
            className="flex-1"
          />
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <span
                key={tag}
                className="bg-sage-100 text-sage-700 px-2 py-1 rounded-md text-sm flex items-center gap-1"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:text-sage-900"
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
        className="w-full sm:w-auto btn-primary"
        disabled={isPending}
      >
        <Plus className="mr-2 h-4 w-4" />
        {t('brainDump.capture')}
      </Button>
    </form>
  );
};