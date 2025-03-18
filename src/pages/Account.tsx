
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Header } from "../components/Header";
import { DisclaimerBanner } from "../components/ui/DisclaimerBanner";
import { useAuth } from "../context/AuthContext";
import { useUserData } from "../context/UserDataContext";
import { Button } from "../components/ui/button";
import { AccountHeader } from "../components/account/AccountHeader";
import { ProfileSection } from "../components/account/ProfileSection";
import { SubscriptionSection } from "../components/account/SubscriptionSection";
import { PersonalInfoSection } from "../components/account/PersonalInfoSection";
import { AssessmentSection } from "../components/account/AssessmentSection";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "../integrations/supabase/client"; // Import the Supabase client

const Account = () => {
  const { user, signOut, setUser } = useAuth();
  const { profile, saveProfile, subscription, checkSubscriptionStatus } = useUserData();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSavePersonalInfo = async (editedName: string) => {
    if (!user) return;
    
    try {
      // Update the user metadata in Supabase Auth
      const { data, error } = await supabase.auth.updateUser({
        data: { name: editedName }
      });
      
      if (error) {
        throw error;
      }
      
      // Update the local user state with the new name
      if (data?.user) {
        setUser({
          ...user,
          name: editedName
        });
      }
      
    } catch (error) {
      console.error("Error updating user name:", error);
      toast({
        title: "Error updating name",
        description: "There was a problem updating your name. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleRetakeAssessment = () => {
    // Set the completedOnboarding to false to trigger the assessment
    saveProfile({ completedOnboarding: false });
    // Navigate to the homepage where the assessment should appear
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-jess-background">
      <Header />
      <main className="flex-1 py-6 container mx-auto">
        <AccountHeader user={user} />
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="space-y-6">
            <ProfileSection user={user} />
            
            <SubscriptionSection subscription={subscription} />
            
            <PersonalInfoSection onSave={handleSavePersonalInfo} />
            
            <AssessmentSection 
              profile={profile} 
              onRetakeAssessment={handleRetakeAssessment} 
            />
            
            <div className="mt-8">
              <Button 
                variant="secondary" 
                className="w-full justify-center py-2"
                onClick={() => signOut()}
              >
                <LogOut size={18} className="mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </main>
      <DisclaimerBanner />
    </div>
  );
};

export default Account;
