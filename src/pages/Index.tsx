import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/lib/shopify";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowUpRight, Image, MessageCircle, Shirt, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-closet.jpg";

const categories = [{
  name: "Women",
  image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
  link: "/catalog?category=women"
}, {
  name: "Men",
  image: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=800&q=80",
  link: "/catalog?category=men"
}, {
  name: "Kids",
  image: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=800&q=80",
  link: "/catalog?category=kids"
}, {
  name: "Accessories",
  image: "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=800&q=80",
  link: "/catalog?category=accessories"
}];

const deals = [{
  title: "Summer Collection",
  description: "Buy 1 Get 1 Free on all summer wear",
  image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80",
  tag: "50% OFF"
}, {
  title: "Accessories Deal",
  description: "BOGO on all bags and accessories",
  image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80",
  tag: "BOGO"
}, {
  title: "Footwear Bonanza",
  description: "Buy one pair, get another free",
  image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80",
  tag: "2 FOR 1"
}];

const aiFeatures = [{
  icon: MessageCircle,
  title: "AI Shopping Assistant",
  description: "Ask about sizing, orders or what to wear and get instant answers, 24/7.",
  link: "/ai-assistant"
}, {
  icon: Shirt,
  title: "Virtual Try-On Advice",
  description: "Open any product and get personalised styling advice before you buy.",
  link: "/catalog"
}, {
  icon: Image,
  title: "AI Image Generator",
  description: "Turn an outfit idea into an image to visualise your next look.",
  link: "/image-generator"
}];

const perks = ["Free shipping over $29", "AI virtual try-on", "Secure Shopify checkout", "New arrivals weekly", "Smart Stylist chat"];

const Index = () => {
  const navigate = useNavigate();
  const {
    data: products
  } = useQuery({
    queryKey: ['products'],
    queryFn: () => getProducts(8)
  });

  return <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="grid lg:grid-cols-2">
        <div className="flex items-center bg-secondary px-6 py-16 sm:px-12 lg:px-16 lg:py-24 xl:px-24">
          <div className="max-w-xl animate-fade-in-up">
            <p className="eyebrow mb-6">New season &middot; Styled by AI</p>
            <h1 className="font-display text-5xl font-light leading-[1.05] tracking-tight sm:text-6xl xl:text-7xl">
              Dress smarter,<br /><em className="font-normal text-accent">not harder.</em>
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
              Discover the latest fashion trends for everyone, with AI styling advice and virtual try-on on every piece.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button size="lg" className="h-12 rounded-full px-8 text-xs uppercase tracking-[0.15em]" onClick={() => navigate('/catalog')}>
                Shop the collection
              </Button>
              <Button size="lg" variant="outline" className="h-12 rounded-full border-foreground bg-transparent px-8 text-xs uppercase tracking-[0.15em] hover:bg-foreground hover:text-background" onClick={() => navigate('/ai-assistant')}>
                <Sparkles className="h-4 w-4" />
                Ask our AI stylist
              </Button>
            </div>
          </div>
        </div>
        <div className="relative min-h-[420px] lg:min-h-[640px]">
          <img src={heroImage} alt="Smart Closet store" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute bottom-6 left-6 right-6 max-w-xs bg-background/95 p-5 backdrop-blur sm:right-auto">
            <p className="eyebrow mb-2">Smart Stylist</p>
            <p className="font-display text-lg leading-snug">"Pair the denim jacket with white sneakers for an easy weekend look."</p>
          </div>
        </div>
      </section>

      {/* Perks marquee */}
      <section className="overflow-hidden border-b border-border py-4" aria-label="Store perks">
        <div className="flex w-max animate-marquee">
          {[...perks, ...perks, ...perks, ...perks].map((perk, idx) => <span key={idx} className="flex items-center gap-8 px-4 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              {perk}
              <span className="text-accent">&#10022;</span>
            </span>)}
        </div>
      </section>

      {/* Categories */}
      <section className="container py-20 md:py-28">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-3">Collections</p>
            <h2 className="font-display text-4xl md:text-5xl">Shop by category</h2>
          </div>
          <Link to="/catalog" className="hidden items-center gap-2 text-sm font-medium underline-offset-4 hover:underline sm:flex">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
          {categories.map(category => <Link key={category.name} to={category.link} className="group">
              <div className="aspect-[3/4] overflow-hidden bg-secondary">
                <img src={category.image} alt={category.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <h3 className="font-display text-xl md:text-2xl">{category.name}</h3>
                <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
            </Link>)}
        </div>
      </section>

      {/* New arrivals */}
      {products && products.length > 0 && <section className="container pb-20 md:pb-28">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow mb-3">Just landed</p>
              <h2 className="font-display text-4xl md:text-5xl">New arrivals</h2>
            </div>
            <Link to="/catalog" className="flex items-center gap-2 text-sm font-medium underline-offset-4 hover:underline">
              Shop all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 lg:grid-cols-4">
            {products.map(product => <ProductCard key={product.node.id} product={product} />)}
          </div>
        </section>}

      {/* AI features */}
      <section className="bg-primary text-primary-foreground">
        <div className="container py-20 md:py-28">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground/60">Smart Closet AI</p>
              <h2 className="font-display text-4xl text-primary-foreground md:text-5xl">Your personal stylist, built in.</h2>
              <p className="mt-6 text-primary-foreground/70">
                Smart Closet uses AI to help you find, style and try on pieces before they ever reach your door.
              </p>
            </div>
            <div className="grid gap-px overflow-hidden bg-primary-foreground/15 sm:grid-cols-3 lg:col-span-8">
              {aiFeatures.map(feature => <Link key={feature.title} to={feature.link} className="group flex flex-col bg-primary p-8 transition-colors hover:bg-primary-foreground/5">
                  <feature.icon className="h-6 w-6 text-accent" />
                  <h3 className="mt-8 font-display text-2xl text-primary-foreground">{feature.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-primary-foreground/70">{feature.description}</p>
                  <span className="mt-8 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.15em]">
                    Explore <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>)}
            </div>
          </div>
        </div>
      </section>

      {/* Deals */}
      <section className="container py-20 md:py-28">
        <div className="mb-12 text-center">
          <p className="eyebrow mb-3 text-accent">Limited time offer</p>
          <h2 className="font-display text-4xl md:text-5xl">Shop deals</h2>
          <p className="mt-4 text-muted-foreground">Buy One, Get One Free on Selected Items</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {deals.map(deal => <Link key={deal.title} to="/catalog" className="group">
              <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
                <img src={deal.image} alt={deal.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <span className="absolute left-4 top-4 bg-accent px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-accent-foreground">
                  {deal.tag}
                </span>
              </div>
              <h3 className="mt-5 font-display text-2xl">{deal.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{deal.description}</p>
            </Link>)}
        </div>

        <div className="mt-14 text-center">
          <Button size="lg" variant="outline" className="h-12 rounded-full border-foreground bg-transparent px-10 text-xs uppercase tracking-[0.15em] hover:bg-foreground hover:text-background" onClick={() => navigate('/catalog')}>
            Shop all deals
          </Button>
        </div>
      </section>

      <Footer />
    </div>;
};
export default Index;
