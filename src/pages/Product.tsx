import { useQuery } from "@tanstack/react-query";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getProductByHandle } from "@/lib/shopify";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingBag, ShoppingCart, ArrowLeft, ChevronRight, Package, Shirt, ShieldCheck, RotateCcw } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { freeDeliveryLabel } from "@/lib/shipping";
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
            <Skeleton className="aspect-[3/4] rounded-none bg-secondary" />
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
          <h1 className="mb-6 text-3xl font-bold tracking-tight">Product not found</h1>
          <Button className="px-8" onClick={() => navigate('/catalog')}>
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
      
      <main className="container flex-1 py-6">
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          <Link to="/" className="font-semibold text-foreground">smartcloset</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/catalog" className="hover:text-foreground">Shop</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="font-semibold text-foreground">{product.title}</span>
        </nav>

        <div className="grid gap-8 md:grid-cols-2 lg:gap-14">
          <div className="space-y-3">
            <div className="aspect-[3/4] overflow-hidden bg-secondary">
              {images.length > 0 ? (
                <img
                  src={images[selectedImage].node.url}
                  alt={images[selectedImage].node.altText || product.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <ShoppingBag className="h-16 w-16 text-muted-foreground/50" />
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(idx)}
                    aria-label={`View image ${idx + 1}`}
                    className={`h-20 w-16 overflow-hidden border-b-2 ${selectedImage === idx ? 'border-black' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  >
                    <img src={img.node.url} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6 md:sticky md:top-36 md:self-start">
            <div>
              <h1 className="text-2xl font-bold leading-tight tracking-tight md:text-3xl">{product.title}</h1>
              <p className="mt-1 text-sm text-muted-foreground">Smart Closet</p>
              <p className="mt-4 text-2xl font-bold">
                {formatPrice(selectedVariant?.price.amount || '0', selectedVariant?.price.currencyCode)}
              </p>
            </div>

            {product.options && product.options.length > 0 && (
              <div className="space-y-5">
                {product.options.map((option) => (
                  <div key={option.name}>
                    <div className="mb-3 flex items-center gap-4">
                      <h2 className="text-base font-semibold">{option.name}</h2>
                      <div className="h-px flex-1 bg-border" />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {option.values.map((value, idx) => (
                        <button
                          type="button"
                          key={value}
                          className={`min-w-12 rounded-sm px-4 py-2 text-sm font-semibold transition-colors ${
                            selectedVariantIndex === idx
                              ? 'bg-black text-white'
                              : 'bg-secondary hover:bg-border'
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

            <div className="flex items-center gap-4 rounded-lg border border-border p-4">
              <Package className="h-5 w-5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold">Get it in 2 - 4 working days</p>
                <p className="text-xs text-muted-foreground">{freeDeliveryLabel}</p>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                size="lg"
                className="h-14 w-full rounded-none bg-accent text-base font-semibold text-accent-foreground hover:bg-accent/90"
                onClick={handleAddToCart}
                disabled={!selectedVariant?.availableForSale}
              >
                {selectedVariant?.availableForSale ? 'Add to cart' : 'Out of stock'}
                <ShoppingCart className="ml-2 h-5 w-5" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="h-12 w-full rounded-none border-2 border-accent bg-transparent text-sm font-semibold text-accent hover:bg-accent/5 hover:text-accent"
                onClick={() => setShowTryOn(true)}
              >
                <Shirt className="mr-2 h-4 w-4" />
                Get styling advice
              </Button>
            </div>

            {product.description && (
              <div className="border-t border-border pt-6">
                <h2 className="mb-2 text-base font-semibold">Product details</h2>
                <p className="text-sm leading-relaxed">{product.description}</p>
              </div>
            )}

            <ul className="space-y-2 border-t border-border pt-6 text-sm">
              <li className="flex items-center gap-3"><ShieldCheck className="h-4 w-4" /> Secure checkout</li>
              <li className="flex items-center gap-3"><RotateCcw className="h-4 w-4" /> Easy returns</li>
            </ul>
          </div>
        </div>

        {/* AI Outfit Recommendations */}
        <div className="mt-16 border-t border-border">
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