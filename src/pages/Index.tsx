import React from 'react';
import BrainDump from '@/components/BrainDump';
import CommitmentClarifier from '@/components/CommitmentClarifier';
import ActiveCommitments from '@/components/ActiveCommitments';
import { Card } from "@/components/ui/card";
import { Brain, ArrowRight, ListTodo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-cream p-4 pb-20 md:pb-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-sage-600 mb-4">
            Welcome to Clear Mind
          </h1>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
            Follow these simple steps to organize your thoughts and create clear commitments.
          </p>
        </header>

        <div className="relative space-y-8">
          {/* Step 1 */}
          <div className="relative">
            <div className="absolute -left-4 sm:-left-8 top-6 flex items-center justify-center w-8 h-8 bg-sage-500 text-white rounded-full font-bold">
              1
            </div>
            <Card className="p-6 sm:p-8 ml-6 sm:ml-4">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-sage-100 p-3 rounded-full">
                    <Brain className="h-6 w-6 text-sage-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Start Here: Brain Dump</h2>
                    <p className="text-gray-600 mb-4">
                      Begin by capturing all your thoughts below. Don't worry about organizing them yet - just get them out of your head.
                    </p>
                    <BrainDump />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Visual connector */}
          <div className="flex justify-center">
            <ArrowRight className="h-8 w-8 text-sage-500 rotate-90" />
          </div>

          {/* Step 2 */}
          <div className="relative">
            <div className="absolute -left-4 sm:-left-8 top-6 flex items-center justify-center w-8 h-8 bg-sage-500 text-white rounded-full font-bold">
              2
            </div>
            <Card className="p-6 sm:p-8 ml-6 sm:ml-4">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-sage-100 p-3 rounded-full">
                    <ListTodo className="h-6 w-6 text-sage-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Turn Thoughts into Commitments</h2>
                    <p className="text-gray-600 mb-4">
                      Now, let's clarify your thoughts into specific, actionable commitments.
                    </p>
                    <CommitmentClarifier />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Step 3 */}
          <div className="relative mt-12">
            <div className="absolute -left-4 sm:-left-8 top-6 flex items-center justify-center w-8 h-8 bg-sage-500 text-white rounded-full font-bold">
              3
            </div>
            <div className="ml-6 sm:ml-4">
              <h2 className="text-xl font-semibold mb-6">Review Your Active Commitments</h2>
              <ActiveCommitments />
            </div>
          </div>
        </div>

        <div className="fixed bottom-20 md:bottom-4 right-4">
          <Link to="/thoughts">
            <Button className="bg-sage-500 hover:bg-sage-600 shadow-lg">
              <Brain className="mr-2 h-4 w-4" />
              View All Thoughts
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;