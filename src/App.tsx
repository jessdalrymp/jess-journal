
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "./components/ui/theme-provider";
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from './context/AuthContext';
import { UserDataProvider } from './context/UserDataProvider';
import Index from './pages/Index';
import Account from './pages/Account';
import MyStory from './pages/MyStory';
import SideQuest from './pages/SideQuest';
import ActionChallenge from './pages/ActionChallenge';
import BlankJournal from './pages/BlankJournal';
import JournalChallenge from './pages/JournalChallenge';
import JournalEntry from './pages/JournalEntry';
import JournalHistory from './pages/JournalHistory';
import NotFound from './pages/NotFound';
import Subscription from './pages/Subscription';
import PaymentSuccess from './pages/PaymentSuccess';

const App = () => {
  console.log("App component initialized");
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <UserDataProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/account" element={<Account />} />
              <Route path="/subscription" element={<Subscription />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/my-story" element={<MyStory />} />
              <Route path="/side-quest" element={<SideQuest />} />
              <Route path="/action-challenge" element={<ActionChallenge />} />
              <Route path="/journal" element={<BlankJournal />} />
              <Route path="/journal-challenge" element={<JournalChallenge />} />
              <Route path="/journal-entry/:id" element={<JournalEntry />} />
              <Route path="/journal-history" element={<JournalHistory />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </UserDataProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
