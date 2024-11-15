import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Check } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/lib/i18n/LanguageContext';

const CommitmentClarifier = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, dir } = useLanguage();
  const initialThought = location.state?.thought || '';
  
  const [outcome, setOutcome] = useState('');
  const [nextAction, setNextAction] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('commitments')
        .insert([
          {
            outcome,
            nextaction: nextAction,
            completed: false
          }
        ]);

      if (error) throw error;

      toast({
        title: t('common.success'),
        description: t('thoughts.thoughtCaptured'),
      });

      navigate('/');
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('thoughts.errorCapturing'),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-cream p-4 pb-20 md:pb-4" dir={dir()}>
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
          {t('clarifier.back')}
        </Button>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <h1 className="text-2xl font-bold text-sage-600">{t('clarifier.title')}</h1>
            <p className="text-sage-500">{t('clarifier.subtitle')}</p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {t('clarifier.originalThought')}
                </label>
                <div className="p-4 bg-gray-50 rounded-md">
                  <p className="text-gray-600">{initialThought}</p>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="outcome" className="text-sm font-medium text-gray-700">
                  {t('clarifier.outcome.label')}
                </label>
                <Textarea
                  id="outcome"
                  placeholder={t('clarifier.outcome.placeholder')}
                  value={outcome}
                  onChange={(e) => setOutcome(e.target.value)}
                  className="min-h-[100px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="nextAction" className="text-sm font-medium text-gray-700">
                  {t('clarifier.nextAction.label')}
                </label>
                <Textarea
                  id="nextAction"
                  placeholder={t('clarifier.nextAction.placeholder')}
                  value={nextAction}
                  onChange={(e) => setNextAction(e.target.value)}
                  className="min-h-[100px]"
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-sage-500 hover:bg-sage-600">
                <Check className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                {t('clarifier.create')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CommitmentClarifier;