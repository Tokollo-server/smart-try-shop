import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/lib/shopify";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { ArrowRight, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { freeDeliveryLabel } from "@/lib/shipping";
import heroImage from "@/assets/hero-closet.jpg";

const perks = [
  { icon: Truck, title: "Free delivery", text: freeDeliveryLabel.replace("Free delivery on", "On") },
  { icon: RotateCcw, title: "Easy returns", text: "Changed your mind? No problem" },
  { icon: ShieldCheck, title: "Secure checkout", text: "Pay safely with Shopify" },
];

const categories = [{
  name: "Women",
  image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80",
  link: "/catalog?category=women",
  className: "md:col-span-2"
}, {
  name: "Men",
  image: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=800&q=80",
  link: "/catalog?category=men",
  className: ""
}, {
  name: "Kids",
  image: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=800&q=80",
  link: "/catalog?category=kids",
  className: ""
}, {
  name: "Accessories",
  image: "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=1200&q=80",
  link: "/catalog?category=accessories",
  className: "md:col-span-2"
}];

const deals = [{
  title: "Summer collection",
  description: "Buy 1 get 1 free on all summer wear",
  image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80",
  tag: "50% off"
}, {
  title: "Bags & accessories",
  description: "Buy one, get one free on bags",
  image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80",
  tag: "BOGO"
}, {
  title: "Footwear",
  description: "Buy one pair, get another free",
  image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80",
  tag: "2 for 1"
}];

const SectionHeader = ({ title, to }: { title: string; to: string }) => <div className="mb-4 flex items-end justify-between gap-4">
    <h2 className="text-xl font-bold tracking-tight md:text-2xl">{title}</h2>
    <Link to={to} className="flex items-center gap-1 text-sm font-semibold hover:underline">
      View all <ArrowRight className="h-4 w-4" />
    </Link>
  </div>;

const Index = () => {
  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: () => getProducts(8)
  });

  return <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="container flex-1 space-y-10 py-4 md:space-y-14 md:py-6">
        <div className="space-y-4 md:space-y-6">
          <ul className="grid gap-3 sm:grid-cols-3">
            {perks.map((perk, idx) => <li key={perk.title} className={cn("flex items-center gap-4 rounded-md bg-promo px-5 py-3", idx > 0 && "hidden sm:flex")}>
                <perk.icon className="h-6 w-6 flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold md:text-base">{perk.title}</p>
                  <p className="text-xs">{perk.text}</p>
                </div>
              </li>)}
          </ul>

          <section className="rounded-md bg-black p-3 md:p-4" aria-label="Featured">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              <Link to="/catalog" className="flex flex-col justify-center rounded-md bg-white p-5 md:p-10">
                <h1 className="text-[28px] font-black uppercase leading-[0.85] tracking-tight sm:text-5xl lg:text-7xl">
                  New<br />season
                </h1>
                <span className="mt-4 inline-flex w-fit items-center gap-1.5 whitespace-nowrap rounded-md bg-black px-3 py-2 text-[11px] font-bold uppercase text-white md:mt-6 md:px-4 md:text-sm">
                  Shop now <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
              <Link to="/catalog?category=deals" className="flex flex-col justify-center rounded-md bg-accent p-5 text-white md:p-10">
                <span className="text-xl font-black uppercase leading-none md:text-4xl">Up to</span>
                <span className="text-5xl font-black uppercase leading-[0.9] lg:text-8xl">50%<br />off</span>
                <span className="mt-3 text-xs font-semibold md:text-sm">Selected summer styles</span>
              </Link>
              <Link to="/catalog" className="col-span-2 min-h-[220px] overflow-hidden rounded-md md:col-span-1 md:min-h-[320px]">
                <img src={heroImage} alt="Inside the Smart Closet store" className="h-full w-full object-cover" />
              </Link>
            </div>
          </section>
        </div>

        <section aria-label="Shop by department" className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
          {categories.map(category => <Link key={category.name} to={category.link} className={cn("group relative h-72 overflow-hidden rounded-md bg-secondary md:h-96", category.className)}>
              <img src={category.image} alt={category.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent" />
              <span className="absolute bottom-5 left-5 flex items-center gap-4 text-4xl font-bold tracking-tight text-white md:bottom-8 md:left-8 md:text-5xl">
                {category.name}
                <ArrowRight className="h-8 w-8 stroke-[1.5] transition-transform group-hover:translate-x-1" />
              </span>
            </Link>)}
        </section>

        {products && products.length > 0 && <section>
            <SectionHeader title="New in" to="/catalog" />
            <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-4">
              {products.map(product => <ProductCard key={product.node.id} product={product} />)}
            </div>
          </section>}

        <section className="grid overflow-hidden rounded-md bg-black text-white md:grid-cols-2">
          <div className="flex flex-col justify-center p-8 md:p-12">
            <span className="mb-3 w-fit rounded-sm bg-white px-1.5 py-0.5 text-[10px] font-bold uppercase text-black">Style Assistant</span>
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">Not sure what to wear?</h2>
            <p className="mt-2 text-sm text-white/80">Get outfit ideas, sizing help and answers about your order.</p>
            <Link to="/ai-assistant" className="mt-6 inline-flex w-fit items-center gap-2 bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-white/90">
              Find out more <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <img src="https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=1200&q=80" alt="" className="h-56 w-full object-cover md:h-full" />
        </section>

        <section>
          <SectionHeader title="Shop deals" to="/catalog?category=deals" />
          <div className="grid gap-4 md:grid-cols-3">
            {deals.map(deal => <Link key={deal.title} to="/catalog?category=deals" className="group">
                <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-secondary">
                  <img src={deal.image} alt={deal.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                  <span className="absolute bottom-3 left-3 rounded-sm bg-black px-2 py-1 text-xs font-bold uppercase text-white">{deal.tag}</span>
                </div>
                <h3 className="mt-3 text-base font-bold">{deal.title}</h3>
                <p className="text-sm text-muted-foreground">{deal.description}</p>
              </Link>)}
          </div>
        </section>
      </main>

      <Footer />
    </div>;
};
export default Index;
