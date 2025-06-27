
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Smartphone, 
  Monitor, 
  Chrome, 
  Share, 
  Plus,
  Home,
  MoreVertical,
  Safari,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface PWAActionPlanProps {
  isOpen: boolean;
  onClose: () => void;
}

const PWAActionPlan: React.FC<PWAActionPlanProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const [activeStep, setActiveStep] = useState(0);

  const iOSSteps = [
    {
      icon: Safari,
      title: t('pwa.ios.step1.title') || 'Open in Safari',
      description: t('pwa.ios.step1.desc') || 'Make sure you\'re using Safari browser',
      action: 'Tap the Share button at the bottom'
    },
    {
      icon: Share,
      title: t('pwa.ios.step2.title') || 'Tap Share Button',
      description: t('pwa.ios.step2.desc') || 'Look for the share icon in Safari toolbar',
      action: 'Find "Add to Home Screen" option'
    },
    {
      icon: Plus,
      title: t('pwa.ios.step3.title') || 'Add to Home Screen',
      description: t('pwa.ios.step3.desc') || 'Scroll down and tap "Add to Home Screen"',
      action: 'Confirm by tapping "Add"'
    },
    {
      icon: Home,
      title: t('pwa.ios.step4.title') || 'Find on Home Screen',
      description: t('pwa.ios.step4.desc') || 'The app icon will appear on your home screen',
      action: 'Tap to open like any other app'
    }
  ];

  const androidSteps = [
    {
      icon: Chrome,
      title: t('pwa.android.step1.title') || 'Open in Chrome',
      description: t('pwa.android.step1.desc') || 'Use Chrome or another compatible browser',
      action: 'Look for install banner or menu option'
    },
    {
      icon: MoreVertical,
      title: t('pwa.android.step2.title') || 'Browser Menu',
      description: t('pwa.android.step2.desc') || 'Tap the three dots menu in Chrome',
      action: 'Select "Add to Home Screen" or "Install App"'
    },
    {
      icon: Plus,
      title: t('pwa.android.step3.title') || 'Install App',
      description: t('pwa.android.step3.desc') || 'Confirm installation when prompted',
      action: 'Tap "Install" or "Add"'
    },
    {
      icon: Home,
      title: t('pwa.android.step4.title') || 'Launch App',
      description: t('pwa.android.step4.desc') || 'Find the app in your app drawer or home screen',
      action: 'Open like any native app'
    }
  ];

  const desktopSteps = [
    {
      icon: Chrome,
      title: t('pwa.desktop.step1.title') || 'Compatible Browser',
      description: t('pwa.desktop.step1.desc') || 'Use Chrome, Edge, or another PWA-compatible browser',
      action: 'Look for install icon in address bar'
    },
    {
      icon: Plus,
      title: t('pwa.desktop.step2.title') || 'Install Prompt',
      description: t('pwa.desktop.step2.desc') || 'Click the install icon or use browser menu',
      action: 'Select "Install [App Name]"'
    },
    {
      icon: Monitor,
      title: t('pwa.desktop.step3.title') || 'Desktop App',
      description: t('pwa.desktop.step3.desc') || 'App will open in its own window',
      action: 'Find shortcut in Start Menu/Applications'
    }
  ];

  const benefits = [
    {
      icon: Smartphone,
      title: t('pwa.benefits.native.title') || 'Native Experience',
      description: t('pwa.benefits.native.desc') || 'Works like a native app with app icon and full-screen mode'
    },
    {
      icon: CheckCircle,
      title: t('pwa.benefits.offline.title') || 'Offline Access',
      description: t('pwa.benefits.offline.desc') || 'Continue working even without internet connection'
    },
    {
      icon: ArrowRight,
      title: t('pwa.benefits.fast.title') || 'Faster Loading',
      description: t('pwa.benefits.fast.desc') || 'Instant loading with cached resources'
    }
  ];

  const StepCard = ({ step, index, isActive }: { step: any; index: number; isActive: boolean }) => (
    <Card className={`p-4 cursor-pointer transition-all ${isActive ? 'border-sage-500 bg-sage-50' : 'border-gray-200'}`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${isActive ? 'bg-sage-500' : 'bg-gray-100'}`}>
          <step.icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-600'}`} />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">{step.title}</h4>
          <p className="text-sm text-gray-600 mt-1">{step.description}</p>
          <p className="text-sm text-sage-600 mt-2 font-medium">{step.action}</p>
        </div>
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
          isActive ? 'border-sage-500 bg-sage-500' : 'border-gray-300'
        }`}>
          {isActive && <CheckCircle className="h-4 w-4 text-white" />}
        </div>
      </div>
    </Card>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-sage-700">
            {t('pwa.actionPlan.title') || 'Install App - Action Plan'}
          </DialogTitle>
          <p className="text-center text-gray-600">
            {t('pwa.actionPlan.subtitle') || 'Follow these steps to install the app on your device'}
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Benefits Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {benefits.map((benefit, index) => (
              <Card key={index} className="p-4 text-center bg-gradient-to-b from-sage-50 to-white">
                <div className="bg-sage-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <benefit.icon className="h-6 w-6 text-sage-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-1">{benefit.title}</h4>
                <p className="text-sm text-gray-600">{benefit.description}</p>
              </Card>
            ))}
          </div>

          {/* Installation Steps */}
          <Tabs defaultValue="ios" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="ios" className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                iOS
              </TabsTrigger>
              <TabsTrigger value="android" className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                Android
              </TabsTrigger>
              <TabsTrigger value="desktop" className="flex items-center gap-2">
                <Monitor className="h-4 w-4" />
                Desktop
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ios" className="space-y-4 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t('pwa.ios.title') || 'Install on iPhone/iPad'}
              </h3>
              {iOSSteps.map((step, index) => (
                <StepCard 
                  key={index} 
                  step={step} 
                  index={index} 
                  isActive={activeStep === index}
                />
              ))}
            </TabsContent>

            <TabsContent value="android" className="space-y-4 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t('pwa.android.title') || 'Install on Android'}
              </h3>
              {androidSteps.map((step, index) => (
                <StepCard 
                  key={index} 
                  step={step} 
                  index={index} 
                  isActive={activeStep === index}
                />
              ))}
            </TabsContent>

            <TabsContent value="desktop" className="space-y-4 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t('pwa.desktop.title') || 'Install on Desktop'}
              </h3>
              {desktopSteps.map((step, index) => (
                <StepCard 
                  key={index} 
                  step={step} 
                  index={index} 
                  isActive={activeStep === index}
                />
              ))}
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              {t('pwa.actionPlan.close') || 'Maybe Later'}
            </Button>
            <Button
              onClick={onClose}
              className="flex-1 bg-sage-500 hover:bg-sage-600"
            >
              {t('pwa.actionPlan.gotIt') || 'Got It!'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PWAActionPlan;
