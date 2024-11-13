import React from 'react';
import BrainDump from '@/components/BrainDump';
import ActiveCommitments from '@/components/ActiveCommitments';
import FAQ from '@/components/FAQ';
import { Card } from "@/components/ui/card";
import { Brain, ListTodo, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";

const Index = () => {
  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-b from-cream to-sage-50 relative px-4">
        <div className="text-center max-w-3xl mx-auto animate-fade-in">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-sage-700 mb-6 tracking-tight leading-tight">
            Welcome to Clear Mind
          </h1>
          <p className="text-lg sm:text-xl text-sage-600 mb-8 leading-relaxed max-w-2xl mx-auto">
            Transform your thoughts into clear, actionable commitments and achieve peace of mind.
          </p>
          <Button 
            onClick={scrollToContent}
            className="bg-sage-500 hover:bg-sage-600 text-white px-8 py-6 rounded-xl text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Get Started
          </Button>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-sage-500" />
        </div>
      </div>

      {/* Content Section */}
      <ScrollArea className="h-full bg-gradient-to-b from-cream to-sage-50">
        <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
          {/* Steps Section */}
          <div className="space-y-8">
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
                <Card className="bg-white/80 backdrop-blur-sm p-6 sm:p-8 border-sage-200 shadow-lg hover:shadow-xl transition-all duration-300">
                  <h2 className="text-xl font-semibold mb-4 text-sage-700">Review Your Active Commitments</h2>
                  <ActiveCommitments />
                </Card>
              </div>
            </div>
          </div>

          {/* FAQ Section with smooth reveal */}
          <div className="mt-16 opacity-0 animate-[fade-in_1s_ease-out_0.5s_forwards]">
            <FAQ />
          </div>
        </div>
      </ScrollArea>

      {/* Floating Action Button */}
      <div className="fixed bottom-20 md:bottom-4 right-4 z-10">
        <Link to="/thoughts">
          <Button className="bg-sage-500 hover:bg-sage-600 shadow-lg hover:shadow-xl transition-all duration-300 px-4 py-2 rounded-xl text-base font-medium">
            <Brain className="mr-2 h-4 w-4" />
            View All Thoughts
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;