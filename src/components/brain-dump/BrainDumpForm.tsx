
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
  
  const { mutate: addThought, isPending } = useBrainDumpMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canCreateThought) {
      return; // This shouldn't happen as the form is hidden when limit is exceeded
    }
    
    if (!content.trim()) return;

    addThought(
      { content: content.trim(), tags },
      {
        onSuccess: () => {
          setContent('');
          setTags([]);
        }
      }
    );
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
              disabled={isPending}
            />
            
            <TagInput
              tags={tags}
              onTagsChange={setTags}
              placeholder={t('brainDump.tagPlaceholder')}
              disabled={isPending}
            />
            
            <Button 
              type="submit" 
              disabled={!content.trim() || isPending}
              className="w-full bg-sage-600 hover:bg-sage-700"
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
        </CardContent>
      </Card>
    </div>
  );
};
