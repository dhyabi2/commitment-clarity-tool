import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Card } from "@/components/ui/card";
import { format } from 'date-fns';

const Thoughts = () => {
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
    return <div className="p-4 text-center text-gray-600">Loading thoughts...</div>;
  }

  return (
    <div className="min-h-screen bg-cream p-4 pb-20 md:pb-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-sage-600 mb-6">Your Thoughts</h1>
        <div className="grid gap-4">
          {thoughts?.map((thought) => (
            <Card key={thought.id} className="p-4">
              <p className="text-gray-800 mb-2">{thought.content}</p>
              <time className="text-sm text-gray-500">
                {format(new Date(thought.created_at), 'MMM d, yyyy h:mm a')}
              </time>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Thoughts;