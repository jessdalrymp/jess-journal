
// Helper functions for the daily summary generator

// Configure CORS headers
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Create a Supabase client for the edge function
export const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://uobvlrobwohdlfbhniho.supabase.co';
export const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

// Helper function to create a client
export function createClient(supabaseUrl: string, supabaseKey: string) {
  return {
    from: (table: string) => ({
      select: (query: string) => ({
        eq: (column: string, value: string) => ({
          execute: async () => {
            const url = `${supabaseUrl}/rest/v1/${table}?select=${query}&${column}=eq.${value}`;
            const response = await fetch(url, {
              headers: {
                "Content-Type": "application/json",
                "apikey": supabaseKey,
                "Authorization": `Bearer ${supabaseKey}`,
              },
            });
            if (!response.ok) throw new Error(`Error fetching data: ${response.statusText}`);
            return { data: await response.json(), error: null };
          }
        }),
        execute: async () => {
          const url = `${supabaseUrl}/rest/v1/${table}?select=${query}`;
          const response = await fetch(url, {
            headers: {
              "Content-Type": "application/json",
              "apikey": supabaseKey,
              "Authorization": `Bearer ${supabaseKey}`,
            },
          });
          if (!response.ok) throw new Error(`Error fetching data: ${response.statusText}`);
          return { data: await response.json(), error: null };
        }
      }),
      insert: (data: any) => ({
        execute: async () => {
          const url = `${supabaseUrl}/rest/v1/${table}`;
          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "apikey": supabaseKey,
              "Authorization": `Bearer ${supabaseKey}`,
              "Prefer": "return=minimal",
            },
            body: JSON.stringify(data),
          });
          if (!response.ok) throw new Error(`Error inserting data: ${response.statusText}`);
          return { data: await response.json(), error: null };
        }
      })
    }),
    rpc: (func: string, params?: any) => ({
      execute: async () => {
        const url = `${supabaseUrl}/rest/v1/rpc/${func}`;
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "apikey": supabaseKey,
            "Authorization": `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify(params || {}),
        });
        if (!response.ok) throw new Error(`Error calling RPC: ${response.statusText}`);
        return { data: await response.json(), error: null };
      }
    })
  };
}
