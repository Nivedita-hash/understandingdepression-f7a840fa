import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AboutDepression from "./pages/AboutDepression";
import CaseSelection from "./pages/CaseSelection";
import CaseDetail from "./pages/CaseDetail";
import Transition from "./pages/Transition";
import PostAssessmentTransition from "./pages/PostAssessmentTransition";
import ComparativeView from "./pages/ComparativeView";
import WhatWeLearned from "./pages/WhatWeLearned";
import Bibliography from "./pages/Bibliography";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about-depression" element={<AboutDepression />} />
          <Route path="/cases" element={<CaseSelection />} />
          <Route path="/case/:id" element={<CaseDetail />} />
          <Route path="/transition" element={<Transition />} />
          <Route path="/post-assessment" element={<PostAssessmentTransition />} />
          <Route path="/compare" element={<ComparativeView />} />
          <Route path="/learned" element={<WhatWeLearned />} />
          <Route path="/bibliography" element={<Bibliography />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
