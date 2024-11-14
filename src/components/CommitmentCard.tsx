import React from 'react';
import { Card } from "@/components/ui/card";
import { Check, Clock, X, Pencil, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
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

interface CommitmentCardProps {
  commitment: Commitment;
  editing: EditingState;
  setEditing: (state: EditingState) => void;
  onUpdate: (params: { id: number; field: string; value: string }) => void;
  onComplete: (id: number) => void;
  isUpdating: boolean;
  isCompleting: boolean;
}

export const CommitmentCard = ({
  commitment,
  editing,
  setEditing,
  onUpdate,
  onComplete,
  isUpdating,
  isCompleting
}: CommitmentCardProps) => {
  const handleEdit = (field: 'outcome' | 'nextAction') => {
    setEditing({
      id: commitment.id,
      field,
      value: commitment[field],
    });
  };

  const handleSave = () => {
    if (editing.id && editing.field) {
      onUpdate({
        id: editing.id,
        field: editing.field === 'nextAction' ? 'nextaction' : 'outcome',
        value: editing.value,
      });
    }
  };

  const handleCancel = () => {
    setEditing({ id: null, field: null, value: '' });
  };

  return (
    <Card key={commitment.id} className="commitment-card p-4 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0 overflow-hidden">
          <EditCommitment
            commitment={commitment}
            editing={editing}
            setEditing={setEditing}
            onSave={handleSave}
            onCancel={handleCancel}
            onEdit={handleEdit}
          />
        </div>
        <button 
          className="p-2 hover:bg-sage-100 rounded-full transition-colors flex-shrink-0"
          onClick={() => onComplete(commitment.id)}
          disabled={isCompleting}
        >
          <Check className="h-5 w-5 text-sage-500" />
        </button>
      </div>
    </Card>
  );
};