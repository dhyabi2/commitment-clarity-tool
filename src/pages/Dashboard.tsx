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
import { Button } from "@/components/ui/button";
import { Loader2, Chrome, UserX } from "lucide-react";
import ActivityTimeline from "@/components/dashboard/ActivityTimeline";
import CompletionRate from "@/components/dashboard/CompletionRate";
import DailyActivity from "@/components/dashboard/DailyActivity";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useAnonymousMode } from "@/hooks/useAnonymousMode";

const Dashboard = () => {
  const { t, dir } = useLanguage();
  const { user, signInWithGoogle } = useAuth();
  const { enableAnonymousMode } = useAnonymousMode();
  const isRTL = dir() === 'rtl';

  const { data: thoughts, isLoading: thoughtsLoading } = useQuery({
    queryKey: ["thoughts-stats", user?.id],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from("thoughts")
        .select("*")
        .eq('user_id', user.id)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  const { data: commitments, isLoading: commitmentsLoading } = useQuery({
    queryKey: ["commitments-stats", user?.id],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from("commitments")
        .select("*")
        .eq('user_id', user.id)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  const handleAnonymousAccess = () => {
    enableAnonymousMode();
    // Redirect to thoughts page or reload
    window.location.href = '/thoughts';
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cream to-sage-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-xl font-semibold text-sage-600 mb-2">
              {t('dashboard.signInRequired')}
            </CardTitle>
            <CardDescription className="text-sage-500">
              {t('dashboard.signInDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={signInWithGoogle}
              className="w-full bg-sage-600 hover:bg-sage-700 text-white min-h-[48px] flex items-center justify-center gap-3"
            >
              <Chrome className="h-5 w-5" />
              {t('dashboard.continueWithGoogle')}
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">{t('auth.or')}</span>
              </div>
            </div>

            <Button
              onClick={handleAnonymousAccess}
              variant="outline"
              className="w-full"
            >
              <UserX className="h-5 w-5 mr-2" />
              {t('auth.continueAnonymously')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
