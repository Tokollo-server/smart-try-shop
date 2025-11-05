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
    const { query } = await req.json();
    const GOOGLE_AI_API_KEY = Deno.env.get('GOOGLE_AI_API_KEY');

    if (!GOOGLE_AI_API_KEY) {
      throw new Error('GOOGLE_AI_API_KEY is not configured');
    }

    const prompt = `You are a smart search assistant for a fashion e-commerce store. 
    Extract key search terms from this user query: "${query}"
    
    Return a JSON object with:
    - "keywords": array of relevant product keywords
    - "category": one of ["women", "men", "kids", "accessories", "all"]
    - "attributes": object with color, style, season if mentioned
    
    Example: {"keywords": ["dress", "red", "summer"], "category": "women", "attributes": {"color": "red", "season": "summer"}}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GOOGLE_AI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 256,
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
    const aiText = data.candidates[0]?.content?.parts[0]?.text || "{}";
    
    let searchData = { keywords: [query], category: "all", attributes: {} };
    try {
      const jsonMatch = aiText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        searchData = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error('Failed to parse AI response:', e);
    }

    return new Response(
      JSON.stringify(searchData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in gemini-smart-search:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
