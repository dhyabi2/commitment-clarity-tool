import React from 'react';
import { Input } from "@/components/ui/input";
import { Pencil, Save, X, Clock } from "lucide-react";

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

interface EditCommitmentProps {
  commitment: Commitment;
  editing: EditingState;
  setEditing: (state: EditingState) => void;
  onSave: () => void;
  onCancel: () => void;
  onEdit: (field: 'outcome' | 'nextAction') => void;
}

export const EditCommitment = ({
  commitment,
  editing,
  setEditing,
  onSave,
  onCancel,
  onEdit,
}: EditCommitmentProps) => {
  return (
    <>
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
              onClick={() => onEdit('outcome')}
              className="p-1 hover:bg-sage-100 rounded-full transition-colors"
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
              onClick={() => onEdit('nextAction')}
              className="p-1 hover:bg-sage-100 rounded-full transition-colors"
            >
              <Pencil className="h-4 w-4 text-sage-500" />
            </button>
          </div>
        )}
      </div>
    </>
  );
};