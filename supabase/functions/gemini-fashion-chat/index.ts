import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory } = await req.json();
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
      ...(conversationHistory || []).map((msg: any) => ({
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
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
