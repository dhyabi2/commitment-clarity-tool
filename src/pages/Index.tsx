import React from 'react';
import BrainDump from '@/components/BrainDump';
import ActiveCommitments from '@/components/ActiveCommitments';
import { Card } from "@/components/ui/card";
import { Brain, ListTodo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-sage-50 p-4 pb-20 md:pb-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl font-bold text-sage-600 mb-6 tracking-tight">
            Welcome to Clear Mind
          </h1>
          <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Follow these simple steps to organize your thoughts and manage your commitments.
          </p>
        </header>

        <div className="relative space-y-12">
          {/* Step 1 */}
          <div className="relative">
            <div className="absolute -left-4 sm:-left-8 top-6 flex items-center justify-center w-10 h-10 bg-sage-500 text-white rounded-full font-bold shadow-lg transform transition-transform hover:scale-110">
              1
            </div>
            <Card className="p-8 sm:p-10 ml-6 sm:ml-4 bg-white/80 backdrop-blur-sm border-sage-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="space-y-6">
                <div className="flex items-start gap-6">
                  <div className="bg-sage-100 p-4 rounded-2xl shadow-inner">
                    <Brain className="h-8 w-8 text-sage-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold mb-4 text-sage-700">Start Here: Brain Dump</h2>
                    <p className="text-gray-600 mb-6 leading-relaxed">
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
            <div className="absolute -left-4 sm:-left-8 top-6 flex items-center justify-center w-10 h-10 bg-sage-500 text-white rounded-full font-bold shadow-lg transform transition-transform hover:scale-110">
              2
            </div>
            <div className="ml-6 sm:ml-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-8 border border-sage-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <h2 className="text-2xl font-semibold mb-6 text-sage-700">Review Your Active Commitments</h2>
                <ActiveCommitments />
              </div>
            </div>
          </div>
        </div>

        <div className="fixed bottom-20 md:bottom-4 right-4 z-10">
          <Link to="/thoughts">
            <Button className="bg-sage-500 hover:bg-sage-600 shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-6 rounded-xl text-lg font-medium">
              <Brain className="mr-3 h-5 w-5" />
              View All Thoughts
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;