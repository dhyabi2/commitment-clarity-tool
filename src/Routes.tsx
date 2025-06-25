
import { Routes as RouterRoutes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Thoughts from "./pages/Thoughts";
import CommitmentClarifier from "./pages/CommitmentClarifier";
import CommitmentFlow from "./pages/CommitmentFlow";
import CompletedCommitments from "./pages/CompletedCommitments";
import Dashboard from "./pages/Dashboard";
import FAQ from "./pages/FAQ";
import Profile from "./pages/Profile";

const Routes = () => (
  <RouterRoutes>
    <Route path="/" element={<Index />} />
    <Route path="/thoughts" element={<Thoughts />} />
    <Route path="/commitment-clarifier" element={<CommitmentClarifier />} />
    <Route path="/commitment-flow" element={<CommitmentFlow />} />
    <Route path="/completed-commitments" element={<CompletedCommitments />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/faq" element={<FAQ />} />
    <Route path="/profile" element={<Profile />} />
  </RouterRoutes>
);

export default Routes;
