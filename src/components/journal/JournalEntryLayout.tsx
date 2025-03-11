
import { ReactNode } from "react";
import { Header } from "../../components/Header";
import { DisclaimerBanner } from "../../components/ui/DisclaimerBanner";

interface JournalEntryLayoutProps {
  children: ReactNode;
}

export const JournalEntryLayout: React.FC<JournalEntryLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-jess-background">
      <Header />
      <main className="flex-1 py-6 container mx-auto">
        {children}
      </main>
      <DisclaimerBanner />
    </div>
  );
};
