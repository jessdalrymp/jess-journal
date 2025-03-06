import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Header } from "../components/Header";
import { DisclaimerBanner } from "../components/ui/DisclaimerBanner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookText, Shield } from "lucide-react";

const Legal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const tabFromQuery = queryParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabFromQuery === 'privacy' ? 'privacy' : 'terms');
  
  useEffect(() => {
    // Update URL when tab changes without causing navigation
    const newParams = new URLSearchParams();
    newParams.set('tab', activeTab);
    navigate(`/legal?${newParams.toString()}`, { replace: true });
  }, [activeTab, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-jess-background">
      <Header />
      <main className="flex-1 py-6 container mx-auto">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-semibold mb-6 text-center">Legal Information</h1>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-8">
              <TabsTrigger value="terms" className="flex items-center justify-center">
                <BookText size={18} className="mr-2" />
                Terms of Service
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center justify-center">
                <Shield size={18} className="mr-2" />
                Privacy Policy
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="terms" className="card-base p-6">
              <h2 className="text-2xl font-medium mb-4">Terms of Service</h2>
              <ScrollArea className="h-[60vh]">
                <div className="space-y-4 text-left">
                  <p>Last updated: {new Date().toLocaleDateString()}</p>
                  
                  <h3 className="text-xl font-medium mt-6">1. Introduction</h3>
                  <p>Welcome to JESS ("we," "our," or "us"). By accessing or using our service, you agree to be bound by these Terms of Service.</p>
                  
                  <h3 className="text-xl font-medium mt-6">2. Using Our Services</h3>
                  <p>You must follow any policies made available to you within the Services. You may use our Services only as permitted by law. We may suspend or stop providing our Services to you if you do not comply with our terms or policies or if we are investigating suspected misconduct.</p>
                  
                  <h3 className="text-xl font-medium mt-6">3. Your Account</h3>
                  <p>You may need an account to use some of our Services. You are responsible for the activity that happens on or through your account.</p>
                  
                  <h3 className="text-xl font-medium mt-6">4. Privacy and Copyright Protection</h3>
                  <p>Our privacy policies explain how we treat your personal data and protect your privacy when you use our Services. By using our Services, you agree that we can use such data in accordance with our privacy policies.</p>
                  
                  <h3 className="text-xl font-medium mt-6">5. Modifying and Terminating our Services</h3>
                  <p>We are constantly changing and improving our Services. We may add or remove functionalities or features, and we may suspend or stop a Service altogether.</p>
                  
                  <h3 className="text-xl font-medium mt-6">6. Liabilities</h3>
                  <p>When permitted by law, JESS and its suppliers and distributors will not be responsible for lost profits, revenues, or data, financial losses or indirect, special, consequential, exemplary, or punitive damages.</p>
                  
                  <h3 className="text-xl font-medium mt-6">7. Business Uses of our Services</h3>
                  <p>If you are using our Services on behalf of a business, that business accepts these terms.</p>
                  
                  <h3 className="text-xl font-medium mt-6">8. Disclaimer</h3>
                  <p>The content provided through our Services is for informational purposes only and is not intended as professional advice. Always seek the advice of qualified professionals regarding any questions you may have.</p>
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="privacy" className="card-base p-6">
              <h2 className="text-2xl font-medium mb-4">Privacy Policy</h2>
              <ScrollArea className="h-[60vh]">
                <div className="space-y-4 text-left">
                  <p>Last updated: {new Date().toLocaleDateString()}</p>
                  
                  <h3 className="text-xl font-medium mt-6">1. Information We Collect</h3>
                  <p>We collect information to provide better services to our users. This includes information you provide to us, such as your name, email address, and any content you create when using our services.</p>
                  
                  <h3 className="text-xl font-medium mt-6">2. How We Use Information</h3>
                  <p>We use the information we collect to provide, maintain, and improve our services, to develop new ones, and to protect our users and our services.</p>
                  
                  <h3 className="text-xl font-medium mt-6">3. Information We Share</h3>
                  <p>We do not share your personal information with companies, organizations, or individuals outside of JESS except in the following cases: with your consent, with domain administrators, for legal reasons, or in case of a merger or acquisition.</p>
                  
                  <h3 className="text-xl font-medium mt-6">4. Information Security</h3>
                  <p>We work hard to protect our users from unauthorized access to or unauthorized alteration, disclosure, or destruction of information we hold.</p>
                  
                  <h3 className="text-xl font-medium mt-6">5. User Access and Control</h3>
                  <p>We aim to provide you with access to your personal information. If that information is wrong, we strive to give you ways to update it quickly or to delete it – unless we have to keep that information for legitimate business or legal purposes.</p>
                  
                  <h3 className="text-xl font-medium mt-6">6. Third-Party Services</h3>
                  <p>Our Privacy Policy does not apply to services offered by other companies or individuals, including products or sites that may be displayed to you in search results, sites that may include our services, or other sites linked from our services.</p>
                  
                  <h3 className="text-xl font-medium mt-6">7. Changes</h3>
                  <p>Our Privacy Policy may change from time to time. We will post any privacy policy changes on this page and, if the changes are significant, we will provide a more prominent notice.</p>
                  
                  <h3 className="text-xl font-medium mt-6">8. Contact Us</h3>
                  <p>If you have questions about our Privacy Policy, please contact us at support@jess.com.</p>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <DisclaimerBanner />
    </div>
  );
};

export default Legal;
