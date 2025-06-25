
import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowRight, MessageSquare } from 'lucide-react';
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface Thought {
  id: number;
  content: string;
  created_at: string;
}

interface ThoughtSelectionStepProps {
  thoughts: Thought[] | undefined;
  selectedThought: Thought | null;
  onThoughtSelect: (thought: Thought) => void;
  onNext: () => void;
}

const ThoughtSelectionStep = ({ 
  thoughts, 
  selectedThought, 
  onThoughtSelect, 
  onNext 
}: ThoughtSelectionStepProps) => {
  const { t, dir } = useLanguage();
  const isRTL = dir() === 'rtl';

  return (
    <>
      <div className="flex items-center gap-3 mb-4">
        <MessageSquare className="h-8 w-8 text-sage-600" />
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-sage-600">
            {t('commitments.clarifier.title')}
          </h1>
          <p className="text-sage-500 text-base md:text-lg">
            Step 1: Select a thought
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <Label className="text-base font-medium text-gray-700">
            Which thought would you like to clarify into a commitment?
          </Label>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {thoughts?.map((thought) => (
              <div
                key={thought.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedThought?.id === thought.id
                    ? 'border-sage-500 bg-sage-50'
                    : 'border-gray-200 hover:border-sage-300 hover:bg-gray-50'
                }`}
                onClick={() => onThoughtSelect(thought)}
              >
                <p className="text-gray-700 text-sm">{thought.content}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(thought.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        <Button 
          onClick={onNext}
          className="w-full bg-sage-500 hover:bg-sage-600 min-h-[56px] text-lg"
          disabled={!selectedThought}
        >
          {t('commitments.clarifier.nextButton')}
          <ArrowRight className={`h-5 w-5 ${isRTL ? 'mr-3 rotate-180' : 'ml-3'}`} />
        </Button>
      </div>
    </>
  );
};

export default ThoughtSelectionStep;
