import React from 'react';
import BrainDump from '@/components/BrainDump';
import ActiveCommitments from '@/components/ActiveCommitments';
import { Card } from "@/components/ui/card";
import { Brain, ListTodo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from '@/lib/i18n/LanguageContext';

const Index = () => {
  const { t, dir } = useLanguage();
  const isRTL = dir() === 'rtl';

  return (
    <div className="min-h-screen">
      <ScrollArea className="h-full bg-gradient-to-b from-cream to-sage-50">
        <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
          <div className="space-y-8">
            {/* Step 1 */}
            <div className="relative">
              <div className={`absolute ${isRTL ? '-right-4 sm:-right-8' : '-left-4 sm:-left-8'} top-6 flex items-center justify-center w-8 h-8 bg-sage-500 text-white rounded-full font-bold shadow-lg transform transition-transform hover:scale-110`}>
                1
              </div>
              <Card className={`p-6 sm:p-8 ${isRTL ? 'mr-6 sm:mr-4' : 'ml-6 sm:ml-4'} bg-white/80 backdrop-blur-sm border-sage-200 shadow-lg hover:shadow-xl transition-all duration-300`}>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-sage-100 p-3 rounded-xl shadow-inner">
                      <Brain className="h-6 w-6 text-sage-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-600 mb-4 leading-relaxed text-sm">
                        {t('index.step1.description')}
                      </p>
                      <BrainDump />
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className={`absolute ${isRTL ? '-right-4 sm:-right-8' : '-left-4 sm:-left-8'} top-6 flex items-center justify-center w-8 h-8 bg-sage-500 text-white rounded-full font-bold shadow-lg transform transition-transform hover:scale-110`}>
                2
              </div>
              <div className={`${isRTL ? 'mr-6 sm:mr-4' : 'ml-6 sm:ml-4'}`}>
                <Card className="bg-white/80 backdrop-blur-sm p-6 sm:p-8 border-sage-200 shadow-lg hover:shadow-xl transition-all duration-300">
                  <h2 className="text-xl font-semibold mb-4 text-sage-700">{t('index.step2.title')}</h2>
                  <ActiveCommitments />
                </Card>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default Index;