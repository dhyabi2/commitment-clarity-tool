import React from 'react';
import { CommitmentCard } from './CommitmentCard';
import { EditCommitment } from './EditCommitment';

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

interface CommitmentListProps {
  commitments: Commitment[];
  editing: EditingState;
  setEditing: (state: EditingState) => void;
  onUpdate: (params: { id: number; field: string; value: string }) => void;
  onComplete: (id: number) => void;
  isUpdating: boolean;
  isCompleting: boolean;
}

export const CommitmentList = ({
  commitments,
  editing,
  setEditing,
  onUpdate,
  onComplete,
  isUpdating,
  isCompleting
}: CommitmentListProps) => {
  return (
    <div className="animate-fade-in p-4 sm:p-0">
      <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Active Commitments</h2>
      <div className="grid gap-3 sm:gap-4">
        {commitments.map((commitment) => (
          <CommitmentCard
            key={commitment.id}
            commitment={commitment}
            editing={editing}
            setEditing={setEditing}
            onUpdate={onUpdate}
            onComplete={onComplete}
            isUpdating={isUpdating}
            isCompleting={isCompleting}
          />
        ))}
      </div>
    </div>
  );
};