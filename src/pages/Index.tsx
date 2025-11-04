import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/lib/shopify";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const addItem = useCartStore(state => state.addItem);
  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: () => getProducts(8)
  });

  const categories = [
    { name: "WOMEN", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80", link: "/catalog?category=women" },
    { name: "MEN", image: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=800&q=80", link: "/catalog?category=men" },
    { name: "KIDS", image: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=800&q=80", link: "/catalog?category=kids" },
    { name: "ACCESSORIES", image: "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=800&q=80", link: "/catalog?category=accessories" }
  ];

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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-r from-primary via-accent to-primary py-20 md:py-32">
        <div className="container text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to Smart Closet</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">Discover the latest fashion trends for everyone</p>
          <Button size="lg" variant="secondary" onClick={() => navigate('/catalog')}>
            Shop Now
          </Button>
        </div>
      </section>

      {/* Categories */}
      <section className="container py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Shop by Category</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link key={category.name} to={category.link}>
              <Card className="group relative overflow-hidden aspect-[3/4] cursor-pointer hover:shadow-xl transition-all">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <h3 className="absolute bottom-6 left-6 text-2xl md:text-3xl font-bold text-white">
                  {category.name}
                </h3>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container py-12 bg-secondary/20">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold mb-3">Featured Products</h2>
          <p className="text-muted-foreground">Discover trending items</p>
        </div>

        {products && products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.slice(0, 8).map((product) => {
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
            <ShoppingCart className="h-20 w-20 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">No products yet</h3>
            <p className="text-muted-foreground mb-6">
              Your store is ready! Add products to get started.
            </p>
          </div>
        )}

        {products && products.length > 0 && (
          <div className="text-center mt-10">
            <Button size="lg" onClick={() => navigate('/catalog')}>
              View All Products
            </Button>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Index;
