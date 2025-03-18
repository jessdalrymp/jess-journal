
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { runDatabaseConnectionTests, testDatabaseConnections } from "@/utils/dbConnectionTest";
import { Loader2, CheckCircle2, XCircle, RefreshCw, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const DatabaseConnectionTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Array<{
    tableName: string;
    success: boolean;
    count: number | null;
    error: string | null;
  }> | null>(null);

  const handleTestConnections = async () => {
    setIsLoading(true);
    try {
      const testResults = await testDatabaseConnections();
      setResults(testResults);
      
      // Also trigger the toast notifications for a better user experience
      runDatabaseConnectionTests();
    } catch (error) {
      console.error("Error testing connections:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const hasErrors = results?.some(result => !result.success) || false;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Database Connection Test</span>
          {results && (
            <span className={`text-sm px-2 py-1 rounded ${hasErrors ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
              {hasErrors ? 'Issues Detected' : 'All Connected'}
            </span>
          )}
        </CardTitle>
        <CardDescription>
          Test connections to critical database tables
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : results ? (
          <div className="space-y-3">
            {results.map((result) => (
              <div 
                key={result.tableName} 
                className={`flex items-center justify-between p-3 rounded border ${!result.success ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}
              >
                <div className="flex items-center gap-2">
                  {result.success ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className="font-medium">{result.tableName}</span>
                </div>
                <div>
                  {result.success ? (
                    <span className="text-sm text-gray-600">
                      {result.count !== null ? `${result.count} rows` : 'Connected'}
                    </span>
                  ) : (
                    <span className="text-sm text-red-600 max-w-xs truncate" title={result.error || ''}>
                      {result.error}
                    </span>
                  )}
                </div>
              </div>
            ))}
            
            {hasErrors && (
              <Alert variant="destructive" className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Connection Issues</AlertTitle>
                <AlertDescription>
                  Some database tables could not be accessed. This may be due to permissions or RLS policies.
                  {results.find(r => r.tableName === 'payment_plans' && !r.success) && (
                    <div className="mt-2">
                      <strong>Note about payment_plans:</strong> Make sure you're logged in as an admin user to manage payment plans.
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">
            Click the button below to test database connections
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleTestConnections} 
          disabled={isLoading}
          className="w-full"
          variant={hasErrors ? "destructive" : "default"}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              {results ? "Retest Connections" : "Test Database Connections"}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DatabaseConnectionTest;
