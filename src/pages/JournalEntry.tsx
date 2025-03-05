
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Header } from "../components/Header";
import { DisclaimerBanner } from "../components/ui/DisclaimerBanner";
import { ArrowLeft, Save, Edit, X } from "lucide-react";
import { ActionButton } from "../components/ui/ActionButton";
import { JournalEntry as JournalEntryType } from "../lib/types";
import { useUserData } from "../context/UserDataContext";
import { updateJournalEntry } from "../services/journalService";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const JournalEntry = () => {
  const location = useLocation();
  const navigate = useNavigate();
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
      parseEntryContent(location.state.entry.content);
      setEditableContent(location.state.entry.content);
      setLoading(false);
      return;
    }
    
    // Otherwise, find by ID
    if (id && journalEntries.length > 0) {
      const foundEntry = journalEntries.find(entry => entry.id === id);
      if (foundEntry) {
        setEntry(foundEntry);
        parseEntryContent(foundEntry.content);
        setEditableContent(foundEntry.content);
      }
      setLoading(false);
    }
  }, [id, location.state, journalEntries]);

  // Function to try parsing JSON content
  const parseEntryContent = (content: string) => {
    try {
      // First, try to detect if this is a JSON string inside code blocks
      let contentToProcess = content;
      
      // Remove code block markers if present
      const jsonRegex = /```(?:json)?\s*([\s\S]*?)```/;
      const match = content.match(jsonRegex);
      if (match && match[1]) {
        contentToProcess = match[1].trim();
      }
      
      // Try to parse as JSON
      const parsed = JSON.parse(contentToProcess);
      if (parsed && (parsed.title || parsed.summary)) {
        setParsedContent(parsed);
      } else {
        setParsedContent(null);
      }
    } catch (e) {
      console.log("Content is not valid JSON or doesn't have the expected format");
      setParsedContent(null);
    }
  };

  // Function to render content with proper formatting for newlines
  const renderContent = () => {
    if (!entry) return null;
    
    // If we have parsed JSON content, use the summary
    if (parsedContent && parsedContent.summary) {
      return parsedContent.summary.split('\n').map((paragraph, index) => {
        if (!paragraph.trim()) {
          return <br key={index} />;
        }
        return <p key={index} className="mb-4">{paragraph}</p>;
      });
    }
    
    // Otherwise use the raw content
    return entry.content.split('\n').map((paragraph, index) => {
      if (!paragraph.trim()) {
        return <br key={index} />;
      }
      return <p key={index} className="mb-4">{paragraph}</p>;
    });
  };

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
        parseEntryContent(editableContent);
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
            <ActionButton 
              type="primary" 
              className="mt-4" 
              onClick={() => navigate('/journal-history')}
            >
              Back to Journal History
            </ActionButton>
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
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <ActionButton 
              type="ghost" 
              className="mr-4" 
              onClick={() => navigate('/journal-history')}
            >
              <ArrowLeft size={18} className="mr-2" />
              Back to Journal
            </ActionButton>
          </div>
          
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} variant="outline" className="flex items-center gap-2">
              <Edit size={16} />
              Edit
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button onClick={handleCancelEdit} variant="outline" className="flex items-center gap-2">
                <X size={16} />
                Cancel
              </Button>
              <Button onClick={handleSave} variant="default" className="flex items-center gap-2">
                <Save size={16} />
                Save
              </Button>
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl font-semibold">
                {parsedContent && parsedContent.title ? parsedContent.title : entry.title}
              </h1>
              <span className="text-sm px-3 py-1 bg-jess-subtle rounded-full">
                {entry.type}
              </span>
            </div>
            <p className="text-sm text-jess-muted">
              {new Date(entry.createdAt).toLocaleDateString('en-US', { 
                weekday: 'long',
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          
          {isEditing ? (
            <Textarea 
              value={editableContent} 
              onChange={(e) => setEditableContent(e.target.value)}
              className="w-full min-h-[300px] font-mono text-sm"
            />
          ) : (
            <div className="prose max-w-none">
              {renderContent()}
            </div>
          )}
        </div>
      </main>
      <DisclaimerBanner />
    </div>
  );
};

export default JournalEntry;
