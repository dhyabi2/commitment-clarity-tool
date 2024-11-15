import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { createClient } from '@supabase/supabase-js';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from "@/integrations/supabase/client";
import Navigation from "./components/Navigation";
import LanguageSwitcher from "./components/LanguageSwitcher";
import Routes from "./Routes";
import Auth from "./components/Auth";

const AppContent = () => {
  const { session } = useSession();

  if (!session) {
    return <Auth />;
  }

  return (
    <div className="md:pt-16">
      <LanguageSwitcher />
      <Routes />
      <Navigation />
    </div>
  );
};

const AppWrapper = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabase}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </SessionContextProvider>
    </QueryClientProvider>
  );
};

export default AppWrapper;