
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { runDatabaseConnectionTests, testDatabaseConnections } from "@/utils/dbConnectionTest";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

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
    } catch (error) {
      console.error("Error testing connections:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Database Connection Test</CardTitle>
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
                className="flex items-center justify-between p-3 rounded border"
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
                    <span className="text-sm text-jess-muted">
                      {result.count} rows
                    </span>
                  ) : (
                    <span className="text-sm text-red-500">
                      {result.error}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-jess-muted py-8">
            Click the button below to test database connections
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleTestConnections} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing...
            </>
          ) : (
            "Test Database Connections"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DatabaseConnectionTest;
