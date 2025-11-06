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
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const SHOPIFY_ACCESS_TOKEN = Deno.env.get('SHOPIFY_ACCESS_TOKEN');
    const SHOPIFY_STORE_DOMAIN = 'smartcloset.myshopify.com';

    if (!LOVABLE_API_KEY || !SHOPIFY_ACCESS_TOKEN) {
      throw new Error('Missing required API keys');
    }

    // Fetch products from Shopify
    const productsResponse = await fetch(
      `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/products.json?limit=50`,
      {
        headers: {
          'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!productsResponse.ok) {
      throw new Error('Failed to fetch products from Shopify');
    }

    const productsData = await productsResponse.json();
    const products = productsData.products || [];

    // Prepare product data for AI analysis
    const productSummary = products.map((p: any) => ({
      title: p.title,
      product_type: p.product_type,
      tags: p.tags,
      vendor: p.vendor,
      variants: p.variants?.length || 0,
    }));

    const systemPrompt = `You are an AI analytics assistant for an e-commerce fashion store called Smart Closet. 
Analyze the provided product data and generate actionable insights for the store owner.
Focus on:
1. Best-selling categories (based on product types and variety)
2. Customer trends (based on product tags and types)
3. Top product recommendations (which products to promote)

Keep your response concise, data-driven, and actionable. Format your response in JSON with these keys:
- bestCategories: array of top 3 categories with brief explanation
- customerTrends: array of 3 key trends with insights
- topRecommendations: array of 3 product recommendations with reasoning`;

    const userPrompt = `Analyze these ${products.length} products and provide insights:\n\n${JSON.stringify(productSummary, null, 2)}`;

    // Call Lovable AI
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_insights",
              description: "Generate e-commerce insights based on product analysis",
              parameters: {
                type: "object",
                properties: {
                  bestCategories: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        category: { type: "string" },
                        insight: { type: "string" }
                      },
                      required: ["category", "insight"]
                    }
                  },
                  customerTrends: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        trend: { type: "string" },
                        detail: { type: "string" }
                      },
                      required: ["trend", "detail"]
                    }
                  },
                  topRecommendations: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        product: { type: "string" },
                        reason: { type: "string" }
                      },
                      required: ["product", "reason"]
                    }
                  }
                },
                required: ["bestCategories", "customerTrends", "topRecommendations"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "generate_insights" } }
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      throw new Error('AI analysis failed');
    }

    const aiData = await aiResponse.json();
    console.log('AI Response:', JSON.stringify(aiData));

    // Extract the tool call result
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    let insights;

    if (toolCall?.function?.arguments) {
      insights = JSON.parse(toolCall.function.arguments);
    } else {
      // Fallback to parsing content if tool call didn't work
      const content = aiData.choices?.[0]?.message?.content || '{}';
      insights = JSON.parse(content);
    }

    return new Response(JSON.stringify(insights), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in admin-ai-insights:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        bestCategories: [],
        customerTrends: [],
        topRecommendations: []
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
