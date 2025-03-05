
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { DisclaimerBanner } from "../components/ui/DisclaimerBanner";
import { JournalEntry as JournalEntryType } from "../lib/types";
import { useUserData } from "../context/UserDataContext";
import { saveJournalEntry } from "../services/journalService";
import { useToast } from "@/hooks/use-toast";
import { JournalEntryEditor } from "@/components/journal/JournalEntryEditor";
import { useAuth } from "../context/AuthContext";
import { ActionButton } from "../components/ui/ActionButton";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const BlankJournal = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { fetchJournalEntries } = useUserData();
  const [content, setContent] = useState('```json\n{\n  "title": "Untitled Entry",\n  "summary": ""\n}\n```');
  const [isSaving, setIsSaving] = useState(false);
  const { toast: uiToast } = useToast();

  const handleSave = async () => {
    if (!user) {
      toast.error("You need to be logged in to save an entry");
      return;
    }

    setIsSaving(true);
    
    try {
      const newEntry = await saveJournalEntry(
        user.id,
        "New journal entry",
        content
      );
      
      if (!newEntry) {
        toast.error("Failed to save journal entry");
        return;
      }
      
      // Refresh entries list
      fetchJournalEntries();
      
      // Navigate to the journal entry page to view the saved entry
      toast.success("Journal entry saved successfully");
      navigate(`/journal-entry/${newEntry.id}`);
    } catch (error) {
      console.error("Error saving journal entry:", error);
      toast.error("Failed to save journal entry");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-jess-background">
      <Header />
      <main className="flex-1 py-6 container mx-auto">
        <div className="flex items-center justify-between mb-6">
          <ActionButton 
            type="ghost" 
            className="mr-4" 
            onClick={() => navigate('/journal-history')}
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to Journal
          </ActionButton>
          
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            variant="default" 
            className="flex items-center gap-2"
          >
            <Save size={16} />
            {isSaving ? "Saving..." : "Save Entry"}
          </Button>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold">
              New Journal Entry
            </h1>
            <p className="text-sm text-jess-muted">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long',
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          
          <JournalEntryEditor 
            content={content} 
            onChange={setContent} 
          />
        </div>
      </main>
      <DisclaimerBanner />
    </div>
  );
};

export default BlankJournal;
