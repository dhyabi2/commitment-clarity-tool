
import React from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Card } from "@/components/ui/card";
import { Quote } from "lucide-react";

const QuoteSection = () => {
  const { t, dir } = useLanguage();
  const isRTL = dir() === 'rtl';

  return (
    <Card className="p-6 bg-gradient-to-br from-sage-50 to-sage-100 border-sage-200 shadow-lg">
      <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className="flex-shrink-0 mt-1">
          <Quote className="h-8 w-8 text-sage-600" />
        </div>
        <blockquote className={`text-sage-800 leading-loose text-base italic font-serif ${isRTL ? 'text-right' : 'text-left'}`}>
          "{t('faq.quote')}"
        </blockquote>
      </div>
    </Card>
  );
};

export default QuoteSection;
