
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Brain, Loader2 } from "lucide-react";
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { TagInput } from '@/components/thoughts/TagInput';
import { useBrainDumpMutation } from './useBrainDumpMutation';
import BrainDumpUpgradePrompt from './BrainDumpUpgradePrompt';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import SignInModal from '@/components/auth/SignInModal';

const BrainDumpForm = () => {
  const { t } = useLanguage();
  const [thought, setThought] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  const { executeWithAuth, showSignInModal, setShowSignInModal, modalConfig } = useAuthGuard();

  const { addThoughtMutation } = useBrainDumpMutation({
    onSuccess: () => {
      setThought('');
      setTags([]);
    },
    onLimitReached: () => {
      setShowUpgradePrompt(true);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!thought.trim()) return;

    executeWithAuth(
      () => {
        addThoughtMutation.mutate({
          content: thought.trim(),
          tags
        });
      },
      { thought: thought.trim(), tags },
      {
        title: "Sign in to capture your thoughts",
        description: "Create an account to securely save your thoughts and access them from anywhere."
      }
    );
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
                value={thought}
                onChange={(e) => setThought(e.target.value)}
                placeholder={t('thoughts.placeholder')}
                className="min-h-[120px] resize-none border-sage-200 focus:border-sage-400 focus:ring-sage-200 bg-white/70"
                disabled={addThoughtMutation.isPending}
              />
            </div>

            <div>
              <TagInput
                value={tags}
                onChange={setTags}
                placeholder="Add tags (optional)..."
                disabled={addThoughtMutation.isPending}
              />
            </div>

            <Button
              type="submit"
              disabled={!thought.trim() || addThoughtMutation.isPending}
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

      <SignInModal
        open={showSignInModal}
        onOpenChange={setShowSignInModal}
        title={modalConfig.title}
        description={modalConfig.description}
      />

      <BrainDumpUpgradePrompt
        open={showUpgradePrompt}
        onOpenChange={setShowUpgradePrompt}
      />
    </>
  );
};

export default BrainDumpForm;
