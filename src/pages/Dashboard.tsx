import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Loader2 } from 'lucide-react';

const Dashboard = () => {
  const { data: thoughts, isLoading: thoughtsLoading } = useQuery({
    queryKey: ['thoughts-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('thoughts')
        .select('*')
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data;
    }
  });

  const { data: commitments, isLoading: commitmentsLoading } = useQuery({
    queryKey: ['commitments-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('commitments')
        .select('*')
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data;
    }
  });

  if (thoughtsLoading || commitmentsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-sage-500" />
      </div>
    );
  }

  const processDataForTimeline = () => {
    const timelineData = [];
    const dates = new Set([
      ...thoughts?.map(t => new Date(t.created_at).toLocaleDateString()) || [],
      ...commitments?.map(c => new Date(c.created_at).toLocaleDateString()) || []
    ]);

    Array.from(dates).sort().forEach(date => {
      const thoughtCount = thoughts?.filter(t => 
        new Date(t.created_at).toLocaleDateString() === date
      ).length || 0;
      
      const commitmentCount = commitments?.filter(c => 
        new Date(c.created_at).toLocaleDateString() === date
      ).length || 0;

      timelineData.push({
        date,
        thoughts: thoughtCount,
        commitments: commitmentCount
      });
    });

    return timelineData;
  };

  const calculateCompletionRate = () => {
    if (!commitments?.length) return 0;
    const completed = commitments.filter(c => c.completed).length;
    return (completed / commitments.length) * 100;
  };

  const COLORS = ['#84a98c', '#e6ebe7'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-sage-50 p-4 pb-20 md:pb-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-sage-700 mb-8">Performance Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Activity Timeline */}
          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
              <CardDescription>Thoughts vs Commitments over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ChartContainer>
                <LineChart data={processDataForTimeline()}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="thoughts" stroke="#84a98c" name="Thoughts" />
                  <Line type="monotone" dataKey="commitments" stroke="#5b8363" name="Commitments" />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Completion Rate */}
          <Card>
            <CardHeader>
              <CardTitle>Completion Rate</CardTitle>
              <CardDescription>Percentage of completed commitments</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ChartContainer>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Completed', value: calculateCompletionRate() },
                      { name: 'Pending', value: 100 - calculateCompletionRate() }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#84a98c"
                    dataKey="value"
                  >
                    {[0, 1].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Daily Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Activity</CardTitle>
              <CardDescription>Number of items created per day</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ChartContainer>
                <BarChart data={processDataForTimeline().slice(-7)}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="thoughts" fill="#84a98c" name="Thoughts" />
                  <Bar dataKey="commitments" fill="#5b8363" name="Commitments" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;