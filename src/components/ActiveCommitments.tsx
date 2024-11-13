import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Check, Clock } from "lucide-react";
import { dbPromise } from '@/lib/db';
import { useToast } from "@/components/ui/use-toast";

interface Commitment {
  id: number;
  outcome: string;
  nextAction: string;
}

const ActiveCommitments = () => {
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const loadCommitments = async () => {
      try {
        const db = await dbPromise;
        const allCommitments = await db.getAll('commitments');
        setCommitments(allCommitments);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load commitments",
          variant: "destructive",
        });
      }
    };

    loadCommitments();
  }, [toast]);

  const handleComplete = async (id: number) => {
    try {
      const db = await dbPromise;
      await db.delete('commitments', id);
      setCommitments(commitments.filter(c => c.id !== id));
      toast({
        title: "Commitment completed",
        description: "Great job! The commitment has been marked as complete.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete commitment",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-semibold mb-4">Active Commitments</h2>
      <div className="grid gap-4">
        {commitments.map((commitment) => (
          <Card key={commitment.id} className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-lg">{commitment.outcome}</h3>
                <div className="flex items-center mt-2 text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  <p>{commitment.nextAction}</p>
                </div>
              </div>
              <button 
                onClick={() => handleComplete(commitment.id)}
                className="p-2 hover:bg-sage-100 rounded-full transition-colors"
              >
                <Check className="h-5 w-5 text-sage-500" />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ActiveCommitments;