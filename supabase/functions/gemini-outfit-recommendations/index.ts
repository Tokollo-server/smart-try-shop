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
    const { productName, productType } = await req.json();
    const GOOGLE_AI_API_KEY = Deno.env.get('GOOGLE_AI_API_KEY');

    if (!GOOGLE_AI_API_KEY) {
      throw new Error('GOOGLE_AI_API_KEY is not configured');
    }

    const prompt = `Suggest 3 trendy outfit ideas to complement a ${productName} (${productType}). 
    For each outfit idea:
    - Give it a catchy style name (e.g., "Casual Chic", "Street Style", "Elegant Evening")
    - List 3-4 complementary items that would go well with it
    - Keep each suggestion brief and stylish
    
    Format as JSON array: [{"name": "...", "items": ["...", "...", "..."]}]`;

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
            temperature: 0.8,
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
    const aiText = data.candidates[0]?.content?.parts[0]?.text || "[]";
    
    // Extract JSON from the response
    let recommendations = [];
    try {
      const jsonMatch = aiText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        recommendations = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      // Fallback recommendations
      recommendations = [
        { name: "Casual Chic", items: ["Denim jeans", "White sneakers", "Crossbody bag"] },
        { name: "Street Style", items: ["Cargo pants", "High-top sneakers", "Baseball cap"] },
        { name: "Smart Casual", items: ["Chinos", "Loafers", "Leather watch"] }
      ];
    }

    return new Response(
      JSON.stringify({ recommendations }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in gemini-outfit-recommendations:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
