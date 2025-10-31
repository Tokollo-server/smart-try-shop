import { useQuery } from "@tanstack/react-query";
import { getProducts, ShopifyProduct } from "@/lib/shopify";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

const ProductCard = ({ product }: { product: ShopifyProduct }) => {
  const navigate = useNavigate();
  const addItem = useCartStore(state => state.addItem);
  
  const image = product.node.images?.edges?.[0]?.node;
  const price = product.node.priceRange.minVariantPrice;
  const variant = product.node.variants.edges[0]?.node;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!variant) return;
    
    addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions
    });
    
    toast.success("Added to cart", {
      description: product.node.title,
      position: "top-center"
    });
  };

  return (
    <Card 
      className="group cursor-pointer hover:shadow-lg transition-all duration-300"
      onClick={() => navigate(`/product/${product.node.handle}`)}
    >
      <CardContent className="p-0">
        <div className="aspect-square overflow-hidden rounded-t-lg bg-secondary/20">
          {image ? (
            <img
              src={image.url}
              alt={image.altText || product.node.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingCart className="h-16 w-16 text-muted-foreground" />
            </div>
          )}
        </div>
        
        <div className="p-4 space-y-3">
          <h3 className="font-semibold text-lg line-clamp-1">{product.node.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.node.description}
          </p>
          
          <div className="flex items-center justify-between pt-2">
            <span className="text-2xl font-bold">
              {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
            </span>
            <Button 
              size="sm"
              onClick={handleAddToCart}
              disabled={!variant?.availableForSale}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Catalog = () => {
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => getProducts(20)
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Shop All Products</h1>
          <p className="text-muted-foreground">Discover our latest collection</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-0">
                  <Skeleton className="aspect-square rounded-t-lg" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.node.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <ShoppingCart className="h-20 w-20 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No products found</h2>
            <p className="text-muted-foreground mb-6">
              Start by creating your first product! Tell me what product you'd like to add and its price.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Catalog;