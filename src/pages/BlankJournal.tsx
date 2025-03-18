
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { DisclaimerBanner } from "../components/ui/DisclaimerBanner";
import { useUserData } from "../context/UserDataContext";
import { saveJournalEntry } from "@/services/journal";
import { useAuth } from "../context/AuthContext";
import { ActionButton } from "../components/ui/ActionButton";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { JournalEntryEditor } from "@/components/journal/JournalEntryEditor";
import { useIsMobile } from "@/hooks/use-mobile";
import { JournalPromptSelector } from "@/components/journal/JournalPromptSelector";
import { Prompt, PromptCategory } from "@/components/journal/data/promptCategories";

const BlankJournal = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { fetchJournalEntries } = useUserData();
  const [content, setContent] = useState('```json\n{\n  "title": "Untitled Entry",\n  "summary": ""\n}\n```');
  const [title, setTitle] = useState("Untitled Entry");
  const [isSaving, setIsSaving] = useState(false);
  const isMobile = useIsMobile();
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<PromptCategory | null>(null);
  const [showPromptSelector, setShowPromptSelector] = useState(true);

  useEffect(() => {
    try {
      const jsonMatch = content.match(/```json\s*([\s\S]*?)```/);
      if (jsonMatch && jsonMatch[1]) {
        const parsedJson = JSON.parse(jsonMatch[1].trim());
        if (parsedJson.title && title === "Untitled Entry") {
          setTitle(parsedJson.title);
        }
      }
    } catch (e) {
      console.error("Error parsing initial JSON content", e);
    }
  }, []);

  const handleSave = async () => {
    if (!user) {
      toast.error("You need to be logged in to save an entry");
      return;
    }

    setIsSaving(true);
    
    try {
      const jsonMatch = content.match(/```json\s*([\s\S]*?)```/);
      let contentToSave = content;
      
      if (jsonMatch && jsonMatch[1]) {
        try {
          const parsedJson = JSON.parse(jsonMatch[1].trim());
          parsedJson.title = title;
          // Add type if selected from a prompt category
          if (selectedCategory) {
            parsedJson.type = selectedCategory.id;
          }
          contentToSave = `\`\`\`json\n${JSON.stringify(parsedJson, null, 2)}\n\`\`\``;
        } catch (e) {
          console.error("Error updating title in JSON content", e);
        }
      }
      
      const promptText = selectedPrompt || title;
      
      const newEntry = await saveJournalEntry(
        user.id,
        promptText,
        contentToSave
      );
      
      if (!newEntry) {
        toast.error("Failed to save journal entry");
        return;
      }
      
      fetchJournalEntries();
      
      toast.success("Journal entry saved successfully");
      navigate(`/dashboard`);
    } catch (error) {
      console.error("Error saving journal entry:", error);
      toast.error("Failed to save journal entry");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePromptSelect = (category: PromptCategory, prompt: Prompt) => {
    setSelectedCategory(category);
    setSelectedPrompt(prompt);
    setTitle(`${category.name}: ${prompt.substring(0, 40)}...`);
    setShowPromptSelector(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-jess-background">
      <Header />
      <main className="flex-1 py-6 container mx-auto">
        <div className="flex items-center justify-between mb-6">
          <ActionButton 
            type="ghost" 
            className="mr-4" 
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to Dashboard
          </ActionButton>
        </div>
        
        {showPromptSelector ? (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <JournalPromptSelector onPromptSelect={handlePromptSelect} onSkip={() => setShowPromptSelector(false)} />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-6">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-2xl font-semibold px-2 py-1 h-auto text-gray-900 focus-visible:outline-none w-full bg-jess-subtle rounded-md"
                placeholder="Enter title..."
              />
              <p className="text-sm text-jess-muted mt-2">
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
              title={title}
              onTitleChange={setTitle} 
              promptText={selectedPrompt || undefined}
            />
          </div>
        )}
      </main>
      <DisclaimerBanner />
    </div>
  );
};

export default BlankJournal;
