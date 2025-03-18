
import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { JournalEntry } from "../lib/types";
import { useUserData } from "../context/UserDataContext";

export const useJournalEntryLoader = () => {
  const location = useLocation();
  const { id } = useParams();
  const { journalEntries, fetchJournalEntries } = useUserData();
  const [loading, setLoading] = useState(true);
  const [initialEntry, setInitialEntry] = useState<JournalEntry | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [retryAttempts, setRetryAttempts] = useState(0);
  
  const tryFindingEntry = async () => {
    if (!id) return false;
    
    try {
      console.log(`Retry attempt ${retryAttempts + 1}: Fetching journal entries for entry ${id}`);
      await fetchJournalEntries();
      
      const foundEntry = journalEntries.find(entry => entry.id === id);
      if (foundEntry) {
        console.log(`Entry found on retry attempt ${retryAttempts + 1}`);
        setInitialEntry(foundEntry);
        setNotFound(false);
        return true;
      }
    } catch (error) {
      console.error("Error retrying journal entry fetch:", error);
    }
    return false;
  };

  useEffect(() => {
    const loadEntry = async () => {
      setLoading(true);
      
      if (location.state?.entry) {
        setInitialEntry(location.state.entry);
        setLoading(false);
        return;
      }
      
      if (id) {
        let foundEntry = journalEntries.find(entry => entry.id === id);
        
        if (!foundEntry) {
          console.log(`Entry with ID ${id} not found in ${journalEntries.length} current entries.`);
          
          try {
            await fetchJournalEntries();
            foundEntry = journalEntries.find(entry => entry.id === id);
          } catch (error) {
            console.error("Error fetching journal entries:", error);
          }
          
          if (!foundEntry && retryAttempts < 3) {
            const delayMs = Math.min(1000 * Math.pow(2, retryAttempts), 5000);
            console.log(`Entry still not found. Retrying in ${delayMs}ms...`);
            
            setTimeout(async () => {
              setRetryAttempts(prev => prev + 1);
              const found = await tryFindingEntry();
              if (!found && retryAttempts >= 2) {
                setNotFound(true);
                setLoading(false);
              }
            }, delayMs);
            
            return;
          }
        }
        
        if (foundEntry) {
          console.log(`Found entry with ID ${id}`);
          setInitialEntry(foundEntry);
        } else {
          console.log(`Entry with ID ${id} not found after ${retryAttempts} retries.`);
          setNotFound(true);
        }
      } else {
        setNotFound(true);
      }
      
      setLoading(false);
    };

    loadEntry();
  }, [id, location.state, journalEntries, retryAttempts]);

  return {
    loading,
    initialEntry,
    notFound,
    retryAttempts
  };
};
