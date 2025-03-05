
import { Header } from "../../components/Header";
import { DisclaimerBanner } from "../../components/ui/DisclaimerBanner";

export const JournalEntryNotFound = () => {
  return (
    <div className="min-h-screen flex flex-col bg-jess-background">
      <Header />
      <main className="flex-1 py-6 container mx-auto">
        <div className="text-center py-8">
          <p className="text-jess-muted mb-2">Entry not found</p>
          <button 
            className="mt-4 px-4 py-2 bg-jess-primary text-white rounded-lg"
            onClick={() => window.history.back()}
          >
            Back to Journal History
          </button>
        </div>
      </main>
      <DisclaimerBanner />
    </div>
  );
};
