import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import Navigation from "./components/Navigation";
import LanguageSwitcher from "./components/LanguageSwitcher";
import Routes from "./Routes";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const AppContent = () => {
  const { dir } = useLanguage();
  
  return (
    <div dir={dir()}>
      <div className="md:pt-16">
        <LanguageSwitcher />
        <Routes />
      </div>
      <Navigation />
    </div>
  );
};

const queryClient = new QueryClient();

const App = () => (
  <LanguageProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </LanguageProvider>
);

export default App;