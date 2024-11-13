import React from 'react';
import BrainDump from '@/components/BrainDump';
import CommitmentClarifier from '@/components/CommitmentClarifier';
import ActiveCommitments from '@/components/ActiveCommitments';
import { Card } from "@/components/ui/card";
import { Brain, CheckSquare } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-cream p-4 pb-20 md:pb-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-sage-600 mb-3">
            Welcome to Clear Mind
          </h1>
          <p className="text-gray-600 text-sm sm:text-base px-4 max-w-2xl mx-auto">
            Start by capturing your thoughts, then clarify them into actionable commitments.
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 mb-8">
          <Link to="/thoughts" className="group">
            <Card className="p-6 h-full hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <Brain className="h-6 w-6 text-sage-500" />
                <h2 className="text-xl font-semibold">Brain Dump</h2>
              </div>
              <p className="text-gray-600 text-sm">
                Quickly capture your thoughts and ideas. Don't worry about organizing them yet.
              </p>
            </Card>
          </Link>

          <Card className="p-6 h-full">
            <div className="flex items-center gap-3 mb-4">
              <CheckSquare className="h-6 w-6 text-sage-500" />
              <h2 className="text-xl font-semibold">Active Commitments</h2>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Turn your thoughts into clear, actionable commitments.
            </p>
          </Card>
        </div>

        <div className="space-y-8">
          <BrainDump />
          <CommitmentClarifier />
          <ActiveCommitments />
        </div>
      </div>
    </div>
  );
};

export default Index;