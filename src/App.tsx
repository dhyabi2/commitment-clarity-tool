import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import Navigation from "./components/Navigation";
import LanguageSwitcher from "./components/LanguageSwitcher";
import Index from "./pages/Index";
import Thoughts from "./pages/Thoughts";
import CommitmentClarifier from "./pages/CommitmentClarifier";
import CompletedCommitments from "./pages/CompletedCommitments";
import Dashboard from "./pages/Dashboard";
import FAQ from "./pages/FAQ";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="md:pt-16">
            <LanguageSwitcher />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/thoughts" element={<Thoughts />} />
              <Route path="/commitment-clarifier" element={<CommitmentClarifier />} />
              <Route path="/completed-commitments" element={<CompletedCommitments />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/faq" element={<FAQ />} />
            </Routes>
          </div>
          <Navigation />
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;