import React from 'react';
import { Card } from "@/components/ui/card";
import { Check, Clock, X, Pencil, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
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
  setEditing: (editing: EditingState) => void;
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

  return (
    <Card className="commitment-card p-4 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0 overflow-hidden">
          <div className="flex items-start gap-2">
            {editing.id === commitment.id && editing.field === 'outcome' ? (
              <div className="flex-1">
                <Input
                  value={editing.value}
                  onChange={(e) => setEditing(prev => ({ ...prev, value: e.target.value }))}
                  className="mb-2"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={onSave}
                    className="p-1 hover:bg-sage-100 rounded-full transition-colors"
                    disabled={isPending}
                  >
                    <Save className="h-4 w-4 text-sage-500" />
                  </button>
                  <button
                    onClick={onCancel}
                    className="p-1 hover:bg-red-100 rounded-full transition-colors"
                  >
                    <X className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h3 className="font-medium text-base sm:text-lg break-words flex-1">
                  {commitment.outcome}
                </h3>
                <button
                  onClick={() => onEdit(commitment, 'outcome')}
                  className="p-1 hover:bg-sage-100 rounded-full transition-colors"
                  aria-label={t('commitments.editOutcome')}
                >
                  <Pencil className="h-4 w-4 text-sage-500" />
                </button>
              </>
            )}
          </div>
          <div className="flex items-start mt-2 text-gray-600">
            <Clock className="h-4 w-4 mr-2 flex-shrink-0 mt-1" />
            {editing.id === commitment.id && editing.field === 'nextAction' ? (
              <div className="flex-1">
                <Input
                  value={editing.value}
                  onChange={(e) => setEditing(prev => ({ ...prev, value: e.target.value }))}
                  className="mb-2"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={onSave}
                    className="p-1 hover:bg-sage-100 rounded-full transition-colors"
                    disabled={isPending}
                  >
                    <Save className="h-4 w-4 text-sage-500" />
                  </button>
                  <button
                    onClick={onCancel}
                    className="p-1 hover:bg-red-100 rounded-full transition-colors"
                  >
                    <X className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2 flex-1">
                <p className="text-sm sm:text-base break-words flex-1">{commitment.nextAction}</p>
                <button
                  onClick={() => onEdit(commitment, 'nextAction')}
                  className="p-1 hover:bg-sage-100 rounded-full transition-colors"
                  aria-label={t('commitments.editNextAction')}
                >
                  <Pencil className="h-4 w-4 text-sage-500" />
                </button>
              </div>
            )}
          </div>
        </div>
        <button 
          className="p-2 hover:bg-sage-100 rounded-full transition-colors flex-shrink-0"
          onClick={() => onComplete(commitment.id)}
          disabled={isPending}
          aria-label={t('commitments.complete')}
        >
          <Check className="h-5 w-5 text-sage-500" />
        </button>
      </div>
    </Card>
  );
};

export default CommitmentCard;