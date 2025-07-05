
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import BrainDump from '@/components/BrainDump';
import ActiveCommitments from '@/components/ActiveCommitments';
import ThoughtsList from '@/components/thoughts/ThoughtsList';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import ElegantLanguageSwitcher from '@/components/ElegantLanguageSwitcher';
import Navigation from '@/components/Navigation';

const Thoughts = () => {
  const { user } = useAuth();
  const { dir } = useLanguage();

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
            <ThoughtsList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Thoughts;
