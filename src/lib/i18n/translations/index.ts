
import { authTranslations } from './auth';
import { pwaInstallTranslations } from './pwaInstall';
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
import { signInModalTranslations } from './signInModal';
import { notificationsTranslations } from './notifications';
import { completedCommitmentsTranslations } from './completedCommitments';
import { dashboardAuthTranslations } from './dashboardAuth';

// Create English translations by merging all modules
const enTranslations = {
  ...authTranslations.en,
  ...pwaInstallTranslations.en,
  ...faqTranslations.en,
  ...navigationTranslations.en,
  ...homeTranslations.en,
  ...thoughtsTranslations.en,
  ...commitmentsTranslations.en,
  ...subscriptionTranslations.en,
  ...dashboardTranslations.en,
  ...commonTranslations.en,
  ...componentsTranslations.en,
  ...profileTranslations.en,
  ...commitmentFlowTranslations.en,
  ...brainDumpTranslations.en,
  ...welcomeTranslations.en,
  ...signInModalTranslations.en,
  ...notificationsTranslations.en,
  ...completedCommitmentsTranslations.en,
  ...dashboardAuthTranslations.en,
};

// Create Arabic translations by merging all modules
const arTranslations = {
  ...authTranslations.ar,
  ...pwaInstallTranslations.ar,
  ...faqTranslations.ar,
  ...navigationTranslations.ar,
  ...homeTranslations.ar,
  ...thoughtsTranslations.ar,
  ...commitmentsTranslations.ar,
  ...subscriptionTranslations.ar,
  ...dashboardTranslations.ar,
  ...commonTranslations.ar,
  ...componentsTranslations.ar,
  ...profileTranslations.ar,
  ...commitmentFlowTranslations.ar,
  ...brainDumpTranslations.ar,
  ...welcomeTranslations.ar,
  ...signInModalTranslations.ar,
  ...notificationsTranslations.ar,
  ...completedCommitmentsTranslations.ar,
  ...dashboardAuthTranslations.ar,
};

export const translations = {
  en: enTranslations,
  ar: arTranslations
};
