
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Brain } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useBrainDumpMutation } from "./useBrainDumpMutation";
import { TagInput } from "../thoughts/TagInput";
import { useSubscription } from "@/hooks/useSubscription";
import { BrainDumpUpgradePrompt } from "./BrainDumpUpgradePrompt";

export const BrainDumpForm: React.FC = () => {
  const { t } = useLanguage();
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const { canCreateThought, hasExceededLimit } = useSubscription();
  
  const { addThoughtMutation } = useBrainDumpMutation({
    onSuccess: () => {
      setContent('');
      setTags([]);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canCreateThought) {
      return; // This shouldn't happen as the form is hidden when limit is exceeded
    }
    
    if (!content.trim()) return;

    addThoughtMutation.mutate(
      { content: content.trim(), tags },
      {
        onSuccess: () => {
          setContent('');
          setTags([]);
        }
      }
    );
  };

  const handleTagAdd = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  // Show upgrade prompt instead of form when limit is exceeded
  if (hasExceededLimit) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <Brain className="mx-auto h-12 w-12 text-sage-400 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('brainDump.title')}</h1>
          <p className="text-gray-600">{t('brainDump.description')}</p>
        </div>
        
        <BrainDumpUpgradePrompt />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Brain className="mx-auto h-12 w-12 text-sage-400 mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('brainDump.title')}</h1>
        <p className="text-gray-600">{t('brainDump.description')}</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-sage-600" />
            {t('brainDump.title')}
          </CardTitle>
          <CardDescription>
            {t('brainDump.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              placeholder={t('brainDump.placeholder')}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[120px] resize-none"
              disabled={addThoughtMutation.isPending}
            />
            
            <div className="space-y-2">
              <TagInput
                onTagAdd={handleTagAdd}
                placeholder={t('brainDump.tagPlaceholder')}
              />
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-sage-100 text-sage-800 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => setTags(tags.filter((_, i) => i !== index))}
                        className="text-sage-600 hover:text-sage-800"
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
              disabled={!content.trim() || addThoughtMutation.isPending}
              className="w-full bg-sage-600 hover:bg-sage-700"
            >
              {addThoughtMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('brainDump.adding')}
                </>
              ) : (
                t('brainDump.submit')
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
