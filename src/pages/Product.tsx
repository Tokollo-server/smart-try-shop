import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { getProductByHandle } from "@/lib/shopify";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingBag, ArrowLeft, Sparkles, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { AIOutfitRecommendations } from "@/components/AIOutfitRecommendations";
import { VirtualTryOnModal } from "@/components/VirtualTryOnModal";

const Product = () => {
  const { handle } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore(state => state.addItem);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showTryOn, setShowTryOn] = useState(false);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', handle],
    queryFn: () => getProductByHandle(handle!),
    enabled: !!handle
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-12">
          <div className="grid md:grid-cols-2 gap-12">
            <Skeleton className="aspect-[4/5] rounded-none bg-secondary" />
            <div className="space-y-6">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-10 w-1/3" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-24 text-center">
          <h1 className="font-display text-4xl mb-6">Product not found</h1>
          <Button className="rounded-full px-8" onClick={() => navigate('/catalog')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Catalog
          </Button>
        </main>
      </div>
    );
  }

  const selectedVariant = product.variants.edges[selectedVariantIndex]?.node;
  const images = product.images?.edges || [];

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    
    addItem({
      product: { node: product },
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions
    });
    
    toast.success("Added to cart", {
      description: product.title,
      position: "top-center"
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="container py-12 flex-1">
        <button
          type="button"
          className="eyebrow mb-8 flex items-center gap-2 hover:text-foreground"
          onClick={() => navigate('/catalog')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to shop
        </button>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          <div className="space-y-4">
            <div className="aspect-[4/5] overflow-hidden bg-secondary">
              {images.length > 0 ? (
                <img
                  src={images[selectedImage].node.url}
                  alt={images[selectedImage].node.altText || product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingBag className="h-16 w-16 text-muted-foreground/50" />
                </div>
              )}
            </div>
            
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-[4/5] overflow-hidden border transition-all ${
                      selectedImage === idx ? 'border-foreground' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img.node.url}
                      alt={img.node.altText || product.title}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-8 md:sticky md:top-36 md:self-start">
            <div>
              <p className="eyebrow mb-3">Smart Closet</p>
              <h1 className="font-display text-4xl md:text-5xl leading-tight mb-4">{product.title}</h1>
              <p className="text-xl">
                {selectedVariant?.price.currencyCode} {parseFloat(selectedVariant?.price.amount || '0').toFixed(2)}
              </p>
            </div>

            {product.description && (
              <div>
                <h2 className="eyebrow mb-3">Description</h2>
                <p className="leading-relaxed text-muted-foreground">{product.description}</p>
              </div>
            )}

            {product.options && product.options.length > 0 && (
              <div className="space-y-4">
                {product.options.map((option) => (
                  <div key={option.name}>
                    <h3 className="eyebrow mb-3">{option.name}</h3>
                    <div className="flex flex-wrap gap-2">
                      {option.values.map((value, idx) => (
                        <button
                          type="button"
                          key={value}
                          className={`min-w-12 rounded-full border px-4 py-2 text-sm transition-colors ${
                            selectedVariantIndex === idx
                              ? 'border-foreground bg-foreground text-background'
                              : 'border-border hover:border-foreground'
                          }`}
                          onClick={() => setSelectedVariantIndex(idx)}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-4 space-y-3">
              <Button 
                size="lg" 
                className="w-full h-14 rounded-full text-xs uppercase tracking-[0.15em]"
                onClick={handleAddToCart}
                disabled={!selectedVariant?.availableForSale}
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                {selectedVariant?.availableForSale ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              
              <Button 
                variant="outline"
                size="lg" 
                className="w-full h-14 rounded-full border-foreground bg-transparent text-xs uppercase tracking-[0.15em] hover:bg-foreground hover:text-background"
                onClick={() => setShowTryOn(true)}
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Try it on with AI
              </Button>
            </div>

            <ul className="space-y-3 border-t border-border pt-6 text-sm text-muted-foreground">
              <li className="flex items-center gap-3"><Truck className="h-4 w-4 text-foreground" /> Free shipping on orders over $29</li>
              <li className="flex items-center gap-3"><ShieldCheck className="h-4 w-4 text-foreground" /> Secure checkout with Shopify</li>
              <li className="flex items-center gap-3"><RotateCcw className="h-4 w-4 text-foreground" /> Easy returns</li>
            </ul>
          </div>
        </div>

        {/* AI Outfit Recommendations */}
        <div className="mt-20 border-t border-border">
          <AIOutfitRecommendations 
            productName={product.title}
            productType={product.productType || "clothing"}
          />
        </div>
      </main>
      
      <Footer />
      
      {/* Virtual Try-On Modal */}
      <VirtualTryOnModal
        isOpen={showTryOn}
        onClose={() => setShowTryOn(false)}
        productName={product.title}
        productType={product.productType || "clothing"}
        productDescription={product.description}
      />
    </div>
  );
};

export default Product;