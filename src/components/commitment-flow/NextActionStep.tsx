
import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Check, Clock } from 'lucide-react';
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface Thought {
  id: number;
  content: string;
  created_at: string;
}

interface NextActionStepProps {
  selectedThought: Thought | null;
  outcome: string;
  nextAction: string;
  onNextActionChange: (nextAction: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isPending: boolean;
}

const NextActionStep = ({ 
  selectedThought, 
  outcome, 
  nextAction, 
  onNextActionChange, 
  onSubmit, 
  isPending 
}: NextActionStepProps) => {
  const { t, dir } = useLanguage();
  const isRTL = dir() === 'rtl';

  return (
    <>
      <div className="flex items-center gap-3 mb-4">
        <Clock className="h-8 w-8 text-sage-600" />
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-sage-600">
            {t('commitments.clarifier.title')}
          </h1>
          <p className="text-sage-500 text-base md:text-lg">
            Step 3: Plan your action
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {selectedThought && (
          <div className="bg-sage-50 p-4 rounded-lg border border-sage-200">
            <Label className="text-sm font-medium text-sage-600 mb-2 block">
              Selected Thought
            </Label>
            <p className="text-gray-700 text-sm mb-3">{selectedThought.content}</p>
            
            <Label className="text-sm font-medium text-sage-600 mb-2 block">
              {t('commitments.clarifier.outcomeLabel')}
            </Label>
            <p className="text-gray-700 text-sm">{outcome}</p>
          </div>
        )}

        <div className="space-y-3">
          <Label htmlFor="nextAction" className="text-base font-medium text-gray-700">
            {t('commitments.clarifier.nextActionQuestion')}
          </Label>
          <Textarea
            id="nextAction"
            placeholder={t('commitments.clarifier.nextActionPlaceholder')}
            value={nextAction}
            onChange={(e) => onNextActionChange(e.target.value)}
            className="min-h-[120px] text-base leading-relaxed p-4"
            autoFocus
          />
        </div>

        <Button 
          type="submit" 
          className="w-full bg-sage-500 hover:bg-sage-600 min-h-[56px] text-lg"
          disabled={!nextAction.trim() || isPending}
        >
          <Check className={`h-5 w-5 ${isRTL ? 'ml-3' : 'mr-3'}`} />
          {t('commitments.clarifier.submitButton')}
        </Button>
      </form>
    </>
  );
};

export default NextActionStep;
