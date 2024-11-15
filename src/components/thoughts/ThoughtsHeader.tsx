import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface ThoughtsHeaderProps {
  onExport: () => void;
  onImportClick: () => void;
}

export const ThoughtsHeader = ({ onExport, onImportClick }: ThoughtsHeaderProps) => {
  const { t } = useLanguage();

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-sage-600 mb-2">{t('thoughts.title')}</h1>
      <p className="text-sage-500 mb-4">
        {t('thoughts.description')}
      </p>
      <div className="flex gap-2 mt-4">
        <Button
          onClick={onExport}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          title={t('thoughts.export')}
        >
          <Download className="h-4 w-4" />
          {t('thoughts.export')}
        </Button>
        <Button
          onClick={onImportClick}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          title={t('thoughts.import')}
        >
          <Upload className="h-4 w-4" />
          {t('thoughts.import')}
        </Button>
      </div>
    </div>
  );
};