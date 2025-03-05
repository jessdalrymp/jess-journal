
import { Header } from "../../components/Header";
import { DisclaimerBanner } from "../../components/ui/DisclaimerBanner";

export const JournalEntryLoading = () => {
  return (
    <div className="min-h-screen flex flex-col bg-jess-background">
      <Header />
      <main className="flex-1 py-6 container mx-auto">
        <div className="text-center py-8">Loading...</div>
      </main>
      <DisclaimerBanner />
    </div>
  );
};
