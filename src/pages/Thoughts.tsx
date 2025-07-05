import React, { useState, useCallback } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Plus, Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

import { useThoughtsQuery } from '@/hooks/useThoughtsQuery';
import { useDeviceThoughtsQuery } from '@/hooks/useDeviceThoughtsQuery';
import { useThoughtsMutations } from '@/hooks/useThoughtsMutations';
import { useDeviceThoughtsMutations } from '@/hooks/useDeviceThoughtsMutations';

import ThoughtCard from '@/components/thoughts/ThoughtCard';
import TagList from '@/components/thoughts/TagList';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { getDeviceId } from '@/utils/deviceId';
import SignInModal from '@/components/auth/SignInModal';

const Thoughts = () => {
  const { user } = useAuth();
  const { t, dir } = useLanguage();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  // Use appropriate query based on authentication status
  const thoughtsQuery = user ? 
    useThoughtsQuery(selectedTag) : 
    useDeviceThoughtsQuery(selectedTag);

  const mutations = user ? 
    useThoughtsMutations() : 
    useDeviceThoughtsMutations();

  const [open, setOpen] = React.useState(false)
  const [newTag, setNewTag] = useState('');
  const [thoughtId, setThoughtId] = useState<number | null>(null);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

  const handleAddTagClick = (id: number) => {
    if (!user) {
      setIsSignInModalOpen(true);
      return;
    }
    setThoughtId(id);
    setOpen(true);
  };

  const handleAddTag = async () => {
    if (!newTag.trim() || !thoughtId) return;
    await mutations.addTagMutation.mutateAsync({ thoughtId, tagName: newTag.trim() });
    setOpen(false);
    setNewTag('');
  };

  const handleTagClick = useCallback((tag: string) => {
    setSelectedTag(prevTag => prevTag === tag ? null : tag);
  }, []);

  if (thoughtsQuery.isLoading) return <div>{t('loading') || 'Loading...'}</div>;
  if (thoughtsQuery.isError) return <div>Error: {thoughtsQuery.error.message}</div>;

  return (
    <div dir={dir()}>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('thoughts.title') || 'Thoughts'}</h1>
        {/* <Link to="/commitment-flow">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t('thoughts.addCommitment') || 'Add Commitment'}
          </Button>
        </Link> */}
      </div>

      <TagList 
        tags={thoughtsQuery.data?.reduce((allTags: string[], thought) => {
          thought.tags?.forEach(tag => {
            if (!allTags.includes(tag.name)) {
              allTags.push(tag.name);
            }
          });
          return allTags;
        }, []) || []}
        selectedTag={selectedTag}
        onTagClick={handleTagClick}
      />

      {thoughtsQuery.data?.length === 0 ? (
        <div className="text-gray-500 mt-4">
          {t('thoughts.noThoughts') || 'No thoughts yet. Start dumping your mind!'}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {thoughtsQuery.data?.map(thought => (
            <ThoughtCard
              key={thought.id}
              thought={thought}
              onDelete={() => mutations.deleteThoughtMutation.mutate(thought.id)}
              onToggleComplete={() => mutations.toggleCompleteMutation.mutate({ 
                thoughtId: thought.id, 
                completed: !thought.completed 
              })}
              onAddTag={() => handleAddTagClick(thought.id)}
            />
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('thoughts.addTagTitle') || 'Add a tag'}</DialogTitle>
            <DialogDescription>
              {t('thoughts.addTagDescription') || 'Add a new tag to your thought to categorize it.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">{t('thoughts.tagName') || 'Tag name'}</Label>
              <Input id="name" value={newTag} onChange={(e) => setNewTag(e.target.value)} className="col-span-3" />
            </div>
          </div>
          <Button onClick={handleAddTag}>{t('thoughts.addTagButton') || 'Add tag'}</Button>
        </DialogContent>
      </Dialog>

      <SignInModal 
        open={isSignInModalOpen} 
        onOpenChange={setIsSignInModalOpen} 
        title={t('auth.signInRequired') || "Sign in required"}
        description={t('auth.signInDescriptionAction') || "Please sign in to use this feature and save your data securely."}
      />
    </div>
  );
};

export default Thoughts;
