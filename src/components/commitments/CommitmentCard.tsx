
import React from 'react';
import { Card } from "@/components/ui/card";
import { useLanguage } from '@/lib/i18n/LanguageContext';
import DateHeader from './DateHeader';
import CommitmentSection from './CommitmentSection';

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

  const handleEditValueChange = (value: string) => {
    setEditing(prev => ({
      ...prev,
      value
    }));
  };

  return (
    <Card className="commitment-card p-3 sm:p-6 border-l-4 border-l-sage-400 hover:shadow-md transition-all duration-200">
      <div className="space-y-3 sm:space-y-4">
        <DateHeader
          createdAt={commitment.created_at}
          onComplete={() => onComplete(commitment.id)}
          isPending={isPending}
        />

        <CommitmentSection
          title={t('commitments.outcome')}
          content={commitment.outcome}
          field="outcome"
          isEditing={editing.id === commitment.id && editing.field === 'outcome'}
          editValue={editing.value}
          onEdit={() => onEdit(commitment, 'outcome')}
          onSave={onSave}
          onCancel={onCancel}
          onEditValueChange={handleEditValueChange}
          isPending={isPending}
        />

        <CommitmentSection
          title={t('commitments.nextAction')}
          content={commitment.nextAction}
          field="nextAction"
          isEditing={editing.id === commitment.id && editing.field === 'nextAction'}
          editValue={editing.value}
          onEdit={() => onEdit(commitment, 'nextAction')}
          onSave={onSave}
          onCancel={onCancel}
          onEditValueChange={handleEditValueChange}
          isPending={isPending}
        />
      </div>
    </Card>
  );
};

export default CommitmentCard;
