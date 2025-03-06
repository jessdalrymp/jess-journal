
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

const Account = () => {
  const { user, signOut } = useAuth();
  const { profile, saveProfile, subscription } = useUserData();
  const navigate = useNavigate();

  const handleSavePersonalInfo = (editedName: string) => {
    // Here you would update the user's name in your database
    // For now, we'll just update the UI state
    console.log("Saving new name:", editedName);
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
          <div className="space-y-4">
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
