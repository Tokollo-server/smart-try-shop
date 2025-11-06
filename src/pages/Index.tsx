import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/lib/shopify";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ShippingProgressBar } from "@/components/ShippingProgressBar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import heroImage from "@/assets/hero-closet.jpg";

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
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar />
      <ShippingProgressBar />
      
      {/* Hero Banner */}
      <section className="relative h-[600px] md:h-[700px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroImage})`
          }}
        />
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="container text-center text-white relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up">
            Welcome to Smart Closet
          </h1>
          <p className="text-xl md:text-3xl mb-10 max-w-3xl mx-auto animate-fade-in-up-delay font-light">
            Discover the latest fashion trends for everyone
          </p>
          <Button 
            size="lg" 
            className="animate-fade-in-up-delay bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg"
            onClick={() => navigate('/catalog')}
          >
            Shop Now
          </Button>
        </div>
      </section>

      {/* Categories */}
      <section className="container py-16 md:py-24">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center text-white">Shop by Category</h2>
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

      {/* BOGO Deals Section */}
      <section className="container py-16 md:py-24">
        <div className="mb-12 text-center">
          <Badge className="mb-4 text-lg px-4 py-2 bg-accent">Limited Time Offer</Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">BOGO Shop Deals</h2>
          <p className="text-gray-400 text-lg">Buy One, Get One Free on Selected Items</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Summer Collection",
              description: "Buy 1 Get 1 Free on all summer wear",
              image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80",
              tag: "50% OFF"
            },
            {
              title: "Accessories Deal",
              description: "BOGO on all bags and accessories",
              image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80",
              tag: "BOGO"
            },
            {
              title: "Footwear Bonanza",
              description: "Buy one pair, get another free",
              image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80",
              tag: "2 FOR 1"
            }
          ].map((deal, index) => (
            <Card 
              key={index}
              className="group overflow-hidden cursor-pointer hover:shadow-xl transition-all"
              onClick={() => navigate('/catalog')}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={deal.image}
                  alt={deal.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <Badge className="absolute top-4 right-4 bg-accent text-white text-sm px-3 py-1">
                  {deal.tag}
                </Badge>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{deal.title}</h3>
                  <p className="text-white/90 text-sm">{deal.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            size="lg" 
            className="bg-accent hover:bg-accent/90 text-white px-8 py-6 text-lg"
            onClick={() => navigate('/catalog')}
          >
            <Tag className="mr-2 h-5 w-5" />
            Shop All Deals
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
