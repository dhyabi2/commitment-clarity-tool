import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import ActivityTimeline from "@/components/dashboard/ActivityTimeline";
import CompletionRate from "@/components/dashboard/CompletionRate";
import DailyActivity from "@/components/dashboard/DailyActivity";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const Dashboard = () => {
  const { t, dir } = useLanguage();
  const isRTL = dir() === 'rtl';

  const { data: thoughts, isLoading: thoughtsLoading } = useQuery({
    queryKey: ["thoughts-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("thoughts")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const { data: commitments, isLoading: commitmentsLoading } = useQuery({
    queryKey: ["commitments-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("commitments")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
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
      ...thoughts?.map((t) => new Date(t.created_at).toLocaleDateString()) || [],
      ...commitments?.map((c) => new Date(c.created_at).toLocaleDateString()) || [],
    ]);

    Array.from(dates)
      .sort()
      .forEach((date) => {
        const activeThoughts =
          thoughts?.filter(
            (t) => new Date(t.created_at).toLocaleDateString() === date && !t.completed
          ).length || 0;

        const completedThoughts =
          thoughts?.filter(
            (t) => new Date(t.created_at).toLocaleDateString() === date && t.completed
          ).length || 0;

        const commitmentCount =
          commitments?.filter(
            (c) => new Date(c.created_at).toLocaleDateString() === date
          ).length || 0;

        timelineData.push({
          date,
          thoughts: activeThoughts,
          completedThoughts: completedThoughts,
          commitments: commitmentCount,
        });
      });

    return timelineData;
  };

  const calculateCompletionRate = () => {
    if (!commitments?.length) return 0;
    const completed = commitments.filter((c) => c.completed).length;
    return (completed / commitments.length) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-sage-50 p-2 md:p-4 pb-20 md:pb-4" dir={dir()}>
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold text-sage-700 mb-4 md:mb-8 animate-fade-in px-2">
          {t('dashboard.title')}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <Card className="col-span-1 md:col-span-2 hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="p-4">
              <CardTitle className="text-lg md:text-xl">{t('dashboard.timeline')}</CardTitle>
              <CardDescription>{t('dashboard.timelineDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="p-2 md:p-4">
              <ActivityTimeline data={processDataForTimeline()} />
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300 h-[400px]">
            <CardHeader className="p-4">
              <CardTitle className="text-lg md:text-xl">{t('dashboard.completion')}</CardTitle>
              <CardDescription>{t('dashboard.completionDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="p-2 md:p-4">
              <CompletionRate completionRate={calculateCompletionRate()} />
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300 h-[400px]">
            <CardHeader className="p-4">
              <CardTitle className="text-lg md:text-xl">{t('dashboard.daily')}</CardTitle>
              <CardDescription>{t('dashboard.dailyDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="p-2 md:p-4">
              <DailyActivity data={processDataForTimeline()} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;