import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, Store } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const AIBuilder = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    storeName: "",
    niche: "",
    targetAudience: "",
    brandStyle: ""
  });

  const handleGenerate = async () => {
    if (!formData.storeName || !formData.niche) {
      toast.error("Please fill in store name and niche");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-store-builder', {
        body: formData
      });

      if (error) throw error;

      toast.success("Store configuration generated!", {
        description: "Your AI-powered store setup is ready"
      });
    } catch (error) {
      console.error('Error generating store:', error);
      toast.error("Failed to generate store", {
        description: "Please try again"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              <span>AI Store Builder</span>
            </div>
            <h1 className="text-4xl font-bold mb-3">Build Your Store with AI</h1>
            <p className="text-muted-foreground text-lg">
              Let AI create a complete store design, product layout, and theme suggestions
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                Store Information
              </CardTitle>
              <CardDescription>
                Tell us about your store and our AI will do the rest
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="storeName">Store Name *</Label>
                <Input
                  id="storeName"
                  placeholder="e.g., Fashion Hub"
                  value={formData.storeName}
                  onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="niche">Store Niche *</Label>
                <Input
                  id="niche"
                  placeholder="e.g., Women's Fashion, Streetwear, Athletic Wear"
                  value={formData.niche}
                  onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetAudience">Target Audience</Label>
                <Input
                  id="targetAudience"
                  placeholder="e.g., Young professionals, 25-35 years old"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="brandStyle">Brand Style Preferences</Label>
                <Textarea
                  id="brandStyle"
                  placeholder="Describe your desired brand aesthetic (e.g., minimalist, bold, elegant)"
                  value={formData.brandStyle}
                  onChange={(e) => setFormData({ ...formData, brandStyle: e.target.value })}
                  rows={4}
                />
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handleGenerate}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Store
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <div className="mt-8 p-6 bg-secondary/20 rounded-lg">
            <h3 className="font-semibold mb-3">What AI Will Generate:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✓ Complete store design and color scheme</li>
              <li>✓ Product categories and layout recommendations</li>
              <li>✓ Brand name and logo suggestions</li>
              <li>✓ Navigation structure and page hierarchy</li>
              <li>✓ Typography and visual style guide</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIBuilder;
