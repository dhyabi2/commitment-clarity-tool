import React from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const FAQ = () => {
  const { t, dir } = useLanguage();
  const isRTL = dir() === 'rtl';

  return (
    <Card className="p-4 sm:p-6 bg-white/80 backdrop-blur-sm" dir={dir()}>
      <h2 className={`text-xl sm:text-2xl font-semibold mb-4 text-sage-700 ${isRTL ? 'text-right' : 'text-left'}`}>
        {t('faq.title')}
      </h2>
      <ScrollArea className="h-[60vh]">
        <Accordion type="single" collapsible className="space-y-2" dir={dir()}>
          <AccordionItem value="item-1">
            <AccordionTrigger className={`${isRTL ? 'text-right' : 'text-left'} w-full`} dir={dir()}>
              {t('faq.q1')}
            </AccordionTrigger>
            <AccordionContent className={`${isRTL ? 'text-right' : 'text-left'}`}>
              {t('faq.a1')}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className={`${isRTL ? 'text-right' : 'text-left'} w-full`} dir={dir()}>
              {t('faq.q2')}
            </AccordionTrigger>
            <AccordionContent className={`${isRTL ? 'text-right' : 'text-left'}`}>
              {t('faq.a2')}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger className={`${isRTL ? 'text-right' : 'text-left'} w-full`} dir={dir()}>
              {t('faq.q3')}
            </AccordionTrigger>
            <AccordionContent className={`${isRTL ? 'text-right' : 'text-left'}`}>
              <ol className={`list-decimal ${isRTL ? 'mr-4' : 'ml-4'} space-y-2`}>
                <li>{t('faq.a3_1')}</li>
                <li>{t('faq.a3_2')}</li>
                <li>{t('faq.a3_3')}</li>
              </ol>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger className={`${isRTL ? 'text-right' : 'text-left'} w-full`} dir={dir()}>
              {t('faq.q4')}
            </AccordionTrigger>
            <AccordionContent className={`${isRTL ? 'text-right' : 'text-left'}`}>
              {t('faq.a4')}
              <ol className={`list-decimal ${isRTL ? 'mr-4' : 'ml-4'} mt-2 space-y-2`}>
                <li>{t('faq.a4_1')}</li>
                <li>{t('faq.a4_2')}</li>
              </ol>
              {t('faq.a4_desc')}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger className={`${isRTL ? 'text-right' : 'text-left'} w-full`} dir={dir()}>
              {t('faq.q5')}
            </AccordionTrigger>
            <AccordionContent className={`${isRTL ? 'text-right' : 'text-left'}`}>
              {t('faq.a5')}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-6">
            <AccordionTrigger className={`${isRTL ? 'text-right' : 'text-left'} w-full`} dir={dir()}>
              {t('faq.q6')}
            </AccordionTrigger>
            <AccordionContent className={`${isRTL ? 'text-right' : 'text-left'}`}>
              {t('faq.a6')}
              <ul className={`list-disc ${isRTL ? 'mr-4' : 'ml-4'} mt-2 space-y-2`}>
                <li>{t('faq.a6_1')}</li>
                <li>{t('faq.a6_2')}</li>
                <li>{t('faq.a6_3')}</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ScrollArea>
    </Card>
  );
};

export default FAQ;