
import { Header } from "../../components/Header";
import { DisclaimerBanner } from "../../components/ui/DisclaimerBanner";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Book, RefreshCw } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { useUserData } from "@/context/UserDataContext";
import { useToast } from "@/hooks/use-toast";

export const JournalEntryNotFound = () => {
  const location = useLocation();
  const entryId = location.pathname.split('/').pop();
  const [isRetrying, setIsRetrying] = useState(false);
  const { fetchJournalEntries, journalEntries } = useUserData();
  const { toast } = useToast();

  const handleRetry = async () => {
    if (!entryId) return;
    
    setIsRetrying(true);
    try {
      // Force a fresh fetch with cache clearing
      await fetchJournalEntries();
      
      // Check if entry exists after refresh
      const foundEntry = journalEntries.find(entry => entry.id === entryId);
      if (foundEntry) {
        toast({
          title: "Entry found!",
          description: "Reloading the page with the found entry.",
        });
        
        // Use a short timeout to allow the toast to be seen
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        return;
      }
      
      toast({
        title: "Still not found",
        description: "The journal entry could not be found even after refreshing.",
        variant: "destructive"
      });
    } catch (error) {
      console.error("Error retrying to find journal entry:", error);
      toast({
        title: "Error",
        description: "Could not retry loading journal entry.",
        variant: "destructive"
      });
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-jess-background">
      <Header />
      <main className="flex-1 py-6">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-white rounded-xl p-8 shadow-md text-center">
            <div className="w-16 h-16 bg-jess-subtle/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Book className="h-8 w-8 text-jess-primary" />
            </div>
            <h1 className="text-2xl font-semibold text-jess-foreground mb-3">
              Journal Entry Not Found
            </h1>
            <p className="text-jess-muted mb-4">
              The journal entry you're looking for could not be found. It may have been recently created and not yet synchronized.
            </p>
            <p className="text-xs text-jess-muted mb-6 bg-gray-50 p-2 rounded">
              Entry ID: {entryId || 'Unknown'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                variant="outline"
                onClick={() => window.history.back()}
                className="flex items-center gap-2"
              >
                <ArrowLeft size={16} />
                Go Back
              </Button>
              <Button
                variant="outline"
                onClick={handleRetry}
                disabled={isRetrying}
                className="flex items-center gap-2"
              >
                <RefreshCw size={16} className={isRetrying ? "animate-spin" : ""} />
                {isRetrying ? "Retrying..." : "Retry"}
              </Button>
              <Link to="/journal-history">
                <Button className="w-full sm:w-auto">
                  View Journal History
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <DisclaimerBanner />
    </div>
  );
};
