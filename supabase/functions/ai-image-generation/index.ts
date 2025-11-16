import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { checkRateLimit } from "../_shared/rateLimiter.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation
function validateInput(data: any): { prompt: string; width?: number; height?: number } {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid request body');
  }

  if (!data.prompt || typeof data.prompt !== 'string') {
    throw new Error('Prompt is required and must be a string');
  }

  if (data.prompt.length === 0 || data.prompt.length > 1000) {
    throw new Error('Prompt must be between 1 and 1000 characters');
  }

  const width = data.width || 1024;
  const height = data.height || 1024;

  if (typeof width !== 'number' || width < 256 || width > 2048) {
    throw new Error('Width must be a number between 256 and 2048');
  }

  if (typeof height !== 'number' || height < 256 || height > 2048) {
    throw new Error('Height must be a number between 256 and 2048');
  }

  return { prompt: data.prompt, width, height };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting (10 requests per 10 minutes)
    const authHeader = req.headers.get('Authorization');
    const rateLimitResult = await checkRateLimit(authHeader, 'ai-image-generation', 10, 10);
    
    if (!rateLimitResult.allowed) {
      return new Response(
        JSON.stringify({ 
          error: rateLimitResult.error || 'Rate limit exceeded. Please try again in a few minutes.' 
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const requestData = await req.json();
    const { prompt, width, height } = validateInput(requestData);
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Generating image with prompt:', prompt);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image',
        messages: [
          {
            role: 'user',
            content: `Generate a high-quality ${width}x${height} image: ${prompt}`
          }
        ],
        modalities: ['image', 'text']
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'AI service rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI service credits exhausted. Please add more credits.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI response received');

    // Extract the generated image
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    const textContent = data.choices?.[0]?.message?.content;

    if (!imageUrl) {
      console.error('No image in response:', JSON.stringify(data));
      throw new Error('No image generated');
    }

    return new Response(
      JSON.stringify({ 
        imageUrl,
        description: textContent || 'Image generated successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in ai-image-generation:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const statusCode = errorMessage.includes('must be') || errorMessage.includes('Invalid') ? 400 : 500;
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: statusCode, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});