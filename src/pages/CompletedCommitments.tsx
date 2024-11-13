import React from 'react';
import { Card } from "@/components/ui/card";
import { Check, Clock } from "lucide-react";
import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

const CompletedCommitments = () => {
  const { data: commitments, isLoading } = useQuery({
    queryKey: ['completed-commitments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('commitments')
        .select('*')
        .eq('completed', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div className="p-4 text-center text-gray-600">Loading completed commitments...</div>;
  }

  return (
    <div className="min-h-screen bg-cream p-4 pb-20 md:pb-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-sage-600 mb-2">Completed Commitments</h1>
          <p className="text-sage-500">Track your accomplished commitments and celebrate your progress</p>
        </div>

        <div className="grid gap-4">
          {commitments?.map((commitment) => (
            <Card key={commitment.id} className="p-4 sm:p-6 bg-white/80 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <div className="bg-sage-100 p-2 rounded-full">
                  <Check className="h-5 w-5 text-sage-600" />
                </div>
                <div className="flex-1 min-w-0 overflow-hidden">
                  <h3 className="font-medium text-base sm:text-lg break-words">{commitment.outcome}</h3>
                  <div className="flex items-start mt-2 text-gray-600">
                    <Clock className="h-4 w-4 mr-2 flex-shrink-0 mt-1" />
                    <p className="text-sm sm:text-base break-words">{commitment.nextAction}</p>
                  </div>
                  <p className="text-sm text-sage-500 mt-2">
                    Completed on {format(new Date(commitment.created_at), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
            </Card>
          ))}

          {commitments?.length === 0 && (
            <div className="text-center p-8 bg-white/50 rounded-lg backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-sage-600 mb-2">No completed commitments yet</h2>
              <p className="text-sage-500">
                As you complete your commitments, they will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompletedCommitments;