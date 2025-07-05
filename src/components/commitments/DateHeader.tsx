
import React from 'react';
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface DateHeaderProps {
  createdAt: string;
  onComplete: () => void;
  isPending: boolean;
}

const DateHeader = ({ createdAt, onComplete, isPending }: DateHeaderProps) => {
  const { t } = useLanguage();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return t('common.today');
    if (diffDays === 1) return t('common.yesterday');  
    if (diffDays < 7) return t('common.daysAgo').replace('{days}', diffDays.toString());
    return date.toLocaleDateString();
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
        <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
        <span>{t('common.created')} {formatDate(createdAt)}</span>
      </div>
      <div className="flex items-center justify-end">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:border-green-300 min-h-[44px] px-4 text-sm sm:text-base w-full sm:w-auto"
              disabled={isPending}
            >
              {t('commitments.markComplete')}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="mx-4 rounded-lg">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-lg">{t('commitments.confirmCompletion')}</AlertDialogTitle>
              <AlertDialogDescription className="text-base leading-relaxed">
                {t('commitments.confirmCompletionDescription')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col sm:flex-row gap-2">
              <AlertDialogCancel className="min-h-[48px] w-full sm:w-auto">{t('commitments.cancel')}</AlertDialogCancel>
              <AlertDialogAction
                onClick={onComplete}
                className="bg-green-600 hover:bg-green-700 min-h-[48px] w-full sm:w-auto"
              >
                {t('commitments.yesComplete')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>  
        </AlertDialog>
      </div>
    </div>
  );
};

export default DateHeader;
