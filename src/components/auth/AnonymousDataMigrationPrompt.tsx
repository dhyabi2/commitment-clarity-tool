
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, UserPlus } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useDeviceDataMigration } from '@/hooks/useDeviceDataMigration';
import { useAuth } from '@/contexts/AuthContext';

interface AnonymousDataMigrationPromptProps {
  onSkip?: () => void;
}

const AnonymousDataMigrationPrompt: React.FC<AnonymousDataMigrationPromptProps> = ({ onSkip }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { migrateDeviceData, isMigrating } = useDeviceDataMigration();

  const handleMigrate = () => {
    if (user) {
      migrateDeviceData(user.id);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center">
          <Database className="h-6 w-6 text-sage-600" />
        </div>
        <CardTitle className="text-lg">
          {t('auth.migrateData.title')}
        </CardTitle>
        <CardDescription>
          {t('auth.migrateData.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={handleMigrate}
          disabled={isMigrating}
          className="w-full bg-sage-500 hover:bg-sage-600"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          {isMigrating ? t('auth.migrateData.migrating') : t('auth.migrateData.migrate')}
        </Button>
        
        {onSkip && (
          <Button 
            onClick={onSkip}
            variant="outline"
            className="w-full"
            disabled={isMigrating}
          >
            {t('auth.migrateData.skip')}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default AnonymousDataMigrationPrompt;
