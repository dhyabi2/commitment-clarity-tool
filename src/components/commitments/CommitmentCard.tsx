
import React from 'react';
import { Card } from "@/components/ui/card";
import { Check, Clock, X, Pencil, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card className="commitment-card p-4 sm:p-6 border-l-4 border-l-sage-400 hover:shadow-md transition-all duration-200">
      <div className="space-y-4">
        {/* Header with date and actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>Created {formatDate(commitment.created_at)}</span>
          </div>
          <div className="flex items-center gap-2">
            {/* Complete Button with Confirmation */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:border-green-300"
                  disabled={isPending}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Mark Complete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Complete this commitment?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to mark this commitment as complete? This action will move it to your completed commitments list.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onComplete(commitment.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Yes, Complete It
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Outcome Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Desired Outcome</h4>
            {editing.id !== commitment.id || editing.field !== 'outcome' ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(commitment, 'outcome')}
                className="text-gray-400 hover:text-sage-600"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            ) : null}
          </div>
          
          {editing.id === commitment.id && editing.field === 'outcome' ? (
            <div className="space-y-2">
              <Textarea
                value={editing.value}
                onChange={(e) => handleInputChange(e.target.value)}
                className="min-h-[80px] text-base leading-relaxed"
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={onSave}
                  disabled={isPending}
                  className="bg-sage-500 hover:bg-sage-600"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onCancel}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
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
            <h4 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Next Action</h4>
            {editing.id !== commitment.id || editing.field !== 'nextAction' ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(commitment, 'nextAction')}
                className="text-gray-400 hover:text-sage-600"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            ) : null}
          </div>
          
          {editing.id === commitment.id && editing.field === 'nextAction' ? (
            <div className="space-y-2">
              <Textarea
                value={editing.value}
                onChange={(e) => handleInputChange(e.target.value)}
                className="min-h-[80px] text-base leading-relaxed"
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={onSave}
                  disabled={isPending}
                  className="bg-sage-500 hover:bg-sage-600"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onCancel}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
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
