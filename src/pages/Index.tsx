import React from 'react';
import BrainDump from '@/components/BrainDump';
import CommitmentClarifier from '@/components/CommitmentClarifier';
import ActiveCommitments from '@/components/ActiveCommitments';

const Index = () => {
  return (
    <div className="min-h-screen bg-cream p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        <header className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-sage-600 mb-3 sm:mb-4">
            Clear Mind, Clear Path
          </h1>
          <p className="text-gray-600 text-sm sm:text-base px-4">
            Capture your thoughts, clarify your commitments, and stay organized.
          </p>
        </header>

        <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2">
          <div className="w-full">
            <BrainDump />
          </div>
          <div className="w-full">
            <CommitmentClarifier />
          </div>
        </div>

        <div className="mt-8 sm:mt-12">
          <ActiveCommitments />
        </div>
      </div>
    </div>
  );
};

export default Index;