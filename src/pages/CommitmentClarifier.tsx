import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Check } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabase';

const CommitmentClarifier = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const initialThought = location.state?.thought || '';
  
  const [outcome, setOutcome] = useState('');
  const [nextAction, setNextAction] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('commitments')
        .insert([
          {
            outcome,
            nextaction: nextAction,
            completed: false
          }
        ]);

      if (error) throw error;

      toast({
        title: "Commitment created",
        description: "Your thought has been clarified into a commitment.",
      });

      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create commitment. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-cream p-4 pb-20 md:pb-4">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <h1 className="text-2xl font-bold text-sage-600">Clarify Your Thought</h1>
            <p className="text-sage-500">Transform your thought into a clear commitment</p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Original Thought</label>
                <div className="p-4 bg-gray-50 rounded-md">
                  <p className="text-gray-600">{initialThought}</p>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="outcome" className="text-sm font-medium text-gray-700">
                  Desired Outcome
                </label>
                <Textarea
                  id="outcome"
                  placeholder="What's the specific outcome you want to achieve?"
                  value={outcome}
                  onChange={(e) => setOutcome(e.target.value)}
                  className="min-h-[100px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="nextAction" className="text-sm font-medium text-gray-700">
                  Next Action
                </label>
                <Textarea
                  id="nextAction"
                  placeholder="What's the very next physical action you need to take?"
                  value={nextAction}
                  onChange={(e) => setNextAction(e.target.value)}
                  className="min-h-[100px]"
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-sage-500 hover:bg-sage-600">
                <Check className="h-4 w-4 mr-2" />
                Create Commitment
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CommitmentClarifier;