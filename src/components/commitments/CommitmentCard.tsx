import React from 'react';
import { Card } from "@/components/ui/card";
import { Check, Clock, X, Pencil, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from "@/components/ui/use-toast";

interface CommitmentCardProps {
  commitment: {
    id: number;
    outcome: string;
    nextAction: string;
  };
  onEdit: (id: number, field: 'outcome' | 'nextAction', value: string) => void;
  onComplete: (id: number) => void;
  editing: {
    id: number | null;
    field: 'outcome' | 'nextAction' | null;
    value: string;
  };
  setEditing: React.Dispatch<React.SetStateAction<{
    id: number | null;
    field: 'outcome' | 'nextAction' | null;
    value: string;
  }>>;
}

const CommitmentCard = ({ 
  commitment, 
  onEdit, 
  onComplete, 
  editing, 
  setEditing 
}: CommitmentCardProps) => {
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'completed'>('pending');
  const { toast } = useToast();

  const handleComplete = async () => {
    try {
      const { data: paymentData, error: paymentError } = await supabase.functions.invoke('nano-payment', {
        body: { commitment_id: commitment.id }
      });

      if (paymentError) throw paymentError;

      setShowPaymentDialog(true);
      // Here you would integrate with a Nano wallet to complete the payment
      // For now, we'll simulate the payment process
      
      toast({
        title: "Payment Required",
        description: `Please send ${paymentData.amount} XNO to complete this commitment`,
      });
    } catch (error) {
      console.error('Error initiating payment:', error);
      toast({
        title: "Error",
        description: "Failed to initiate payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSave = () => {
    if (editing.id && editing.field) {
      onEdit(editing.id, editing.field, editing.value);
    }
  };

  const handleCancel = () => {
    setEditing({ id: null, field: null, value: '' });
  };

  return (
    <Card className="commitment-card p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
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
                    onClick={handleSave}
                    className="p-1 hover:bg-sage-100 rounded-full transition-colors"
                  >
                    <Save className="h-4 w-4 text-sage-500" />
                  </button>
                  <button
                    onClick={handleCancel}
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
                  onClick={() => setEditing({ id: commitment.id, field: 'outcome', value: commitment.outcome })}
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
                    onClick={handleSave}
                    className="p-1 hover:bg-sage-100 rounded-full transition-colors"
                  >
                    <Save className="h-4 w-4 text-sage-500" />
                  </button>
                  <button
                    onClick={handleCancel}
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
                  onClick={() => setEditing({ id: commitment.id, field: 'nextAction', value: commitment.nextAction })}
                  className="p-1 hover:bg-sage-100 rounded-full transition-colors"
                >
                  <Pencil className="h-4 w-4 text-sage-500" />
                </button>
              </div>
            )}
          </div>
        </div>
        <Button
          variant="outline"
          className="p-2 hover:bg-sage-100 rounded-full transition-colors flex-shrink-0"
          onClick={handleComplete}
        >
          <Check className="h-5 w-5 text-sage-500" />
        </Button>
      </div>

      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Commitment with Nano Payment</DialogTitle>
            <DialogDescription>
              Send 0.01 XNO to complete this commitment.
              <div className="mt-4">
                <p className="text-sm text-gray-500">Wallet Address:</p>
                <code className="block p-2 bg-gray-100 rounded mt-1 text-sm break-all">
                  {/* Replace with actual wallet address from edge function */}
                  nano_1234567890
                </code>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => onComplete(commitment.id)}>
              Confirm Payment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default CommitmentCard;