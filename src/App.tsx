
import { BrowserRouter } from "react-router-dom";
import Routes from "./Routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Navigation from "./components/Navigation";
import LanguageSwitcher from "./components/LanguageSwitcher";
import { TooltipProvider } from "@/components/ui/tooltip";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <BrowserRouter>
              <ProtectedRoute>
                <div className="md:pt-16">
                  <LanguageSwitcher />
                  <Routes />
                  <Navigation />
                  <Toaster />
                </div>
              </ProtectedRoute>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
