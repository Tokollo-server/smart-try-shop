import { Link, useLocation, useNavigate } from "react-router-dom";
import { CartDrawer } from "./CartDrawer";
import { Search, User, Image, Menu, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const navLinks = [
  { label: "All", category: null },
  { label: "Women", category: "women" },
  { label: "Men", category: "men" },
  { label: "Kids", category: "kids" },
  { label: "Accessories", category: "accessories" },
  { label: "Shoes", category: "shoes" },
  { label: "Deals", category: "deals" },
];

const linkFor = (category: string | null) => (category ? `/catalog?category=${category}` : "/catalog");

export const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const activeCategory = location.pathname === "/catalog" ? new URLSearchParams(location.search).get("category") : undefined;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    try {
      const { data } = await supabase.functions.invoke("gemini-smart-search", {
        body: { query: searchQuery }
      });
      if (data?.keywords?.length > 0) {
        const searchTerm = data.keywords.join(" ");
        const category = data.category !== "all" ? `&category=${data.category}` : "";
        navigate(`/catalog?search=${encodeURIComponent(searchTerm)}${category}`);
      } else {
        navigate(`/catalog?search=${encodeURIComponent(searchQuery)}`);
      }
    } catch (error) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const searchForm = (
    <form onSubmit={handleSearch} role="search" className="relative w-full">
      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/80" />
      <input
        type="search"
        aria-label="Search products"
        placeholder="Search products, categories or styles"
        className="h-10 w-full rounded-full border-0 bg-white/20 pl-12 pr-4 text-sm text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/60"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
      />
    </form>
  );

  return <header className="sticky top-0 z-50 w-full bg-background">
      <div className="bg-black text-white">
        <div className="container flex h-14 items-center gap-3 md:h-16 md:gap-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="-ml-2 text-white hover:bg-white/10 hover:text-white" aria-label="Open menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 bg-background p-0 [&>button]:text-white">
              <SheetHeader className="bg-black px-6 py-5 text-left">
                <SheetTitle className="text-2xl font-extrabold tracking-tight text-white">smartcloset</SheetTitle>
              </SheetHeader>
              <nav className="px-6 py-4">
                <p className="mb-2 text-sm text-muted-foreground">Shop by department</p>
                <ul>
                  {navLinks.map(link => <li key={link.label}>
                      <SheetClose asChild>
                        <Link to={linkFor(link.category)} className="block border-b border-border py-3 text-base font-semibold">
                          {link.label === "All" ? "Shop all" : link.label}
                        </Link>
                      </SheetClose>
                    </li>)}
                </ul>
                <p className="mb-2 mt-8 text-sm text-muted-foreground">Help & services</p>
                <ul className="space-y-1 text-sm font-medium">
                  <li>
                    <SheetClose asChild>
                      <Link to="/ai-assistant" className="flex items-center gap-3 py-2">
                        <MessageCircle className="h-4 w-4" /> Style Assistant
                      </Link>
                    </SheetClose>
                  </li>
                  <li>
                    <SheetClose asChild>
                      <Link to="/image-generator" className="flex items-center gap-3 py-2">
                        <Image className="h-4 w-4" /> Look Creator
                      </Link>
                    </SheetClose>
                  </li>
                  <li>
                    <SheetClose asChild>
                      <Link to="/auth" className="flex items-center gap-3 py-2">
                        <User className="h-4 w-4" /> My account
                      </Link>
                    </SheetClose>
                  </li>
                </ul>
              </nav>
            </SheetContent>
          </Sheet>

          <Link to="/" className="text-2xl font-extrabold tracking-tight">smartcloset</Link>

          <div className="mx-auto hidden w-full max-w-xl md:block">{searchForm}</div>

          <div className="ml-auto flex items-center gap-1 md:ml-0 [&_button]:text-white [&_button:hover]:bg-white/10 [&_button:hover]:text-white">
            <Button variant="ghost" size="icon" aria-label="My account" onClick={() => navigate("/auth")}>
              <User className="h-6 w-6" />
            </Button>
            <CartDrawer />
          </div>
        </div>
        <div className="container pb-3 md:hidden">{searchForm}</div>
      </div>

      <nav className="border-b border-border bg-background" aria-label="Departments">
        <ul className="container flex gap-1 overflow-x-auto py-3 [scrollbar-width:none]">
          {navLinks.map(link => {
            const active = activeCategory !== undefined && activeCategory === link.category;
            return <li key={link.label} className="flex-shrink-0">
                <Link to={linkFor(link.category)} className={cn("block rounded-full px-4 py-1.5 text-sm font-semibold transition-colors", active ? "bg-black text-white" : "text-foreground/60 hover:text-foreground")}>
                  {link.label}
                </Link>
              </li>;
          })}
        </ul>
      </nav>
    </header>;
};
