
import { Header } from "../components/Header";
import { DisclaimerBanner } from "../components/ui/DisclaimerBanner";
import { JournalChatContainer } from "@/components/journal/JournalChatContainer";
import { DeleteEntryDialog } from "@/components/journal/DeleteEntryDialog";
import { JournalHistoryContent } from "@/components/journal/JournalHistoryContent";
import { useJournalHistoryPage } from "@/hooks/useJournalHistoryPage";

const JournalHistory = () => {
  const {
    sortedEntries,
    isLoading,
    deleteDialogOpen,
    setDeleteDialogOpen,
    entryToDelete,
    showJournalChat,
    skipPrompt,
    handleEntryClick,
    handleEditClick,
    handleDeleteClick,
    handleRefreshEntries,
    handleNewEntry,
    handleWriteFreely,
    handleJournalChatBack,
    handleJournalChatSave,
    confirmDelete
  } = useJournalHistoryPage();

  if (showJournalChat) {
    return (
      <div className="min-h-screen flex flex-col bg-jess-background">
        <Header />
        <main className="flex-1 py-6 container mx-auto">
          <JournalChatContainer 
            onBack={handleJournalChatBack}
            onSave={handleJournalChatSave}
            skipPrompt={skipPrompt}
          />
        </main>
        <DisclaimerBanner />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-jess-background">
      <Header />
      <main className="flex-1 py-6 container mx-auto">
        <JournalHistoryContent 
          entries={sortedEntries}
          isLoading={isLoading}
          onEntryClick={handleEntryClick}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteClick}
          onNewEntry={handleNewEntry}
          onWriteFreely={handleWriteFreely}
          onRefresh={handleRefreshEntries}
          onBackClick={() => window.history.back()}
        />
      </main>
      <DisclaimerBanner />

      <DeleteEntryDialog 
        open={deleteDialogOpen} 
        onOpenChange={setDeleteDialogOpen}
        onConfirmDelete={confirmDelete}
      />
    </div>
  );
};

export default JournalHistory;
