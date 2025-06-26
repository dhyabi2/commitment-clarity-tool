
import React from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Quote } from "lucide-react";

const QuoteSection = () => {
  const { t, dir } = useLanguage();
  const isRTL = dir() === 'rtl';

  return (
    <Card className="p-6 bg-gradient-to-br from-sage-50 to-sage-100 border-sage-200 shadow-lg animate-fade-in">
      <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className="flex-shrink-0 mt-1 animate-scale-in">
          <Quote className="h-8 w-8 text-sage-600" />
        </div>
        <div className={`text-sage-800 leading-loose text-base font-serif ${isRTL ? 'text-right' : 'text-left'} animate-slide-in-right flex-1`}>
          <h3 className="text-lg font-bold text-sage-700 mb-3">
            {t('faq.quoteTitle')}
          </h3>
          
          <ScrollArea className="h-[70vh] pr-4">
            <div className="space-y-4">
              <p className="mb-4">
                {t('faq.quoteIntro')}
              </p>
              <ul className="space-y-3 list-none">
                <li className="flex items-start gap-2">
                  <span className="text-sage-600 font-bold">•</span>
                  <span>{t('faq.quotePoint1')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sage-600 font-bold">•</span>
                  <span>{t('faq.quotePoint2')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sage-600 font-bold">•</span>
                  <span>{t('faq.quotePoint3')}</span>
                </li>
              </ul>
              <div className="mt-6 pt-4 border-t border-sage-200">
                <h4 className="text-md font-semibold text-sage-700 mb-3">
                  {t('faq.exerciseTitle')}
                </h4>
                <div className="space-y-3 text-sm leading-relaxed">
                  <p>{t('faq.exerciseText1')}</p>
                  <p>{t('faq.exerciseText2')}</p>
                  <p>{t('faq.exerciseText3')}</p>
                  <p>{t('faq.exerciseText4')}</p>
                  <p>{t('faq.exerciseText5')}</p>
                  <p>{t('faq.exerciseText6')}</p>
                  <p>{t('faq.exerciseText7')}</p>
                  <p>{t('faq.exerciseText8')}</p>
                  <p>{t('faq.exerciseText9')}</p>
                  <p>{t('faq.exerciseText10')}</p>
                  <p>{t('faq.exerciseText11')}</p>
                  <p>{t('faq.exerciseText12')}</p>
                  <p>{t('faq.exerciseText13')}</p>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </Card>
  );
};

export default QuoteSection;
