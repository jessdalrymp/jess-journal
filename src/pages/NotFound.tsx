
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "../components/Header";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { DisclaimerBanner } from "../components/ui/DisclaimerBanner";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-jess-background">
      <Header />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <h1 className="text-5xl font-bold text-jess-primary mb-4">404</h1>
          <p className="text-xl text-jess-foreground mb-6">
            Oops! We couldn't find that page
          </p>
          <p className="text-jess-muted mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex space-x-4 justify-center">
            <Link to="/dashboard">
              <Button className="flex items-center gap-2">
                <Home size={18} />
                Back to Dashboard
              </Button>
            </Link>
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
      <DisclaimerBanner />
    </div>
  );
};

export default NotFound;
