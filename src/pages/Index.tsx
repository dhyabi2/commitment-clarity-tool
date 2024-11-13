import React from 'react';
import BrainDump from '@/components/BrainDump';
import CommitmentClarifier from '@/components/CommitmentClarifier';
import ActiveCommitments from '@/components/ActiveCommitments';

const Index = () => {
  return (
    <div className="min-h-screen bg-cream p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-sage-600 mb-4">
            Clear Mind, Clear Path
          </h1>
          <p className="text-gray-600">
            Capture your thoughts, clarify your commitments, and stay organized.
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <BrainDump />
          </div>
          <div>
            <CommitmentClarifier />
          </div>
        </div>

        <div className="mt-12">
          <ActiveCommitments />
        </div>
      </div>
    </div>
  );
};

export default Index;