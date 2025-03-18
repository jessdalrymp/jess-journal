
import { supabase } from "../integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface ConnectionTest {
  tableName: string;
  success: boolean;
  count: number | null;
  error: string | null;
}

type ValidTableName = 'users' | 'subscriptions' | 'payment_plans' | 'coupons';

/**
 * Tests connection to various tables in the database
 * and returns results of each test
 */
export const testDatabaseConnections = async (): Promise<ConnectionTest[]> => {
  const tables: ValidTableName[] = [
    'users', // For user data
    'subscriptions',
    'payment_plans',
    'coupons'
  ];
  
  const results: ConnectionTest[] = [];
  
  for (const table of tables) {
    try {
      console.log(`Testing connection to ${table}...`);
      
      // Attempt to get a count of rows from each table
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.error(`Error details for ${table}:`, error);
        throw error;
      }
      
      results.push({
        tableName: table,
        success: true,
        count,
        error: null
      });
      
      console.log(`✅ Successfully connected to ${table}. Found ${count} rows.`);
    } catch (error) {
      console.error(`❌ Failed to connect to ${table}:`, error);
      
      let errorMessage = "Unknown error";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        errorMessage = JSON.stringify(error);
      }
      
      results.push({
        tableName: table,
        success: false,
        count: null,
        error: errorMessage
      });
    }
  }
  
  return results;
};

/**
 * Runs the database connection tests and displays the results in toasts
 */
export const runDatabaseConnectionTests = async (): Promise<void> => {
  try {
    const results = await testDatabaseConnections();
    
    // Show summary toast
    const successCount = results.filter(r => r.success).length;
    
    toast({
      title: `Database Connection Test`,
      description: `Successfully connected to ${successCount} of ${results.length} tables.`,
      variant: successCount === results.length ? "default" : "destructive"
    });
    
    // Show individual results
    results.forEach(result => {
      if (!result.success) {
        toast({
          title: `Failed to connect to ${result.tableName}`,
          description: result.error || "Unknown error",
          variant: "destructive"
        });
      }
    });
    
  } catch (error) {
    console.error("Error running database tests:", error);
    
    toast({
      title: "Database Connection Test Failed",
      description: error instanceof Error ? error.message : "Unknown error occurred",
      variant: "destructive"
    });
  }
};
