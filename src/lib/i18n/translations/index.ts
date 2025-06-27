
import { authTranslations } from './auth';
import { pwaTranslations } from './pwa';
import { faqTranslations } from './faq';
import { navigationTranslations } from './navigation';
import { contentTranslations } from './content';

// Helper function to merge translation objects
const mergeTranslations = (lang: 'en' | 'ar') => {
  return {
    ...authTranslations[lang],
    ...pwaTranslations[lang],
    ...faqTranslations[lang],
    ...navigationTranslations[lang],
    ...contentTranslations[lang]
  };
};

export const translations = {
  en: mergeTranslations('en'),
  ar: mergeTranslations('ar')
};
