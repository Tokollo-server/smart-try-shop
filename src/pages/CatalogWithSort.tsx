import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/lib/shopify";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";
import { ShoppingBag } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CatalogWithSort = () => {
  const [searchParams] = useSearchParams();
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

  const categoryTitle = searchQuery 
    ? `Search results for "${searchQuery}"`
    : category 
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : "All Products";

  const categoryLinks = [
    { label: "All", value: null },
    { label: "Women", value: "women" },
    { label: "Men", value: "men" },
    { label: "Kids", value: "kids" },
    { label: "Accessories", value: "accessories" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="bg-secondary">
        <div className="container py-14 md:py-20">
          <p className="eyebrow mb-4">
            <Link to="/" className="hover:text-foreground">Home</Link> / Shop
          </p>
          <h1 className="font-display text-4xl md:text-6xl">{categoryTitle}</h1>
          {!searchQuery && (
            <div className="mt-8 flex flex-wrap gap-2">
              {categoryLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.value ? `/catalog?category=${link.value}` : "/catalog"}
                  className={cn(
                    "rounded-full border px-5 py-2 text-xs font-medium uppercase tracking-[0.15em] transition-colors",
                    category === link.value
                      ? "border-foreground bg-foreground text-background"
                      : "border-foreground/20 hover:border-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="container py-10 flex-1">
        <div className="mb-10 flex flex-wrap items-center gap-4 border-b border-border pb-6">
          <div className="flex items-center gap-2">
            <label className="eyebrow">Gender</label>
            <Select value={genderFilter} onValueChange={setGenderFilter}>
              <SelectTrigger className="w-[140px] rounded-full bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="men">Men</SelectItem>
                <SelectItem value="women">Women</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <label className="eyebrow">Sort by</label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] rounded-full bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="ml-auto text-sm text-muted-foreground">
            {filteredAndSortedProducts.length} products
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, idx) => <ProductCardSkeleton key={idx} />)}
          </div>
        ) : filteredAndSortedProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
            {filteredAndSortedProducts.map((product) => (
              <ProductCard key={product.node.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <ShoppingBag className="mx-auto mb-6 h-12 w-12 text-muted-foreground/50" />
            <h3 className="font-display text-3xl">No products found</h3>
            <p className="mt-3 text-muted-foreground">
              Try adjusting your filters or search query.
            </p>
            <Link to="/catalog" className="mt-8 inline-block rounded-full border border-foreground px-8 py-3 text-xs font-medium uppercase tracking-[0.15em] transition-colors hover:bg-foreground hover:text-background">
              View all products
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CatalogWithSort;
