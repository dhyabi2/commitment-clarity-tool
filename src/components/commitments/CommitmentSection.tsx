
import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface CommitmentSectionProps {
  title: string;
  content: string;
  field: 'outcome' | 'nextAction';
  isEditing: boolean;
  editValue: string;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onEditValueChange: (value: string) => void;
  isPending: boolean;
}

const CommitmentSection = ({
  title,
  content,
  field,
  isEditing,
  editValue,
  onEdit,
  onSave,
  onCancel,
  onEditValueChange,
  isPending,
}: CommitmentSectionProps) => {
  const { t } = useLanguage();

  const editButtonText = field === 'outcome' ? 'commitments.editOutcome' : 'commitments.editNextAction';

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide">{title}</h4>
        {!isEditing && (
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="text-blue-600 border-blue-200 hover:bg-blue-50 min-h-[40px] px-3"
          >
            {t(editButtonText)}
          </Button>
        )}
      </div>
      
      {isEditing ? (
        <div className="space-y-3">
          <Textarea
            value={editValue}
            onChange={(e) => onEditValueChange(e.target.value)}
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
        <div className={field === 'nextAction' ? 
          "bg-blue-50 p-3 rounded-lg border-l-4 border-l-blue-400" : 
          "text-base leading-relaxed text-gray-800 bg-gray-50 p-3 rounded-lg"
        }>
          <p className="text-base leading-relaxed text-gray-800">
            {content}
          </p>
        </div>
      )}
    </div>
  );
};

export default CommitmentSection;
