
import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabase';
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useAuth } from '@/contexts/AuthContext';
import { useAnonymousMode } from '@/hooks/useAnonymousMode';
import SignInModal from '@/components/auth/SignInModal';
import { getDeviceId } from '@/utils/deviceId';

const CommitmentClarifier = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, dir } = useLanguage();
  const { user } = useAuth();
  const { isAnonymous } = useAnonymousMode();
  const [outcome, setOutcome] = useState('');
  const [nextAction, setNextAction] = useState('');
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!outcome || !nextAction) {
      toast({
        title: t('commitments.clarifier.errorTitle'),
        description: "Please fill in both fields",
        variant: "destructive",
      });
      return;
    }

    // If user is not authenticated and not in anonymous mode, show sign-in modal
    if (!user && !isAnonymous) {
      setShowSignInModal(true);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      let insertData;
      
      if (user) {
        // Authenticated user
        insertData = {
          outcome,
          nextaction: nextAction,
          completed: false,
          user_id: user.id
        };
      } else if (isAnonymous) {
        // Anonymous user
        const deviceId = getDeviceId();
        insertData = {
          outcome,
          nextaction: nextAction,
          completed: false,
          device_id: deviceId
        };
      }

      const { error } = await supabase
        .from('commitments')
        .insert([insertData]);

      if (error) throw error;

      toast({
        title: t('commitments.clarifier.successTitle'),
        description: t('commitments.clarifier.successDescription'),
      });

      navigate('/');
    } catch (error) {
      console.error('Error saving commitment:', error);
      toast({
        title: t('commitments.clarifier.errorTitle'),
        description: t('commitments.clarifier.errorDescription'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-cream p-6 pb-24 md:pb-6" dir={dir()}>
        <div className="max-w-2xl mx-auto">
          <Button
            variant="ghost"
            className="mb-6 text-base"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className={`h-5 w-5 ${dir() === 'rtl' ? 'ml-3 rotate-180' : 'mr-3'}`} />
            {t('common.back')}
          </Button>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <h1 className="text-3xl font-bold text-sage-600 mb-3">
                {t('commitments.clarifier.title')}
              </h1>
              <p className="text-sage-500 text-lg leading-relaxed">
                {t('commitments.clarifier.description')}
              </p>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-3">
                  <Label htmlFor="outcome" className="text-base font-medium text-gray-700">
                    {t('commitments.clarifier.outcomeLabel')}
                  </Label>
                  <Textarea
                    id="outcome"
                    placeholder={t('commitments.clarifier.outcomePlaceholder')}
                    value={outcome}
                    onChange={(e) => setOutcome(e.target.value)}
                    className="min-h-[120px] text-base leading-relaxed p-4"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="nextAction" className="text-base font-medium text-gray-700">
                    {t('commitments.clarifier.nextActionLabel')}
                  </Label>
                  <Textarea
                    id="nextAction"
                    placeholder={t('commitments.clarifier.nextActionPlaceholder')}
                    value={nextAction}
                    onChange={(e) => setNextAction(e.target.value)}
                    className="min-h-[120px] text-base leading-relaxed p-4"
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-sage-500 hover:bg-sage-600 min-h-[56px] text-lg"
                  disabled={isSubmitting}
                >
                  <Check className={`h-5 w-5 ${dir() === 'rtl' ? 'ml-3' : 'mr-3'}`} />
                  {isSubmitting ? t('common.saving') : t('commitments.clarifier.submitButton')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <SignInModal
        open={showSignInModal}
        onOpenChange={setShowSignInModal}
        title={t('commitments.clarifier.title')}
        description="Sign in to save your commitments securely across all your devices, or continue anonymously to store them locally."
      />
    </>
  );
};

export default CommitmentClarifier;
