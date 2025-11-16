import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Download, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [description, setDescription] = useState("");

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a description for your image");
      return;
    }

    setLoading(true);
    setGeneratedImage(null);

    try {
      const { data, error } = await supabase.functions.invoke('ai-image-generation', {
        body: { prompt: prompt.trim() }
      });

      if (error) {
        if (error.message.includes('Rate limit')) {
          toast.error("You've reached your generation limit. Please try again in a few minutes.");
        } else if (error.message.includes('Authentication required')) {
          toast.error("Please sign in to generate images");
        } else {
          toast.error(error.message || "Failed to generate image");
        }
        return;
      }

      if (data.imageUrl) {
        setGeneratedImage(data.imageUrl);
        setDescription(data.description || "");
        toast.success("Image generated successfully!");
      } else {
        toast.error("No image was generated. Please try again.");
      }
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;

    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `generated-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Image downloaded!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-24 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            AI Image Generator
          </h1>
          <p className="text-muted-foreground">
            Powered by Nano Banana (Gemini 2.5 Flash Image)
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Describe Your Image</CardTitle>
            <CardDescription>
              Enter a detailed description of the image you want to create
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Example: A serene sunset over mountains with vibrant orange and purple colors, peaceful lake in foreground, photorealistic style"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <Button 
              onClick={handleGenerate} 
              disabled={loading || !prompt.trim()}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Image
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {generatedImage && (
          <Card>
            <CardHeader>
              <CardTitle>Generated Image</CardTitle>
              {description && (
                <CardDescription>{description}</CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                <img 
                  src={generatedImage} 
                  alt="Generated artwork"
                  className="w-full h-full object-contain"
                />
              </div>
              <Button 
                onClick={handleDownload}
                variant="outline"
                className="w-full"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Image
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="mt-8 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">Tips for Better Results:</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Be specific about colors, lighting, and mood</li>
            <li>• Include style keywords like "photorealistic", "watercolor", "digital art"</li>
            <li>• Describe composition and perspective</li>
            <li>• Rate limit: 10 images per 10 minutes</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;