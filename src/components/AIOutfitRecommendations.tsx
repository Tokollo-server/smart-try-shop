import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Recommendation {
  name: string;
  items: string[];
}

interface AIOutfitRecommendationsProps {
  productName: string;
  productType?: string;
}

export const AIOutfitRecommendations = ({ productName, productType = "clothing" }: AIOutfitRecommendationsProps) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('gemini-outfit-recommendations', {
          body: { productName, productType }
        });

        if (error) throw error;

        setRecommendations(data.recommendations || []);
      } catch (error) {
        console.error('Failed to fetch recommendations:', error);
        // Fallback recommendations
        setRecommendations([
          { name: "Casual Chic", items: ["Denim jeans", "White sneakers", "Crossbody bag"] },
          { name: "Street Style", items: ["Cargo pants", "High-top sneakers", "Baseball cap"] }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [productName, productType]);

  if (loading) {
    return (
      <div className="py-12">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold">AI-Recommended Combos</h2>
        </div>
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="flex items-center justify-center gap-2 mb-6">
        <Sparkles className="h-5 w-5 text-primary animate-pulse" />
        <h2 className="text-2xl font-bold">AI-Recommended Combos</h2>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        {recommendations.map((rec, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-shadow animate-fade-in">
            <h3 className="font-bold text-lg mb-4 text-primary">{rec.name}</h3>
            <ul className="space-y-2">
              {rec.items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
};
