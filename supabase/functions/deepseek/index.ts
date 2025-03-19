
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const deepseekApiKey = Deno.env.get('DEEPSEEK_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, messages, model = "deepseek-chat" } = await req.json();
    
    const apiUrl = "https://api.deepseek.com/v1/chat/completions";
    
    // Check if this is a summary request
    const isSummaryRequest = messages && 
      messages.some(m => 
        m.role === 'system' && 
        (m.content.includes('summary') || m.content.includes('brief'))
      );
    
    // Default to a lower token count for summaries to encourage brevity
    const maxTokens = isSummaryRequest ? 
      200 : // Reduce token count for summary requests
      1000; // Default for other requests
    
    const requestBody = {
      model: model,
      messages: messages || [
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: maxTokens
    };

    // Log summary request details
    if (isSummaryRequest) {
      console.log("Processing summary request with reduced token count:", maxTokens);
    }

    console.log("DeepSeek API request - system prompt preview:", 
      messages && messages.length > 0 && messages[0].role === 'system' 
        ? messages[0].content.substring(0, 100) + '...' 
        : 'No system prompt');

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${deepseekApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("DeepSeek API error response:", errorData);
      return new Response(JSON.stringify({ 
        error: `DeepSeek API error: ${response.status}`,
        details: errorData
      }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    console.log("DeepSeek API response - preview:", 
      data?.choices?.[0]?.message?.content?.substring(0, 100) + '...');

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in deepseek function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
