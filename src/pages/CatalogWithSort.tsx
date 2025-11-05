import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/lib/shopify";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CatalogWithSort = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const addItem = useCartStore(state => state.addItem);
  const category = searchParams.get('category');
  const searchQuery = searchParams.get('search');
  
  const [sortBy, setSortBy] = useState<string>("featured");
  const [genderFilter, setGenderFilter] = useState<string>("all");

  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => getProducts(50)
  });

  const filteredAndSortedProducts = useMemo(() => {
    if (!products) return [];

    let filtered = [...products];

    // Filter by category
    if (category) {
      filtered = filtered.filter(product => 
        product.node.title.toLowerCase().includes(category.toLowerCase()) ||
        product.node.description?.toLowerCase().includes(category.toLowerCase())
      );
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.node.title.toLowerCase().includes(query) ||
        product.node.description?.toLowerCase().includes(query)
      );
    }

    // Filter by gender
    if (genderFilter !== "all") {
      filtered = filtered.filter(product => {
        const title = product.node.title.toLowerCase();
        const description = product.node.description?.toLowerCase() || "";
        
        if (genderFilter === "men") {
          return title.includes("men") || description.includes("men");
        } else if (genderFilter === "women") {
          return title.includes("women") || description.includes("women");
        }
        return true;
      });
    }

    // Sort products
    if (sortBy === "price-low") {
      filtered.sort((a, b) => 
        parseFloat(a.node.priceRange.minVariantPrice.amount) - 
        parseFloat(b.node.priceRange.minVariantPrice.amount)
      );
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => 
        parseFloat(b.node.priceRange.minVariantPrice.amount) - 
        parseFloat(a.node.priceRange.minVariantPrice.amount)
      );
    }

    return filtered;
  }, [products, category, searchQuery, sortBy, genderFilter]);

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

  const categoryTitle = searchQuery 
    ? `Search results for "${searchQuery}"`
    : category 
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : "All Products";

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar />
      
      <div className="container py-12 flex-1">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">{categoryTitle}</h1>
          
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-400">Gender:</label>
              <Select value={genderFilter} onValueChange={setGenderFilter}>
                <SelectTrigger className="w-[140px] bg-zinc-900 border-zinc-800 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800">
                  <SelectItem value="all" className="text-white">All</SelectItem>
                  <SelectItem value="men" className="text-white">Men</SelectItem>
                  <SelectItem value="women" className="text-white">Women</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-400">Sort by:</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px] bg-zinc-900 border-zinc-800 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800">
                  <SelectItem value="featured" className="text-white">Featured</SelectItem>
                  <SelectItem value="price-low" className="text-white">Price: Low to High</SelectItem>
                  <SelectItem value="price-high" className="text-white">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="ml-auto text-sm text-gray-400">
              {filteredAndSortedProducts.length} products
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <p className="text-gray-400">Loading products...</p>
          </div>
        ) : filteredAndSortedProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredAndSortedProducts.map((product) => {
              const image = product.node.images?.edges?.[0]?.node;
              const price = product.node.priceRange.minVariantPrice;
              
              return (
                <Card 
                  key={product.node.id}
                  className="group overflow-hidden bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-all"
                >
                  <div 
                    className="aspect-square overflow-hidden bg-zinc-800 cursor-pointer"
                    onClick={() => navigate(`/product/${product.node.handle}`)}
                  >
                    {image ? (
                      <img
                        src={image.url}
                        alt={image.altText || product.node.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingCart className="h-16 w-16 text-gray-600" />
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 space-y-3">
                    <div onClick={() => navigate(`/product/${product.node.handle}`)} className="cursor-pointer">
                      <h3 className="font-semibold line-clamp-1 mb-1 text-white">{product.node.title}</h3>
                      <p className="text-lg font-bold text-primary">
                        {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
                      </p>
                    </div>
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90" 
                      size="sm"
                      onClick={() => handleAddToCart(product)}
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
            <ShoppingCart className="h-20 w-20 text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2 text-white">No products found</h3>
            <p className="text-gray-400">
              Try adjusting your filters or search query.
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CatalogWithSort;
