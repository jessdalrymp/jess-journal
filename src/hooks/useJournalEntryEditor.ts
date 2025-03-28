
import { useState, useEffect } from "react";
import { JournalEntry } from "@/lib/types";
import { useUserData } from "@/context/UserDataContext";
import { updateJournalEntry } from "@/services/journal";
import { useToast } from "@/hooks/use-toast";
import { parseEntryContent, getContentPreview, formatContentForEditing } from "@/utils/contentParser";
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
      setEditableContent(formatContentForEditing(entry));
      setEditableTitle(parsed?.title || entry.title);
    }
  }, [entry]);

  useEffect(() => {
    if (isEditing && entry) {
      setEditableContent(formatContentForEditing(entry));
      const parsed = parseEntryContent(entry.content);
      setEditableTitle(parsed?.title || entry.title);
    }
  }, [isEditing, entry]);

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
    
    // Check for empty content
    const trimmedContent = editableContent.trim();
    if (!trimmedContent) {
      toast({
        title: "Cannot save empty entry",
        description: "Please add some content to your journal entry",
        variant: "destructive"
      });
      return false;
    }
    
    setIsSaving(true);
    
    let contentToSave = editableContent;
    let prompt = entry.prompt || "Untitled Entry";
    let type = entry.type || "journal";
    
    try {
      const jsonMatch = contentToSave.match(/```json\s*([\s\S]*?)```/);
      if (jsonMatch && jsonMatch[1]) {
        const parsedJson = JSON.parse(jsonMatch[1].trim());
        parsedJson.title = editableTitle;
        
        // If there's a type in the JSON, use it
        if (parsedJson.type) {
          type = parsedJson.type;
        }
        
        contentToSave = `\`\`\`json\n${JSON.stringify(parsedJson, null, 2)}\n\`\`\``;
      }
    } catch (e) {
      console.error("Error updating title in JSON content", e);
    }
    
    try {
      const success = await updateJournalEntry(entry.id, contentToSave, user.id, prompt, type);
      if (success) {
        setIsEditing(false);
        
        // Refresh journal entries to get the updated entry
        fetchJournalEntries();
        
        // Update the local entry with the new content
        if (entry) {
          setEntry({
            ...entry,
            content: contentToSave,
            prompt: prompt,
            type: type
          });
        }
        
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
      setEditableContent(formatContentForEditing(entry));
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
