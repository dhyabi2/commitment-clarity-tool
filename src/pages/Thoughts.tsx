import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { ArrowRightCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Thoughts = () => {
  const navigate = useNavigate();
  const { data: thoughts, isLoading } = useQuery({
    queryKey: ['thoughts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('thoughts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream p-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-32 bg-sage-100 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream p-4 pb-20 md:pb-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-sage-600 mb-2">Your Captured Thoughts</h1>
          <p className="text-sage-500">
            Review and clarify your thoughts to turn them into actionable commitments
          </p>
        </div>

        {thoughts && thoughts.length === 0 ? (
          <Card className="p-8 text-center bg-white/50 backdrop-blur-sm">
            <h2 className="text-xl font-semibold text-sage-600 mb-2">No thoughts captured yet</h2>
            <p className="text-sage-500 mb-4">Start by capturing your thoughts in the brain dump area</p>
            <Button 
              onClick={() => navigate('/')} 
              className="bg-sage-500 hover:bg-sage-600"
            >
              Go to Brain Dump
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4">
            {thoughts?.map((thought) => (
              <Card key={thought.id} className="group hover:shadow-md transition-all duration-300 bg-white/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between p-4">
                  <time className="text-sm text-sage-500">
                    {format(new Date(thought.created_at), 'MMM d, yyyy h:mm a')}
                  </time>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    onClick={() => navigate('/commitment-clarifier', { state: { thought: thought.content } })}
                  >
                    Clarify <ArrowRightCircle className="ml-2 h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-gray-800 text-left">{thought.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Thoughts;