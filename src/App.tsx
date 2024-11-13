import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "./components/Navigation";
import Index from "./pages/Index";
import Thoughts from "./pages/Thoughts";
import CommitmentClarifier from "./pages/CommitmentClarifier";
import CompletedCommitments from "./pages/CompletedCommitments";
import Dashboard from "./pages/Dashboard";
import FAQ from "./pages/FAQ";
import Auth from "./pages/Auth";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isTemporaryAccess] = useState(() => sessionStorage.getItem("temporaryAccess") === "true");

  useEffect(() => {
    if (!isTemporaryAccess) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        setIsAuthenticated(!!session);
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      setIsAuthenticated(true);
    }
  }, [isTemporaryAccess]);

  if (isAuthenticated === null) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return isAuthenticated || isTemporaryAccess ? <>{children}</> : <Navigate to="/auth" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="md:pt-16">
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/thoughts" element={<ProtectedRoute><Thoughts /></ProtectedRoute>} />
            <Route path="/commitment-clarifier" element={<ProtectedRoute><CommitmentClarifier /></ProtectedRoute>} />
            <Route path="/completed-commitments" element={<ProtectedRoute><CompletedCommitments /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/faq" element={<ProtectedRoute><FAQ /></ProtectedRoute>} />
          </Routes>
        </div>
        <Navigation />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;