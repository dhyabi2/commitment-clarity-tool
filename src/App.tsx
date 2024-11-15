import { BrowserRouter } from "react-router-dom";
import Routes from "./Routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import Navigation from "./components/Navigation";
import LanguageSwitcher from "./components/LanguageSwitcher";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <BrowserRouter>
          <div className="md:pt-16">
            <LanguageSwitcher />
            <Routes />
            <Navigation />
            <Toaster />
          </div>
        </BrowserRouter>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;