import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/lib/shopify";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { useMemo } from "react";

const Catalog = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  const searchQuery = searchParams.get('search');
  const addItem = useCartStore(state => state.addItem);
  
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => getProducts(50)
  });

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    
    let filtered = products;
    
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.node.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  }, [products, searchQuery]);

  const handleAddToCart = (product: any) => {
    const variant = product.node.variants.edges[0].node;
    addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions
    });
    toast.success("Added to cart!");
  };

  const categoryTitle = category 
    ? category.charAt(0).toUpperCase() + category.slice(1) 
    : searchQuery 
    ? `Search results for "${searchQuery}"`
    : "All Products";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="container py-8 flex-1">
        <h1 className="text-4xl font-bold mb-8">{categoryTitle}</h1>
        
        {isLoading ? (
          <div className="text-center py-20">
            <p>Loading products...</p>
          </div>
        ) : filteredProducts && filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const image = product.node.images?.edges?.[0]?.node;
              const price = product.node.priceRange.minVariantPrice;
              
              return (
                <Card 
                  key={product.node.id}
                  className="group overflow-hidden"
                >
                  <div 
                    className="aspect-square overflow-hidden bg-secondary/20 cursor-pointer"
                    onClick={() => navigate(`/product/${product.node.handle}`)}
                  >
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
                    <div onClick={() => navigate(`/product/${product.node.handle}`)} className="cursor-pointer">
                      <h3 className="font-semibold line-clamp-1 mb-1">{product.node.title}</h3>
                      <p className="text-lg font-bold text-primary">
                        {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
                      </p>
                    </div>
                    <Button 
                      className="w-full" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <ShoppingCart className="h-20 w-20 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">No products found</h3>
            <p className="text-muted-foreground">
              {searchQuery ? `No results for "${searchQuery}"` : "Check back later for new items!"}
            </p>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Catalog;
