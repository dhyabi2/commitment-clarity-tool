
import React from 'react';
import { Button } from "@/components/ui/button";
import { UserX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useAnonymousMode } from '@/hooks/useAnonymousMode';

const AnonymousAccessButton = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { enableAnonymousMode } = useAnonymousMode();

  const handleAnonymousAccess = () => {
    enableAnonymousMode();
    navigate('/thoughts');
  };

  return (
    <Button
      onClick={handleAnonymousAccess}
      variant="outline"
      className="w-full bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 min-h-[48px] text-base font-medium flex items-center justify-center gap-3 transition-all duration-200"
    >
      <UserX className="h-5 w-5" />
      {t('auth.continueAnonymously')}
    </Button>
  );
};

export default AnonymousAccessButton;
