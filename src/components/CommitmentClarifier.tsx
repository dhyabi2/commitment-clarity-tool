import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { dbPromise } from '@/lib/db';

const CommitmentClarifier = () => {
  const [step, setStep] = useState(1);
  const [outcome, setOutcome] = useState("");
  const [nextAction, setNextAction] = useState("");
  const { toast } = useToast();

  const handleNext = () => {
    if (step === 1 && outcome) {
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (outcome && nextAction) {
      try {
        const db = await dbPromise;
        const id = Date.now(); // Generate a unique ID
        await db.add('commitments', {
          id,
          outcome,
          nextAction,
          timestamp: Date.now(),
        });

        toast({
          title: "Commitment saved",
          description: "Your commitment has been stored successfully.",
        });
        
        setOutcome("");
        setNextAction("");
        setStep(1);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to save commitment. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Card className="p-6 animate-fade-in">
      <h2 className="text-2xl font-semibold mb-4">Clarify Your Commitment</h2>
      <div className="space-y-6">
        {step === 1 ? (
          <div className="space-y-4">
            <p className="text-gray-600">
              What would need to happen for this to be complete?
            </p>
            <Input
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
              placeholder="Describe the successful outcome..."
              className="input-field"
            />
            <Button onClick={handleNext} className="btn-primary">
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-gray-600">
              What's the very next physical action required?
            </p>
            <Input
              value={nextAction}
              onChange={(e) => setNextAction(e.target.value)}
              placeholder="What's the next action?"
              className="input-field"
            />
            <Button type="submit" className="btn-primary">
              Save Commitment
            </Button>
          </form>
        )}
      </div>
    </Card>
  );
};

export default CommitmentClarifier;