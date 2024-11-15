import React from 'react';
import BrainDump from '@/components/BrainDump';
import ActiveCommitments from '@/components/ActiveCommitments';
import { Card } from "@/components/ui/card";
import { Brain, ListTodo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";

const Index = () => {
  return (
    <div className="min-h-screen">
      <ScrollArea className="h-full bg-gradient-to-b from-cream to-sage-50">
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
          <div className="space-y-6">
            <div className="relative">
              <div className="absolute -left-4 sm:-left-8 top-6 flex items-center justify-center w-8 h-8 bg-sage-500 text-white rounded-full font-bold shadow-lg">
                1
              </div>
              <Card className="p-6 sm:p-8 ml-6 sm:ml-4 bg-white/80 backdrop-blur-sm border-sage-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-sage-100 p-3 rounded-xl shadow-inner">
                      <Brain className="h-6 w-6 text-sage-600" />
                    </div>
                    <div className="flex-1">
                      <BrainDump />
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="relative">
              <div className="absolute -left-4 sm:-left-8 top-6 flex items-center justify-center w-8 h-8 bg-sage-500 text-white rounded-full font-bold shadow-lg">
                2
              </div>
              <div className="ml-6 sm:ml-4">
                <Card className="bg-white/80 backdrop-blur-sm p-6 sm:p-8 border-sage-200 shadow-lg hover:shadow-xl transition-all duration-300">
                  <ActiveCommitments />
                </Card>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="fixed bottom-20 md:bottom-4 right-4 z-10">
        <Link to="/thoughts">
          <Button className="bg-sage-500 hover:bg-sage-600 shadow-lg hover:shadow-xl transition-all duration-300 px-4 py-2 rounded-xl text-base font-medium">
            <Brain className="mr-2 h-4 w-4" />
            View All
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;