
import { useState, useEffect } from "react";
import { JournalEntry } from "@/lib/types";
import { useUserData } from "@/context/UserDataContext";
import { updateJournalEntry } from "@/services/journalService";
import { useToast } from "@/hooks/use-toast";
import { parseEntryContent, formatContentForEditing } from "@/utils/contentParser";

export const useJournalEntryEditor = (initialEntry: JournalEntry | null) => {
  const [entry, setEntry] = useState<JournalEntry | null>(initialEntry);
  const [parsedContent, setParsedContent] = useState<{ title?: string; summary?: string } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableContent, setEditableContent] = useState("");
  const [editableTitle, setEditableTitle] = useState("");
  const { fetchJournalEntries } = useUserData();
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

  const handleSave = async () => {
    if (!entry || !entry.id) return;
    
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
    
    const success = await updateJournalEntry(entry.id, contentToSave);
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
  };
};
