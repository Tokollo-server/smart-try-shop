import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/lib/shopify";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";
import { ChevronRight, ShoppingBag } from "lucide-react";
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

  const genderOptions = [
    { label: "All", value: "all" },
    { label: "Women", value: "women" },
    { label: "Men", value: "men" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="container flex-1 py-6">
        <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link to="/" className="font-semibold text-foreground">smartcloset</Link>
          <ChevronRight className="h-3 w-3" />
          {category || searchQuery ? <Link to="/catalog" className="hover:text-foreground">Shop</Link> : <span className="font-semibold text-foreground">Shop</span>}
          {(category || searchQuery) && <>
              <ChevronRight className="h-3 w-3" />
              <span className="font-semibold text-foreground">{searchQuery ? "Search" : categoryTitle}</span>
            </>}
        </nav>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">
            {categoryTitle} <span className="ml-1 font-semibold text-muted-foreground">{filteredAndSortedProducts.length} items</span>
          </h1>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="h-10 w-[200px] rounded-full border-0 bg-secondary px-5 font-semibold" aria-label="Sort products">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Sort: Featured</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          <aside className="lg:w-64 lg:flex-shrink-0">
            <h2 className="mb-3 hidden text-xl font-bold lg:block">Filter</h2>
            <div className="rounded-lg bg-secondary p-4">
              <h3 className="mb-3 text-base font-bold">Gender</h3>
              <div className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
                {genderOptions.map(option => <button
                    key={option.value}
                    type="button"
                    onClick={() => setGenderFilter(option.value)}
                    className={cn(
                      "rounded-md px-3 py-1.5 text-left text-sm font-medium transition-colors",
                      genderFilter === option.value ? "bg-black text-white" : "bg-background hover:bg-background/70 lg:bg-transparent lg:hover:bg-background"
                    )}
                  >
                    {option.label}
                  </button>)}
              </div>
            </div>
          </aside>

          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, idx) => <ProductCardSkeleton key={idx} />)}
              </div>
            ) : filteredAndSortedProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 xl:grid-cols-4">
                {filteredAndSortedProducts.map((product) => (
                  <ProductCard key={product.node.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="rounded-lg bg-secondary px-6 py-20 text-center">
                <ShoppingBag className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
                <h3 className="text-xl font-bold">No products found</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try a different filter or search term.
                </p>
                <Link to="/catalog" className="mt-6 inline-block rounded-md bg-black px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-black/80">
                  View all products
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CatalogWithSort;
