
import React from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import QuoteSection from './faq/QuoteSection';
import FAQSection from './faq/FAQSection';

const FAQ = () => {
  const { dir } = useLanguage();

  return (
    <div className="space-y-6" dir={dir()}>
      <QuoteSection />
      <FAQSection />
    </div>
  );
};

export default FAQ;
