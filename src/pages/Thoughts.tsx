
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAnonymousMode } from '@/hooks/useAnonymousMode';
import BrainDump from '@/components/BrainDump';
import ActiveCommitments from '@/components/ActiveCommitments';
import ThoughtsList from '@/components/thoughts/ThoughtsList';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import ElegantLanguageSwitcher from '@/components/ElegantLanguageSwitcher';
import Navigation from '@/components/Navigation';
import { useThoughtsQuery } from '@/hooks/useThoughtsQuery';
import { useThoughtsMutations } from '@/hooks/useThoughtsMutations';
import { Loader2 } from 'lucide-react';

const Thoughts = () => {
  const { user } = useAuth();
  const { isAnonymous } = useAnonymousMode();
  const { dir } = useLanguage();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  const { data: thoughts = [], isLoading, error } = useThoughtsQuery(selectedTag);
  const { deleteThoughtMutation, toggleCompleteMutation } = useThoughtsMutations();

  const handleDelete = (id: number) => {
    deleteThoughtMutation.mutate(id);
  };

  const handleToggleComplete = (id: number, completed: boolean) => {
    toggleCompleteMutation.mutate({ thoughtId: id, completed });
  };

  const handleTagClick = (tag: string | null) => {
    setSelectedTag(tag);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-sage-500" />
      </div>
    );
  }

  // Show error state
  if (error) {
    console.error('Error loading thoughts:', error);
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load thoughts</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-sage-500 text-white rounded hover:bg-sage-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream" dir={dir()}>
      <Navigation />
      
      {/* Mobile Language Switcher */}
      <div className="md:hidden px-4 py-2 flex justify-center">
        <ElegantLanguageSwitcher />
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <BrainDump />
            <ActiveCommitments />
          </div>
          <div>
            <ThoughtsList 
              thoughts={thoughts}
              onDelete={handleDelete}
              onToggleComplete={handleToggleComplete}
              selectedTag={selectedTag}
              onTagClick={handleTagClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Thoughts;
