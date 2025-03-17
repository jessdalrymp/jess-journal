import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from "./components/ui/theme-provider";
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from './context/AuthContext';
import { UserDataProvider } from './context/UserDataProvider';
import LandingPage from './pages/LandingPage';
import Index from './pages/Index';
import Account from './pages/Account';
import MyStory from './pages/MyStory';
import SideQuest from './pages/SideQuest';
import BlankJournal from './pages/BlankJournal';
import JournalChallenge from './pages/JournalChallenge';
import JournalEntry from './pages/JournalEntry';
import JournalHistory from './pages/JournalHistory';
import NotFound from './pages/NotFound';
import Subscription from './pages/subscription';
import PaymentSuccess from './pages/PaymentSuccess';
import Legal from './pages/Legal';
import AdminPage from "./pages/admin";

const App = () => {
  console.log("App component initialized");
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <UserDataProvider>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<Index />} />
              <Route path="/account" element={<Account />} />
              <Route path="/subscription" element={<Subscription />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/my-story" element={<MyStory />} />
              <Route path="/side-quest" element={<SideQuest />} />
              <Route path="/journal" element={<BlankJournal />} />
              <Route path="/journal-challenge" element={<JournalChallenge />} />
              <Route path="/journal-challenge/*" element={<JournalChallenge />} />
              <Route path="/journal-entry/:id" element={<JournalEntry />} />
              <Route path="/journal-history" element={<JournalHistory />} />
              <Route path="/legal" element={<Legal />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
            <Toaster />
          </UserDataProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
