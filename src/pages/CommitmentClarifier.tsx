import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabase';
import { useLanguage } from "@/lib/i18n/LanguageContext";

const CommitmentClarifier = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, dir } = useLanguage();
  const [outcome, setOutcome] = useState('');
  const [nextAction, setNextAction] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('commitments')
        .insert([{
          outcome,
          nextaction: nextAction,
          completed: false
        }]);

      if (error) throw error;

      toast({
        title: t('commitments.clarifier.successTitle'),
        description: t('commitments.clarifier.successDescription'),
      });

      navigate('/');
    } catch (error) {
      toast({
        title: t('commitments.clarifier.errorTitle'),
        description: t('commitments.clarifier.errorDescription'),
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
          <ArrowLeft className={`h-4 w-4 ${dir() === 'rtl' ? 'ml-2 rotate-180' : 'mr-2'}`} />
          {t('common.back')}
        </Button>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <h1 className="text-2xl font-bold text-sage-600">
              {t('commitments.clarifier.title')}
            </h1>
            <p className="text-sage-500">
              {t('commitments.clarifier.description')}
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {t('commitments.clarifier.outcomeLabel')}
                </label>
                <Textarea
                  placeholder={t('commitments.clarifier.outcomePlaceholder')}
                  value={outcome}
                  onChange={(e) => setOutcome(e.target.value)}
                  className="min-h-[100px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {t('commitments.clarifier.nextActionLabel')}
                </label>
                <Textarea
                  placeholder={t('commitments.clarifier.nextActionPlaceholder')}
                  value={nextAction}
                  onChange={(e) => setNextAction(e.target.value)}
                  className="min-h-[100px]"
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-sage-500 hover:bg-sage-600">
                <Check className={`h-4 w-4 ${dir() === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                {t('commitments.clarifier.submitButton')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CommitmentClarifier;