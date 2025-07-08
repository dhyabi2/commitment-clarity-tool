
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./lib/i18n/LanguageContext";
import { AuthErrorBoundary } from "./components/auth/AuthErrorBoundary";
import Navigation from "./components/Navigation";
import Routes from "./Routes";
import { useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Enhanced PWA detection and logging for production
    const logPWAState = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isIOSStandalone = window.navigator.standalone;
      
      console.log('PWA State on App Load:', {
        isStandalone,
        isIOS,
        isIOSStandalone,
        displayMode: window.matchMedia('(display-mode: standalone)').matches ? 'standalone' : 'browser',
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        cookies: document.cookie,
        timestamp: new Date().toISOString()
      });

      // Set PWA detection flags for global access
      (window as any).__PWA_STATE__ = {
        isStandalone,
        isIOS,
        isIOSStandalone,
        detectedAt: new Date().toISOString()
      };
    };

    logPWAState();

    // Listen for display mode changes
    const standaloneQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayChange = () => {
      console.log('Display mode changed:', standaloneQuery.matches ? 'standalone' : 'browser');
      logPWAState();
    };

    if (standaloneQuery.addEventListener) {
      standaloneQuery.addEventListener('change', handleDisplayChange);
    } else {
      standaloneQuery.addListener(handleDisplayChange);
    }

    return () => {
      if (standaloneQuery.removeEventListener) {
        standaloneQuery.removeEventListener('change', handleDisplayChange);
      } else {
        standaloneQuery.removeListener(handleDisplayChange);
      }
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthErrorBoundary>
        <AuthProvider>
          <LanguageProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <div className="min-h-screen bg-cream w-full">
                  <Navigation />
                  <main className="container mx-auto px-4 py-6 pb-24 md:pb-6">
                    <Routes />
                  </main>
                </div>
              </BrowserRouter>
            </TooltipProvider>
          </LanguageProvider>
        </AuthProvider>
      </AuthErrorBoundary>
    </QueryClientProvider>
  );
};

export default App;
