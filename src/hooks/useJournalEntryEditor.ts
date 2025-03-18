
import { useState, useEffect } from "react";
import { JournalEntry } from "@/lib/types";
import { useUserData } from "@/context/UserDataContext";
import { updateJournalEntry } from "@/services/journalService";
import { useToast } from "@/hooks/use-toast";
import { parseEntryContent, formatContentForEditing } from "@/utils/contentParser";
import { useAuth } from "@/context/AuthContext";

export const useJournalEntryEditor = (initialEntry: JournalEntry | null) => {
  const [entry, setEntry] = useState<JournalEntry | null>(initialEntry);
  const [parsedContent, setParsedContent] = useState<{ title?: string; summary?: string } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableContent, setEditableContent] = useState("");
  const [editableTitle, setEditableTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { fetchJournalEntries } = useUserData();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (entry) {
      const parsed = parseEntryContent(entry.content);
      setParsedContent(parsed);
      setEditableContent(formatContentForEditing(entry.content));
      setEditableTitle(parsed?.title || entry.title);
    }
  }, [entry]);

  useEffect(() => {
    if (isEditing && entry) {
      // Format the content for editing when entering edit mode
      const formattedContent = formatContentForEditing(entry.content);
      setEditableContent(formattedContent);
      const parsed = parseEntryContent(entry.content);
      setEditableTitle(parsed?.title || entry.title);
    }
  }, [isEditing, entry]);

  // Update local entry when initialEntry changes
  useEffect(() => {
    if (initialEntry) {
      setEntry(initialEntry);
    }
  }, [initialEntry]);

  const handleSave = async () => {
    if (!entry || !entry.id || !user) {
      toast({
        title: "Error",
        description: "Unable to save: Missing entry information or user not authenticated.",
        variant: "destructive",
      });
      return false;
    }
    
    if (isSaving) {
      return false; // Prevent multiple save attempts
    }
    
    setIsSaving(true);
    
    // Process content before saving - we want to maintain the format
    // Update the JSON content with the current title
    let contentToSave = editableContent;
    
    try {
      const jsonMatch = contentToSave.match(/```json\s*([\s\S]*?)```/);
      if (jsonMatch && jsonMatch[1]) {
        const parsedJson = JSON.parse(jsonMatch[1].trim());
        parsedJson.title = editableTitle;
        contentToSave = `\`\`\`json\n${JSON.stringify(parsedJson, null, 2)}\n\`\`\``;
      }
    } catch (e) {
      console.error("Error updating title in JSON content", e);
    }
    
    try {
      const success = await updateJournalEntry(entry.id, contentToSave, user.id);
      if (success) {
        toast({
          title: "Entry updated",
          description: "Journal entry has been updated successfully",
        });
        
        // Update local state
        if (entry) {
          setEntry({...entry, content: contentToSave, title: editableTitle});
          setParsedContent(parseEntryContent(contentToSave));
        }
        
        // Refresh entries list
        await fetchJournalEntries();
        
        // Exit editing mode
        setIsEditing(false);
        setIsSaving(false);
        return true;
      } else {
        toast({
          title: "Error",
          description: "Failed to update journal entry",
          variant: "destructive",
        });
        setIsSaving(false);
        return false;
      }
    } catch (error) {
      console.error("Error saving journal entry:", error);
      toast({
        title: "Error",
        description: "Failed to update journal entry due to an unexpected error",
        variant: "destructive",
      });
      setIsSaving(false);
      return false;
    }
  };

  const handleCancelEdit = () => {
    if (entry) {
      // Ensure we format the content correctly when canceling edit
      setEditableContent(formatContentForEditing(entry.content));
      const parsed = parseEntryContent(entry.content);
      setEditableTitle(parsed?.title || entry.title);
    }
    setIsEditing(false);
  };

  const startEditing = () => setIsEditing(true);

  return {
    entry,
    setEntry,
    parsedContent,
    isEditing,
    editableContent,
    editableTitle,
    setEditableContent,
    setEditableTitle,
    handleSave,
    handleCancelEdit,
    startEditing,
    isSaving,
  };
};
