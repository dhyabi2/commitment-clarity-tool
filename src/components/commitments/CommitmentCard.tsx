
import React from 'react';
import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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

interface Commitment {
  id: number;
  outcome: string;
  nextAction: string;
  completed: boolean;
  created_at: string;
}

interface EditingState {
  id: number | null;
  field: 'outcome' | 'nextAction' | null;
  value: string;
}

interface CommitmentCardProps {
  commitment: Commitment;
  editing: EditingState;
  onEdit: (commitment: Commitment, field: 'outcome' | 'nextAction') => void;
  onSave: () => void;
  onCancel: () => void;
  onComplete: (id: number) => void;
  setEditing: React.Dispatch<React.SetStateAction<EditingState>>;
  isPending: boolean;
}

const CommitmentCard = ({
  commitment,
  editing,
  onEdit,
  onSave,
  onCancel,
  onComplete,
  setEditing,
  isPending,
}: CommitmentCardProps) => {
  const { t } = useLanguage();

  const handleInputChange = (value: string) => {
    setEditing(prev => ({
      ...prev,
      value
    }));
  };

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
    <Card className="commitment-card p-3 sm:p-6 border-l-4 border-l-sage-400 hover:shadow-md transition-all duration-200">
      <div className="space-y-3 sm:space-y-4">
        {/* Header with date and actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>{t('common.created')} {formatDate(commitment.created_at)}</span>
          </div>
          <div className="flex items-center justify-end">
            {/* Complete Button with Confirmation */}
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
                    onClick={() => onComplete(commitment.id)}
                    className="bg-green-600 hover:bg-green-700 min-h-[48px] w-full sm:w-auto"
                  >
                    {t('commitments.yesComplete')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>  
            </AlertDialog>
          </div>
        </div>

        {/* Outcome Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide">{t('commitments.outcome')}</h4>
            {editing.id !== commitment.id || editing.field !== 'outcome' ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(commitment, 'outcome')}
                className="text-blue-600 border-blue-200 hover:bg-blue-50 min-h-[40px] px-3"
              >
                {t('commitments.editOutcome')}
              </Button>
            ) : null}
          </div>
          
          {editing.id === commitment.id && editing.field === 'outcome' ? (
            <div className="space-y-3">
              <Textarea
                value={editing.value}
                onChange={(e) => handleInputChange(e.target.value)}
                className="min-h-[100px] text-base leading-relaxed resize-none"
                autoFocus
              />
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  size="sm"
                  onClick={onSave}
                  disabled={isPending}
                  className="bg-sage-500 hover:bg-sage-600 min-h-[48px] flex-1 sm:flex-none"
                >
                  {t('commitments.save')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onCancel}
                  className="min-h-[48px] flex-1 sm:flex-none"
                >
                  {t('commitments.cancel')}
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-base leading-relaxed text-gray-800 bg-gray-50 p-3 rounded-lg">
              {commitment.outcome}
            </p>
          )}
        </div>

        {/* Next Action Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide">{t('commitments.nextAction')}</h4>
            {editing.id !== commitment.id || editing.field !== 'nextAction' ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(commitment, 'nextAction')}
                className="text-blue-600 border-blue-200 hover:bg-blue-50 min-h-[40px] px-3"
              >
                {t('commitments.editNextAction')}
              </Button>
            ) : null}
          </div>
          
          {editing.id === commitment.id && editing.field === 'nextAction' ? (
            <div className="space-y-3">
              <Textarea
                value={editing.value}
                onChange={(e) => handleInputChange(e.target.value)}
                className="min-h-[100px] text-base leading-relaxed resize-none"
                autoFocus
              />
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  size="sm"
                  onClick={onSave}
                  disabled={isPending}
                  className="bg-sage-500 hover:bg-sage-600 min-h-[48px] flex-1 sm:flex-none"
                >
                  {t('commitments.save')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onCancel}
                  className="min-h-[48px] flex-1 sm:flex-none"
                >
                  {t('commitments.cancel')}
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-l-blue-400">
              <p className="text-base leading-relaxed text-gray-800">
                {commitment.nextAction}
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default CommitmentCard;
