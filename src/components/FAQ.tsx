import React from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";

const FAQ = () => {
  const { t, dir } = useLanguage();
  const isRTL = dir() === 'rtl';

  return (
    <Card className="p-4 sm:p-6 bg-white/80 backdrop-blur-sm" dir={dir()}>
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-sage-700">{t('faq.title')}</h2>
      <Accordion type="single" collapsible className="space-y-2">
        <AccordionItem value="item-1">
          <AccordionTrigger>
            {t('faq.q1')}
          </AccordionTrigger>
          <AccordionContent>
            {t('faq.a1')}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>
            {t('faq.q2')}
          </AccordionTrigger>
          <AccordionContent>
            {t('faq.a2')}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>
            {t('faq.q3')}
          </AccordionTrigger>
          <AccordionContent>
            <ol className={`list-decimal ${isRTL ? 'pr-4' : 'pl-4'} space-y-2`}>
              <li>{t('faq.a3_1')}</li>
              <li>{t('faq.a3_2')}</li>
              <li>{t('faq.a3_3')}</li>
            </ol>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger>
            {t('faq.q4')}
          </AccordionTrigger>
          <AccordionContent>
            {t('faq.a4')}
            <ol className={`list-decimal ${isRTL ? 'pr-4' : 'pl-4'} mt-2 space-y-2`}>
              <li>{t('faq.a4_1')}</li>
              <li>{t('faq.a4_2')}</li>
            </ol>
            {t('faq.a4_desc')}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-5">
          <AccordionTrigger>
            {t('faq.q5')}
          </AccordionTrigger>
          <AccordionContent>
            {t('faq.a5')}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};

export default FAQ;