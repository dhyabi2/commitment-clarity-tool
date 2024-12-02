import { BrowserRouter } from "react-router-dom";
import Routes from "./Routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import Navigation from "./components/Navigation";
import LanguageSwitcher from "./components/LanguageSwitcher";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Auth from "@/components/Auth";

const queryClient = new QueryClient();

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <BrowserRouter>
            {!session ? (
              <Auth />
            ) : (
              <div className="md:pt-16">
                <LanguageSwitcher />
                <Routes />
                <Navigation />
                <Toaster />
              </div>
            )}
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;