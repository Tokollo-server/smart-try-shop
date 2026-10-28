import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Store } from "lucide-react";
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
        description: "Your store setup is ready"
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
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="container py-16 flex-1">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
                        <h1 className="font-bold tracking-tight text-4xl md:text-5xl mb-4">Store Builder</h1>
            <p className="text-muted-foreground text-lg">
              Create a complete store design, product layout, and theme suggestions
            </p>
          </div>

          <Card className="shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                <Store className="h-5 w-5" />
                Store information
              </CardTitle>
              <CardDescription>
                Tell us about your store and we will put together a setup for you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="storeName">Store name *</Label>
                <Input
                  id="storeName"
                  placeholder="e.g., Fashion Hub"
                  value={formData.storeName}
                  onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="niche">Store niche *</Label>
                <Input
                  id="niche"
                  placeholder="e.g., Women's Fashion, Streetwear, Athletic Wear"
                  value={formData.niche}
                  onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetAudience">Target audience</Label>
                <Input
                  id="targetAudience"
                  placeholder="e.g., Young professionals, 25-35 years old"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="brandStyle">Brand style</Label>
                <Textarea
                  id="brandStyle"
                  placeholder="Describe your desired brand aesthetic (e.g., minimalist, bold, elegant)"
                  value={formData.brandStyle}
                  onChange={(e) => setFormData({ ...formData, brandStyle: e.target.value })}
                  rows={4}
                />
              </div>

              <Button
                className="w-full h-12 rounded-lg text-sm font-semibold"
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
                                        Generate store
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <div className="mt-8 p-6 bg-secondary rounded-lg">
            <h3 className="font-semibold mb-3">What you'll get</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Complete store design and color scheme</li>
              <li>Product categories and layout recommendations</li>
              <li>Brand name and logo suggestions</li>
              <li>Navigation structure and page hierarchy</li>
              <li>Typography and visual style guide</li>
            </ul>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AIBuilder;
