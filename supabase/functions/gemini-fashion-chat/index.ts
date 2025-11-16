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

function validateInput(data: any): { message: string; conversationHistory?: Message[] } {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid request body');
  }

  if (!data.message || typeof data.message !== 'string') {
    throw new Error('Message is required and must be a string');
  }

  if (data.message.length === 0 || data.message.length > 2000) {
    throw new Error('Message must be between 1 and 2000 characters');
  }

  const conversationHistory = data.conversationHistory || [];
  if (!Array.isArray(conversationHistory)) {
    throw new Error('Conversation history must be an array');
  }

  if (conversationHistory.length > 50) {
    throw new Error('Conversation history too long (max 50 messages)');
  }

  for (const msg of conversationHistory) {
    if (!msg.role || !msg.content) {
      throw new Error('Invalid message format in conversation history');
    }
    if (!['user', 'assistant', 'model'].includes(msg.role)) {
      throw new Error('Invalid message role');
    }
    if (typeof msg.content !== 'string' || msg.content.length > 2000) {
      throw new Error('Message content must be a string (max 2000 characters)');
    }
  }

  return { message: data.message, conversationHistory };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting (30 requests per 10 minutes for chat)
    const authHeader = req.headers.get('Authorization');
    const rateLimitResult = await checkRateLimit(authHeader, 'gemini-fashion-chat', 30, 10);
    
    if (!rateLimitResult.allowed) {
      return new Response(
        JSON.stringify({ 
          error: rateLimitResult.error || 'Rate limit exceeded. Please try again in a few minutes.' 
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const requestData = await req.json();
    const { message, conversationHistory } = validateInput(requestData);
    
    const GOOGLE_AI_API_KEY = Deno.env.get('GOOGLE_AI_API_KEY');

    if (!GOOGLE_AI_API_KEY) {
      throw new Error('GOOGLE_AI_API_KEY is not configured');
    }

    const systemPrompt = `You are Smart Stylist, a fashion expert AI assistant for Smart Closet - a vibrant, modern clothing store. 
    You help customers with:
    - Outfit suggestions and combinations
    - Fashion advice and styling tips
    - Product recommendations
    - Answering questions about clothing, accessories, and trends
    
    Keep responses friendly, concise, and fashion-forward. Be enthusiastic about style!`;

    const messages = [
      { role: 'user', parts: [{ text: systemPrompt }] },
      ...(conversationHistory || []).map((msg: Message) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      })),
      { role: 'user', parts: [{ text: message }] }
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GOOGLE_AI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: messages,
          generationConfig: {
            temperature: 0.9,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.candidates[0]?.content?.parts[0]?.text || "I'm here to help with fashion advice!";

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in gemini-fashion-chat:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const statusCode = errorMessage.includes('must be') || errorMessage.includes('Invalid') ? 400 : 500;
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: statusCode, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});