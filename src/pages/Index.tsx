import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/lib/shopify";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, ShoppingCart, Bot, TrendingUp, MessageCircle, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
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

  const aiFeatures = [
    {
      icon: <Bot className="h-8 w-8" />,
      title: "AI Store Builder",
      description: "Generate complete store designs with AI-powered layouts and themes",
      link: "/ai-builder"
    },
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: "Smart Product Descriptions",
      description: "Create engaging, SEO-optimized descriptions automatically",
      link: "/ai-descriptions"
    },
    {
      icon: <MessageCircle className="h-8 w-8" />,
      title: "24/7 AI Assistant",
      description: "Virtual shopping assistant for your customers",
      link: "/ai-assistant"
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Marketing Engine",
      description: "Generate ads, social content, and email campaigns",
      link: "/ai-marketing"
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Predictive Analytics",
      description: "Sales trends, behavior insights, and demand forecasting",
      link: "/ai-analytics"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section with Categories */}
      <section className="container py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {categories.map((category) => (
            <Link key={category.name} to={category.link}>
              <Card className="group relative overflow-hidden aspect-[3/4] cursor-pointer hover:shadow-xl transition-all">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <h3 className="absolute bottom-6 left-6 text-3xl md:text-4xl font-bold text-white">
                  {category.name}
                </h3>
              </Card>
            </Link>
          ))}
        </div>

        {/* Promotional Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-accent p-12 mb-12 text-center text-white">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              <span>AI-Powered Shopping</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Build Your Smart Store in Minutes
            </h2>
            <p className="text-xl mb-6 max-w-2xl mx-auto">
              Let AI handle everything - from design to marketing
            </p>
            <Button size="lg" variant="secondary" onClick={() => navigate('/ai-builder')}>
              Start Building
            </Button>
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section className="bg-secondary/20 py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">AI-Powered Features</h2>
            <p className="text-muted-foreground text-lg">Transform your e-commerce with intelligent automation</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiFeatures.map((feature) => (
              <Card key={feature.title} className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(feature.link)}>
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button size="lg" onClick={() => navigate('/admin')}>
              Admin Dashboard
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container py-16">
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Featured Products</h2>
          <p className="text-muted-foreground">Discover trending items</p>
        </div>

        {products && products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(0, 4).map((product) => {
                const image = product.node.images?.edges?.[0]?.node;
                const price = product.node.priceRange.minVariantPrice;
                
                return (
                  <Card 
                    key={product.node.id}
                    className="group cursor-pointer hover:shadow-lg transition-all"
                    onClick={() => navigate(`/product/${product.node.handle}`)}
                  >
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
                    
                    <div className="p-4">
                      <h3 className="font-semibold line-clamp-1 mb-2">{product.node.title}</h3>
                      <p className="text-lg font-bold">
                        {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
                      </p>
                    </div>
                  </Card>
                );
              })}
            </div>
            <div className="text-center mt-10">
              <Button size="lg" onClick={() => navigate('/catalog')}>
                View All Products
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <ShoppingCart className="h-20 w-20 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">No products yet</h3>
            <p className="text-muted-foreground mb-6">
              Start by creating your first product! Tell me what product you'd like to add and its price.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Index;
