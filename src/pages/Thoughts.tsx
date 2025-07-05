
import React, { useState } from 'react';
import BrainDump from '@/components/BrainDump';
import ThoughtsList from '@/components/thoughts/ThoughtsList';
import { ThoughtsHeader } from '@/components/thoughts/ThoughtsHeader';
import { SecureImportExport } from '@/components/thoughts/SecureImportExport';
import { TagManager } from '@/components/thoughts/TagManager';
import { useAnonymousMode } from '@/hooks/useAnonymousMode';
import AnonymousDataIndicator from '@/components/home/AnonymousDataIndicator';
import { useThoughtsQuery } from '@/hooks/useThoughtsQuery';
import { useDeviceThoughtsQuery } from '@/hooks/useDeviceThoughtsQuery';
import { useThoughtsMutations } from '@/hooks/useThoughtsMutations';
import { useDeviceThoughtsMutations } from '@/hooks/useDeviceThoughtsMutations';
import { useSecureImportExport } from '@/hooks/useSecureImportExport';

const Thoughts = () => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const { isAnonymous } = useAnonymousMode();
  const { exportData } = useSecureImportExport();

  // Use appropriate hooks based on anonymous mode
  const thoughtsQuery = isAnonymous ? useDeviceThoughtsQuery() : useThoughtsQuery();
  const thoughtsMutations = isAnonymous ? useDeviceThoughtsMutations() : useThoughtsMutations();

  const thoughts = thoughtsQuery.data || [];
  
  // Get unique tags from all thoughts
  const allTags = Array.from(new Set(thoughts.flatMap(thought => thought.tags?.map(tag => tag.name) || []))).sort();

  // Filter thoughts by selected tag
  const filteredThoughts = selectedTag 
    ? thoughts.filter(thought => thought.tags?.some(tag => tag.name === selectedTag))
    : thoughts;

  const handleExport = () => {
    if (!isAnonymous) {
      exportData();
    }
  };

  const handleImportClick = () => {
    // Import functionality is handled by SecureImportExport component
    console.log('Import clicked');
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <ThoughtsHeader onExport={handleExport} onImportClick={handleImportClick} />
      
      {/* Show anonymous mode indicator */}
      {isAnonymous && (
        <div className="mb-6">
          <AnonymousDataIndicator />
        </div>
      )}
      
      <div className="mb-6">
        <BrainDump />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <TagManager 
            allTags={allTags}
            selectedTag={selectedTag} 
            onTagClick={setSelectedTag} 
          />
        </div>
        
        <div className="lg:col-span-3 space-y-6">
          <ThoughtsList 
            thoughts={filteredThoughts}
            onDelete={thoughtsMutations.deleteThought}
            onToggleComplete={thoughtsMutations.toggleComplete}
            selectedTag={selectedTag}
            onTagClick={setSelectedTag}
          />
          
          {!isAnonymous && (
            <div className="mt-8">
              <SecureImportExport />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Thoughts;
