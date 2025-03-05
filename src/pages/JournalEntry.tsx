import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Header } from "../components/Header";
import { DisclaimerBanner } from "../components/ui/DisclaimerBanner";
import { JournalEntry as JournalEntryType } from "../lib/types";
import { useUserData } from "../context/UserDataContext";
import { updateJournalEntry } from "../services/journalService";
import { useToast } from "@/hooks/use-toast";
import { JournalEntryHeader } from "@/components/journal/JournalEntryHeader";
import { JournalEntryContent } from "@/components/journal/JournalEntryContent";
import { JournalEntryEditor } from "@/components/journal/JournalEntryEditor";
import { JournalEntryMeta } from "@/components/journal/JournalEntryMeta";
import { parseEntryContent, formatContentForEditing } from "@/utils/contentParser";

const JournalEntry = () => {
  const location = useLocation();
  const { id } = useParams();
  const { journalEntries, fetchJournalEntries } = useUserData();
  const [entry, setEntry] = useState<JournalEntryType | null>(null);
  const [loading, setLoading] = useState(true);
  const [parsedContent, setParsedContent] = useState<{ title?: string; summary?: string } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableContent, setEditableContent] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // Check if editing mode was passed via state
    if (location.state?.isEditing) {
      setIsEditing(true);
    }

    // First check if entry was passed via location state
    if (location.state?.entry) {
      setEntry(location.state.entry);
      setParsedContent(parseEntryContent(location.state.entry.content));
      setEditableContent(location.state.entry.content);
      setLoading(false);
      return;
    }
    
    // Otherwise, find by ID
    if (id && journalEntries.length > 0) {
      const foundEntry = journalEntries.find(entry => entry.id === id);
      if (foundEntry) {
        setEntry(foundEntry);
        setParsedContent(parseEntryContent(foundEntry.content));
        setEditableContent(foundEntry.content);
      }
      setLoading(false);
    }
  }, [id, location.state, journalEntries]);

  const handleSave = async () => {
    if (!entry || !id) return;
    
    const success = await updateJournalEntry(id, editableContent);
    if (success) {
      toast({
        title: "Entry updated",
        description: "Journal entry has been updated successfully",
      });
      
      // Update local state
      if (entry) {
        setEntry({...entry, content: editableContent});
        setParsedContent(parseEntryContent(editableContent));
      }
      
      // Refresh entries list
      fetchJournalEntries();
      
      // Exit editing mode
      setIsEditing(false);
    } else {
      toast({
        title: "Error",
        description: "Failed to update journal entry",
        variant: "destructive",
      });
    }
  };

  const handleCancelEdit = () => {
    if (entry) {
      setEditableContent(entry.content);
    }
    setIsEditing(false);
  };

  useEffect(() => {
    if (isEditing && entry) {
      // Format the content for editing when entering edit mode
      setEditableContent(formatContentForEditing(entry.content));
    }
  }, [isEditing, entry]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-jess-background">
        <Header />
        <main className="flex-1 py-6 container mx-auto">
          <div className="text-center py-8">Loading...</div>
        </main>
        <DisclaimerBanner />
      </div>
    );
  }

  if (!entry) {
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
  }

  return (
    <div className="min-h-screen flex flex-col bg-jess-background">
      <Header />
      <main className="flex-1 py-6 container mx-auto">
        <JournalEntryHeader 
          isEditing={isEditing}
          onEditClick={() => setIsEditing(true)}
          onSaveClick={handleSave}
          onCancelEdit={handleCancelEdit}
        />
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <JournalEntryMeta 
            entry={entry} 
            title={parsedContent?.title} 
          />
          
          {isEditing ? (
            <JournalEntryEditor 
              content={editableContent} 
              onChange={setEditableContent} 
            />
          ) : (
            <JournalEntryContent 
              entry={entry} 
              parsedContent={parsedContent} 
            />
          )}
        </div>
      </main>
      <DisclaimerBanner />
    </div>
  );
};

export default JournalEntry;
