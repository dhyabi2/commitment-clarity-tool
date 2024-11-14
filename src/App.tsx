import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import ProtectedRoute from "./components/ProtectedRoute";
import Auth from "./pages/Auth";
import Verify from "./pages/Verify";
import Index from "./pages/Index";
import Thoughts from "./pages/Thoughts";
import CommitmentClarifier from "./pages/CommitmentClarifier";
import CompletedCommitments from "./pages/CompletedCommitments";
import Dashboard from "./pages/Dashboard";
import FAQ from "./pages/FAQ";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="md:pt-16">
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/verify" element={<Verify />} />
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