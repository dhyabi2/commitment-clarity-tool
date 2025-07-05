
import React, { useState } from 'react';
import { BrainDump } from '@/components/BrainDump';
import { ThoughtsList } from '@/components/thoughts/ThoughtsList';
import { ThoughtsHeader } from '@/components/thoughts/ThoughtsHeader';
import { SecureImportExport } from '@/components/thoughts/SecureImportExport';
import { TagManager } from '@/components/thoughts/TagManager';
import { useAnonymousMode } from '@/hooks/useAnonymousMode';
import AnonymousDataIndicator from '@/components/home/AnonymousDataIndicator';

const Thoughts = () => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const { isAnonymous } = useAnonymousMode();

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <ThoughtsHeader />
      
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
            selectedTag={selectedTag} 
            onTagSelect={setSelectedTag} 
          />
        </div>
        
        <div className="lg:col-span-3 space-y-6">
          <ThoughtsList selectedTag={selectedTag} />
          
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
