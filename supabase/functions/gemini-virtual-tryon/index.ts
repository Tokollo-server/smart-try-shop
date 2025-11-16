import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation
function validateInput(data: any): { productName: string; productType: string; productDescription?: string } {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid request body');
  }

  if (!data.productName || typeof data.productName !== 'string') {
    throw new Error('Product name is required and must be a string');
  }

  if (data.productName.length === 0 || data.productName.length > 200) {
    throw new Error('Product name must be between 1 and 200 characters');
  }

  const productType = data.productType || 'clothing';
  if (typeof productType !== 'string' || productType.length > 100) {
    throw new Error('Product type must be a string (max 100 characters)');
  }

  const productDescription = data.productDescription || '';
  if (typeof productDescription !== 'string' || productDescription.length > 1000) {
    throw new Error('Product description must be a string (max 1000 characters)');
  }

  return { productName: data.productName, productType, productDescription };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData = await req.json();
    const { productName, productType, productDescription } = validateInput(requestData);
    
    const GOOGLE_AI_API_KEY = Deno.env.get('GOOGLE_AI_API_KEY');

    if (!GOOGLE_AI_API_KEY) {
      throw new Error('GOOGLE_AI_API_KEY is not configured');
    }

    const prompt = `As a fashion AI stylist, provide personalized fitting advice for: ${productName} (${productType})
    ${productDescription ? `Description: ${productDescription}` : ''}
    
    Provide:
    1. Which body types this suits best (2-3 types)
    2. Recommended sizing tips
    3. Best skin tones/colors this complements
    4. Styling suggestion for wearing it
    
    Keep it encouraging and helpful, 3-4 sentences max.`;

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
            temperature: 0.7,
            maxOutputTokens: 512,
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
    const advice = data.candidates[0]?.content?.parts[0]?.text || "This outfit would look great on you!";

    return new Response(
      JSON.stringify({ advice }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in gemini-virtual-tryon:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const statusCode = errorMessage.includes('must be') || errorMessage.includes('Invalid') ? 400 : 500;
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: statusCode, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});