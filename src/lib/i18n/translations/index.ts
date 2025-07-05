
import { authTranslations } from './auth';
import { pwaTranslations } from './pwa';
import { faqTranslations } from './faq';
import { navigationTranslations } from './navigation';
import { homeTranslations } from './home';
import { thoughtsTranslations } from './thoughts';
import { commitmentsTranslations } from './commitments';
import { subscriptionTranslations } from './subscription';
import { dashboardTranslations } from './dashboard';
import { commonTranslations } from './common';
import { componentsTranslations } from './components';
import { profileTranslations } from './profile';
import { commitmentFlowTranslations } from './commitmentFlow';
import { brainDumpTranslations } from './brainDump';
import { welcomeTranslations } from './welcome';

// Helper function to merge translation objects
const mergeTranslations = (lang: 'en' | 'ar') => {
  return {
    ...authTranslations[lang],
    ...pwaTranslations[lang],
    ...faqTranslations[lang],
    ...navigationTranslations[lang],
    ...homeTranslations[lang],
    ...thoughtsTranslations[lang],
    ...commitmentsTranslations[lang],
    ...subscriptionTranslations[lang],
    ...dashboardTranslations[lang],
    ...commonTranslations[lang],
    ...componentsTranslations[lang],
    ...profileTranslations[lang],
    ...commitmentFlowTranslations[lang],
    ...brainDumpTranslations[lang],
    ...welcomeTranslations[lang],
  };
};

export const translations = {
  en: mergeTranslations('en'),
  ar: mergeTranslations('ar')
};
