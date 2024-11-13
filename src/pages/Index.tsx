import React from 'react';
import BrainDump from '@/components/BrainDump';
import ActiveCommitments from '@/components/ActiveCommitments';
import FAQ from '@/components/FAQ';
import { Card } from "@/components/ui/card";
import { Brain, ListTodo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-sage-50 p-4 pb-20 md:pb-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-bold text-sage-600 mb-4 tracking-tight">
            Welcome to Clear Mind
          </h1>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Follow these simple steps to organize your thoughts and manage your commitments.
          </p>
        </header>

        <div className="relative space-y-6">
          {/* Step 1 */}
          <div className="relative">
            <div className="absolute -left-4 sm:-left-8 top-6 flex items-center justify-center w-8 h-8 bg-sage-500 text-white rounded-full font-bold shadow-lg transform transition-transform hover:scale-110">
              1
            </div>
            <Card className="p-6 sm:p-8 ml-6 sm:ml-4 bg-white/80 backdrop-blur-sm border-sage-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-sage-100 p-3 rounded-xl shadow-inner">
                    <Brain className="h-6 w-6 text-sage-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold mb-3 text-sage-700">Start Here: Brain Dump</h2>
                    <p className="text-gray-600 mb-4 leading-relaxed text-sm">
                      Begin by capturing all your thoughts below. Don't worry about organizing them yet - just get them out of your head.
                    </p>
                    <BrainDump />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Step 2 */}
          <div className="relative">
            <div className="absolute -left-4 sm:-left-8 top-6 flex items-center justify-center w-8 h-8 bg-sage-500 text-white rounded-full font-bold shadow-lg transform transition-transform hover:scale-110">
              2
            </div>
            <div className="ml-6 sm:ml-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-sage-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <h2 className="text-xl font-semibold mb-4 text-sage-700">Review Your Active Commitments</h2>
                <ActiveCommitments />
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-8">
            <FAQ />
          </div>
        </div>

        <div className="fixed bottom-20 md:bottom-4 right-4 z-10">
          <Link to="/thoughts">
            <Button className="bg-sage-500 hover:bg-sage-600 shadow-lg hover:shadow-xl transition-all duration-300 px-4 py-2 rounded-xl text-base font-medium">
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
