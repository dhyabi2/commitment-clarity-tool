
import React from 'react';
import { Button } from "@/components/ui/button";
import { UserX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n/LanguageContext';

const AnonymousAccessButton = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleAnonymousAccess = () => {
    // Set a flag in localStorage to indicate anonymous mode
    localStorage.setItem('anonymousMode', 'true');
    navigate('/thoughts');
  };

  return (
    <Button
      onClick={handleAnonymousAccess}
      variant="outline"
      className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm min-h-[56px] text-lg font-medium flex items-center justify-center gap-3"
    >
      <UserX className="h-5 w-5" />
      {t('auth.continueAnonymously')}
    </Button>
  );
};

export default AnonymousAccessButton;
