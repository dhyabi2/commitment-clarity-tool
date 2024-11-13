import React from 'react';
import { Card } from "@/components/ui/card";
import { Check, Clock } from "lucide-react";

// In a real app, this would come from your backend
const mockCommitments = [
  {
    id: 1,
    outcome: "Complete the Hawaii vacation planning",
    nextAction: "Research and book flights",
  },
  {
    id: 2,
    outcome: "Resolve client project deadline",
    nextAction: "Schedule meeting with team",
  },
];

const ActiveCommitments = () => {
  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-semibold mb-4">Active Commitments</h2>
      <div className="grid gap-4">
        {mockCommitments.map((commitment) => (
          <Card key={commitment.id} className="commitment-card">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-lg">{commitment.outcome}</h3>
                <div className="flex items-center mt-2 text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  <p>{commitment.nextAction}</p>
                </div>
              </div>
              <button className="p-2 hover:bg-sage-100 rounded-full transition-colors">
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