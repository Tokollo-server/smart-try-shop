import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface VirtualTryOnModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  productType?: string;
  productDescription?: string;
}

export const VirtualTryOnModal = ({ 
  isOpen, 
  onClose, 
  productName, 
  productType = "clothing",
  productDescription = ""
}: VirtualTryOnModalProps) => {
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTryOn = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('gemini-virtual-tryon', {
        body: { productName, productType, productDescription }
      });

      if (error) throw error;

      setAdvice(data.advice);
    } catch (error) {
      console.error('Virtual try-on error:', error);
      setAdvice("This outfit would look great on you! Perfect for a modern, stylish look.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch advice when modal opens
  useState(() => {
    if (isOpen && !advice) {
      handleTryOn();
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-background">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight">
            Styling advice
          </DialogTitle>
          <DialogDescription>
            Personalized recommendations for {productName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-4 py-8">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
              <p className="text-sm text-muted-foreground">Analyzing your perfect fit...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-secondary rounded-lg">
                <p className="text-sm leading-relaxed">{advice}</p>
              </div>
              
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Close</Button>
          {!loading && (
            <Button onClick={handleTryOn}>
                            Refresh Advice
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
