
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from "./components/ui/theme-provider";
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from './context/AuthContext';
import { UserDataProvider } from './context/UserDataProvider';
import Dashboard from './pages/Dashboard';
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
import { AuthCallback } from './components/auth/AuthCallback';

const App = () => {
  console.log("App component initialized");
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <UserDataProvider>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Navigate to="/" replace />} />
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
              <Route path="/auth/callback" element={<AuthCallback />} />
            </Routes>
            <Toaster />
          </UserDataProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
