
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Brain, Loader2 } from "lucide-react";
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { TagInput } from '@/components/thoughts/TagInput';
import { useBrainDumpMutation } from './useBrainDumpMutation';
import { BrainDumpUpgradePrompt } from './BrainDumpUpgradePrompt';
import { useAuth } from '@/contexts/AuthContext';

const BrainDumpForm = () => {
  const { t, dir } = useLanguage();
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  const { addThoughtMutation } = useBrainDumpMutation({
    onSuccess: () => {
      setContent('');
      setTags([]);
    },
    onLimitReached: () => {
      setShowUpgradePrompt(true);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    await addThoughtMutation.mutateAsync({
      content: content.trim(),
      tags: tags.map(tag => tag.trim()).filter(tag => tag.length > 0)
    });
  };

  const handleTagAdd = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  return (
    <>
      <Card className="card-content bg-white/80 backdrop-blur-sm border-sage-200 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-sage-100 rounded-full">
              <Brain className="h-5 w-5 text-sage-600" />
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-sage-700">
              {t('thoughts.captureTitle')}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={t('thoughts.placeholder')}
                className="min-h-[120px] resize-none border-sage-200 focus:border-sage-400 focus:ring-sage-200 bg-white/70"
                disabled={addThoughtMutation.isPending}
              />
            </div>

            <div>
              <TagInput
                onTagAdd={handleTagAdd}
                placeholder="Add tags (optional)..."
                existingTags={tags}
              />
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-sage-100 text-sage-700"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => setTags(tags.filter((_, i) => i !== index))}
                        className="ml-1 text-sage-500 hover:text-sage-700"
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
              className="w-full bg-sage-500 hover:bg-sage-600 text-white font-medium py-3 text-base transition-colors"
            >
              {addThoughtMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t('thoughts.capturing')}
                </>
              ) : (
                t('thoughts.captureButton')
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {showUpgradePrompt && (
        <div className="mt-4">
          <BrainDumpUpgradePrompt
            open={showUpgradePrompt}
            onOpenChange={setShowUpgradePrompt}
          />
        </div>
      )}
    </>
  );
};

export default BrainDumpForm;
