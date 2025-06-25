
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface ProgressHeaderProps {
  step: number;
  totalSteps: number;
  onBack: () => void;
}

const ProgressHeader = ({ step, totalSteps, onBack }: ProgressHeaderProps) => {
  const { t, dir } = useLanguage();
  const isRTL = dir() === 'rtl';
  const progressPercentage = (step / totalSteps) * 100;

  return (
    <div className="flex items-center gap-4 mb-6">
      <Button
        variant="ghost"
        className="text-base"
        onClick={onBack}
      >
        <ArrowLeft className={`h-5 w-5 ${isRTL ? 'ml-3 rotate-180' : 'mr-3'}`} />
        {t('common.back')}
      </Button>
      
      <div className="flex-1 bg-gray-200 rounded-full h-2">
        <div 
          className="bg-sage-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      <span className="text-sm text-gray-600">{step}/{totalSteps}</span>
    </div>
  );
};

export default ProgressHeader;
