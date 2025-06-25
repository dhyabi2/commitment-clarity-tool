
import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowRight, Target } from 'lucide-react';
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface Thought {
  id: number;
  content: string;
  created_at: string;
}

interface OutcomeDefinitionStepProps {
  selectedThought: Thought | null;
  outcome: string;
  onOutcomeChange: (outcome: string) => void;
  onNext: () => void;
}

const OutcomeDefinitionStep = ({ 
  selectedThought, 
  outcome, 
  onOutcomeChange, 
  onNext 
}: OutcomeDefinitionStepProps) => {
  const { t, dir } = useLanguage();
  const isRTL = dir() === 'rtl';

  return (
    <>
      <div className="flex items-center gap-3 mb-4">
        <Target className="h-8 w-8 text-sage-600" />
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-sage-600">
            {t('commitments.clarifier.title')}
          </h1>
          <p className="text-sage-500 text-base md:text-lg">
            Step 2: Define your outcome
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {selectedThought && (
          <div className="bg-sage-50 p-4 rounded-lg border border-sage-200">
            <Label className="text-sm font-medium text-sage-600 mb-2 block">
              Selected Thought
            </Label>
            <p className="text-gray-700 text-sm">{selectedThought.content}</p>
          </div>
        )}

        <div className="space-y-3">
          <Label htmlFor="outcome" className="text-base font-medium text-gray-700">
            {t('commitments.clarifier.outcomeQuestion')}
          </Label>
          <Textarea
            id="outcome"
            placeholder={t('commitments.clarifier.outcomePlaceholder')}
            value={outcome}
            onChange={(e) => onOutcomeChange(e.target.value)}
            className="min-h-[120px] text-base leading-relaxed p-4"
            autoFocus
          />
        </div>

        <Button 
          onClick={onNext}
          className="w-full bg-sage-500 hover:bg-sage-600 min-h-[56px] text-lg"
          disabled={!outcome.trim()}
        >
          {t('commitments.clarifier.nextButton')}
          <ArrowRight className={`h-5 w-5 ${isRTL ? 'mr-3 rotate-180' : 'ml-3'}`} />
        </Button>
      </div>
    </>
  );
};

export default OutcomeDefinitionStep;
