import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation
function validateInput(data: any): { storeName: string; niche: string; targetAudience?: string; brandStyle?: string } {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid request body');
  }

  if (!data.storeName || typeof data.storeName !== 'string') {
    throw new Error('Store name is required and must be a string');
  }

  if (data.storeName.length === 0 || data.storeName.length > 200) {
    throw new Error('Store name must be between 1 and 200 characters');
  }

  if (!data.niche || typeof data.niche !== 'string') {
    throw new Error('Niche is required and must be a string');
  }

  if (data.niche.length === 0 || data.niche.length > 200) {
    throw new Error('Niche must be between 1 and 200 characters');
  }

  const targetAudience = data.targetAudience || '';
  if (typeof targetAudience !== 'string' || targetAudience.length > 500) {
    throw new Error('Target audience must be a string (max 500 characters)');
  }

  const brandStyle = data.brandStyle || '';
  if (typeof brandStyle !== 'string' || brandStyle.length > 500) {
    throw new Error('Brand style must be a string (max 500 characters)');
  }

  return { storeName: data.storeName, niche: data.niche, targetAudience, brandStyle };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData = await req.json();
    const { storeName, niche, targetAudience, brandStyle } = validateInput(requestData);
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const prompt = `You are an AI store builder expert. Generate a comprehensive store setup for:
Store Name: ${storeName}
Niche: ${niche}
Target Audience: ${targetAudience || 'Not specified'}
Brand Style: ${brandStyle || 'Not specified'}

Provide:
1. Color scheme (primary, secondary, accent colors)
2. Typography recommendations
3. Store layout structure
4. Product category suggestions
5. Navigation menu structure
6. Brand voice and tone guidelines`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are an expert e-commerce store designer.' },
          { role: 'user', content: prompt }
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
    const storeConfig = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ config: storeConfig }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in ai-store-builder:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const statusCode = errorMessage.includes('must be') || errorMessage.includes('Invalid') ? 400 : 500;
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: statusCode, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});