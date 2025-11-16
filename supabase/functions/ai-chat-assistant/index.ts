import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { checkRateLimit } from "../_shared/rateLimiter.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation
interface Message {
  role: string;
  content: string;
}

function validateInput(data: any): { messages: Message[] } {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid request body');
  }

  if (!data.messages || !Array.isArray(data.messages)) {
    throw new Error('Messages must be an array');
  }

  if (data.messages.length === 0) {
    throw new Error('Messages array cannot be empty');
  }

  if (data.messages.length > 50) {
    throw new Error('Too many messages (max 50)');
  }

  for (const msg of data.messages) {
    if (!msg.role || !msg.content) {
      throw new Error('Invalid message format');
    }
    if (!['user', 'assistant', 'system'].includes(msg.role)) {
      throw new Error('Invalid message role');
    }
    if (typeof msg.content !== 'string' || msg.content.length > 2000) {
      throw new Error('Message content must be a string (max 2000 characters)');
    }
  }

  return { messages: data.messages };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting (30 requests per 10 minutes for chat)
    const authHeader = req.headers.get('Authorization');
    const rateLimitResult = await checkRateLimit(authHeader, 'ai-chat-assistant', 30, 10);
    
    if (!rateLimitResult.allowed) {
      return new Response(
        JSON.stringify({ 
          error: rateLimitResult.error || 'Rate limit exceeded. Please try again in a few minutes.' 
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const requestData = await req.json();
    const { messages } = validateInput(requestData);
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `You are a helpful AI shopping assistant for an e-commerce fashion store. 
You help customers with:
- Product recommendations based on their preferences
- Sizing and fit guidance
- Order status and tracking
- Returns and exchanges
- Style advice and outfit suggestions
- General shopping questions

Be friendly, helpful, and concise in your responses.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const assistantResponse = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ response: assistantResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in ai-chat-assistant:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const statusCode = errorMessage.includes('must be') || errorMessage.includes('Invalid') ? 400 : 500;
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: statusCode, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});