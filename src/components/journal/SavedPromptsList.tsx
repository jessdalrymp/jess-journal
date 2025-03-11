
import { useState, useEffect } from "react";
import { SavedPrompt, fetchSavedPrompts, toggleFavoritePrompt, deleteSavedPrompt } from "../../services/savedPromptsService";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, Star, StarOff, Trash2, ExternalLink } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";

interface SavedPromptsListProps {
  onSelectPrompt: (prompt: SavedPrompt) => void;
}

export const SavedPromptsList = ({ onSelectPrompt }: SavedPromptsListProps) => {
  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPrompt, setSelectedPrompt] = useState<SavedPrompt | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadPrompts();
    }
  }, [user]);

  const loadPrompts = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const prompts = await fetchSavedPrompts(user.id);
      setSavedPrompts(prompts);
    } catch (error) {
      console.error("Error loading saved prompts:", error);
      toast({
        title: "Error loading saved prompts",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFavorite = async (promptId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    try {
      const success = await toggleFavoritePrompt(promptId);
      if (success) {
        setSavedPrompts(prev => prev.map(prompt => 
          prompt.id === promptId 
            ? { ...prompt, favorite: !prompt.favorite }
            : prompt
        ));
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast({
        title: "Error updating favorite status",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const handleDeletePrompt = async (promptId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    try {
      const success = await deleteSavedPrompt(promptId);
      if (success) {
        setSavedPrompts(prev => prev.filter(prompt => prompt.id !== promptId));
        toast({
          title: "Prompt deleted",
          description: "The saved prompt has been removed"
        });
      }
    } catch (error) {
      console.error("Error deleting prompt:", error);
      toast({
        title: "Error deleting prompt",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const handlePromptSelect = (prompt: SavedPrompt) => {
    setSelectedPrompt(prompt);
    setShowDetails(true);
  };

  const handleUsePrompt = () => {
    if (selectedPrompt) {
      onSelectPrompt(selectedPrompt);
      setShowDetails(false);
    }
  };

  const favoritePrompts = savedPrompts.filter(prompt => prompt.favorite);
  const regularPrompts = savedPrompts.filter(prompt => !prompt.favorite);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold flex items-center">
          <Bookmark className="mr-2 h-5 w-5 text-jess-primary" />
          Saved Journal Prompts
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        <Tabs defaultValue="all" className="w-full">
          <div className="px-4 pt-4">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="all">All Prompts</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="p-4 space-y-3">
            {isLoading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : savedPrompts.length === 0 ? (
              <div className="text-center p-8 text-gray-500">
                <p>You haven't saved any prompts yet.</p>
                <p className="text-sm mt-2">Save interesting prompts to revisit them later.</p>
              </div>
            ) : (
              savedPrompts.map(prompt => (
                <Card 
                  key={prompt.id} 
                  className="p-3 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handlePromptSelect(prompt)}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{prompt.prompt.title}</h3>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => handleToggleFavorite(prompt.id, e)}
                      >
                        {prompt.favorite ? (
                          <Star className="h-4 w-4 text-amber-500" />
                        ) : (
                          <StarOff className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-600"
                        onClick={(e) => handleDeletePrompt(prompt.id, e)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2 mt-1">{prompt.prompt.prompt}</p>
                  <div className="text-xs text-gray-400 mt-2">
                    {new Date(prompt.createdAt).toLocaleDateString()}
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="favorites" className="p-4 space-y-3">
            {isLoading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : favoritePrompts.length === 0 ? (
              <div className="text-center p-8 text-gray-500">
                <p>You don't have any favorite prompts yet.</p>
                <p className="text-sm mt-2">Mark prompts as favorites to find them quickly.</p>
              </div>
            ) : (
              favoritePrompts.map(prompt => (
                <Card 
                  key={prompt.id} 
                  className="p-3 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handlePromptSelect(prompt)}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{prompt.prompt.title}</h3>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => handleToggleFavorite(prompt.id, e)}
                      >
                        <Star className="h-4 w-4 text-amber-500" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-600"
                        onClick={(e) => handleDeletePrompt(prompt.id, e)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2 mt-1">{prompt.prompt.prompt}</p>
                  <div className="text-xs text-gray-400 mt-2">
                    {new Date(prompt.createdAt).toLocaleDateString()}
                  </div>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-md">
          {selectedPrompt && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedPrompt.prompt.title}</DialogTitle>
                <DialogDescription>
                  Saved on {new Date(selectedPrompt.createdAt).toLocaleDateString()}
                </DialogDescription>
              </DialogHeader>
              
              <div className="mt-2 space-y-3">
                <div>
                  <div className="bg-jess-subtle p-3 rounded-lg">
                    <p className="text-sm">{selectedPrompt.prompt.prompt}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1">Instructions:</h4>
                  <ol className="list-decimal pl-5 space-y-1">
                    {selectedPrompt.prompt.instructions.map((instruction, index) => (
                      <li key={index} className="text-sm text-gray-700">{instruction}</li>
                    ))}
                  </ol>
                </div>
              </div>
              
              <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
                <Button 
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => setShowDetails(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="w-full sm:w-auto bg-jess-primary hover:bg-jess-primary/90"
                  onClick={handleUsePrompt}
                >
                  Use This Prompt
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
