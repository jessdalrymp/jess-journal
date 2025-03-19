
import { Loader2 } from "lucide-react";
import { Header } from "../../components/Header";
import { DisclaimerBanner } from "../../components/ui/DisclaimerBanner";

export const MyStoryLoading = () => {
  return (
    <div className="min-h-screen flex flex-col bg-jess-background">
      <Header />
      <main className="flex-1 py-6 container mx-auto flex items-center justify-center">
        <div className="animate-pulse flex items-center">
          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
          Loading...
        </div>
      </main>
      <DisclaimerBanner />
    </div>
  );
};
