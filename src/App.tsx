
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { UserDataProvider } from "./context/UserDataContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MyStory from "./pages/MyStory";
import SideQuest from "./pages/SideQuest";
import ActionChallenge from "./pages/ActionChallenge";
import JournalChallenge from "./pages/JournalChallenge";
import JournalHistory from "./pages/JournalHistory";
import JournalEntry from "./pages/JournalEntry";
import Account from "./pages/Account";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <UserDataProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/my-story" element={<MyStory />} />
              <Route path="/side-quest" element={<SideQuest />} />
              <Route path="/action-challenge" element={<ActionChallenge />} />
              <Route path="/journal-challenge" element={<JournalChallenge />} />
              <Route path="/journal-history" element={<JournalHistory />} />
              <Route path="/journal-entry/:id" element={<JournalEntry />} />
              <Route path="/account" element={<Account />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </UserDataProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
