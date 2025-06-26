
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./lib/i18n/LanguageContext";
import { PWAProvider } from "./contexts/PWAContext";
import { AuthErrorBoundary } from "./components/auth/AuthErrorBoundary";
import Navigation from "./components/Navigation";
import Routes from "./Routes";
import InstallPrompt from "./components/pwa/InstallPrompt";
import InstallBanner from "./components/pwa/InstallBanner";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthErrorBoundary>
      <AuthProvider>
        <LanguageProvider>
          <PWAProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <div className="min-h-screen bg-cream">
                  <InstallBanner />
                  <Navigation />
                  <main className="container mx-auto px-4 py-6 pb-24 md:pb-6">
                    <Routes />
                  </main>
                  <InstallPrompt />
                </div>
              </BrowserRouter>
            </TooltipProvider>
          </PWAProvider>
        </LanguageProvider>
      </AuthProvider>
    </AuthErrorBoundary>
  </QueryClientProvider>
);

export default App;
