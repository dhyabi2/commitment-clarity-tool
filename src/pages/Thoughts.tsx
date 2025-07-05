
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import BrainDump from '@/components/BrainDump';
import ActiveCommitments from '@/components/ActiveCommitments';
import ThoughtsList from '@/components/thoughts/ThoughtsList';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import ElegantLanguageSwitcher from '@/components/ElegantLanguageSwitcher';
import Navigation from '@/components/Navigation';
import { useThoughtsQuery } from '@/hooks/useThoughtsQuery';
import { useThoughtsMutations } from '@/hooks/useThoughtsMutations';

const Thoughts = () => {
  const { user } = useAuth();
  const { dir } = useLanguage();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  const { data: thoughts = [], isLoading } = useThoughtsQuery(selectedTag);
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
            {isLoading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-32 bg-sage-100 rounded-lg" />
                ))}
              </div>
            ) : (
              <ThoughtsList 
                thoughts={thoughts}
                onDelete={handleDelete}
                onToggleComplete={handleToggleComplete}
                selectedTag={selectedTag}
                onTagClick={handleTagClick}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Thoughts;
