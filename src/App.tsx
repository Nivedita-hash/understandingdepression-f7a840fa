import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import PreAssessment from "./pages/PreAssessment";
import PreVideoTransition from "./pages/PreVideoTransition";
import VideoPage from "./pages/VideoPage";
import PostVideoTransition from "./pages/PostVideoTransition";
import ChoiceScreen from "./pages/ChoiceScreen";
import ComparativeDashboard from "./pages/ComparativeDashboard";
import PostAssessment from "./pages/PostAssessment";
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
          <Route path="/pre-assessment" element={<PreAssessment />} />
          <Route path="/pre-video" element={<PreVideoTransition />} />
          <Route path="/video" element={<VideoPage />} />
          <Route path="/video-transition" element={<PostVideoTransition />} />
          <Route path="/choice" element={<ChoiceScreen />} />
          <Route path="/compare" element={<ComparativeDashboard />} />
          <Route path="/post-assessment" element={<PostAssessment />} />
          <Route path="/learned" element={<WhatWeLearned />} />
          <Route path="/bibliography" element={<Bibliography />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
