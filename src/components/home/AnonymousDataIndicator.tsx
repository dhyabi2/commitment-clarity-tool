
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Database, Info } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

const AnonymousDataIndicator = () => {
  const { t } = useLanguage();

  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardContent className="flex items-start space-x-3 p-4">
        <Database className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h4 className="text-sm font-medium text-blue-800">
              {t('auth.anonymousMode')}
            </h4>
            <Info className="h-4 w-4 text-blue-600" />
          </div>
          <p className="text-xs text-blue-700 mt-1">
            {t('auth.anonymousNote')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnonymousDataIndicator;
