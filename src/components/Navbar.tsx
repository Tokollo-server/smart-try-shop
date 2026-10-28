import { Link, NavLink, useNavigate } from "react-router-dom";
import { CartDrawer } from "./CartDrawer";
import { Search, User, Sparkles, Image, Menu, X, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const navLinks = [
  { label: "Shop All", to: "/catalog" },
  { label: "Women", to: "/catalog?category=women" },
  { label: "Men", to: "/catalog?category=men" },
  { label: "Kids", to: "/catalog?category=kids" },
  { label: "Accessories", to: "/catalog?category=accessories" },
];

export const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchOpen(false);
      // Use AI to enhance search
      try {
        const {
          data
        } = await supabase.functions.invoke('gemini-smart-search', {
          body: {
            query: searchQuery
          }
        });
        if (data?.keywords?.length > 0) {
          const searchTerm = data.keywords.join(' ');
          const category = data.category !== 'all' ? `&category=${data.category}` : '';
          navigate(`/catalog?search=${encodeURIComponent(searchTerm)}${category}`);
        } else {
          navigate(`/catalog?search=${encodeURIComponent(searchQuery)}`);
        }
      } catch (error) {
        // Fallback to regular search
        navigate(`/catalog?search=${encodeURIComponent(searchQuery)}`);
      }
    }
  };

  const searchForm = (
    <form onSubmit={handleSearch} className="relative w-full">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search for dresses, sneakers, bags..."
        className="h-11 rounded-full border-border bg-card pl-10"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        autoFocus={searchOpen}
      />
    </form>
  );

  return <header className="sticky top-0 z-50 w-full">
      <div className="bg-primary text-primary-foreground">
        <p className="container py-2 text-center text-[11px] font-medium uppercase tracking-[0.2em]">
          Free shipping on orders over $29<span className="hidden sm:inline"> &middot; AI styling advice on every piece</span>
        </p>
      </div>

      <nav className="border-b border-border backdrop-blur supports-[backdrop-filter]:bg-[hsl(var(--navbar)/0.85)]" style={{ backgroundColor: 'hsl(var(--navbar) / 0.95)' }}>
        <div className="container">
          <div className="grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-4 md:h-20">
            <div className="flex items-center gap-1">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 bg-background">
                  <SheetHeader>
                    <SheetTitle className="font-display text-2xl font-normal">Smart Closet</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">{searchForm}</div>
                  <ul className="mt-8 space-y-1">
                    {navLinks.map(link => <li key={link.to}>
                        <SheetClose asChild>
                          <Link to={link.to} className="block border-b border-border py-3 font-display text-xl">
                            {link.label}
                          </Link>
                        </SheetClose>
                      </li>)}
                  </ul>
                  <p className="eyebrow mt-8 mb-3">AI tools</p>
                  <ul className="space-y-3 text-sm">
                    <li>
                      <SheetClose asChild>
                        <Link to="/ai-assistant" className="flex items-center gap-2 hover:text-accent">
                          <MessageCircle className="h-4 w-4" /> AI Shopping Assistant
                        </Link>
                      </SheetClose>
                    </li>
                    <li>
                      <SheetClose asChild>
                        <Link to="/image-generator" className="flex items-center gap-2 hover:text-accent">
                          <Image className="h-4 w-4" /> AI Image Generator
                        </Link>
                      </SheetClose>
                    </li>
                    <li>
                      <SheetClose asChild>
                        <Link to="/auth" className="flex items-center gap-2 hover:text-accent">
                          <User className="h-4 w-4" /> My Account
                        </Link>
                      </SheetClose>
                    </li>
                  </ul>
                </SheetContent>
              </Sheet>

              <ul className="hidden items-center gap-6 lg:flex">
                {navLinks.map(link => <li key={link.to}>
                    <NavLink to={link.to} className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground">
                      {link.label}
                    </NavLink>
                  </li>)}
              </ul>
            </div>

            <Link to="/" className="whitespace-nowrap font-display text-xl tracking-tight sm:text-2xl md:text-3xl">
              Smart Closet
            </Link>

            <div className="flex items-center justify-end gap-1">
              <Button variant="ghost" size="icon" aria-label="Search" onClick={() => setSearchOpen(open => !open)}>
                {searchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hidden sm:inline-flex" aria-label="AI tools">
                    <Sparkles className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate("/image-generator")}>
                    <Image className="mr-2 h-4 w-4" />
                    AI Image Generator
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/ai-assistant")}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    AI Shopping Assistant
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="ghost" size="icon" className="hidden sm:inline-flex" aria-label="Account" onClick={() => navigate("/auth")}>
                <User className="h-5 w-5" />
              </Button>
              <CartDrawer />
            </div>
          </div>
        </div>

        <div className={cn("overflow-hidden border-t border-border transition-all duration-300", searchOpen ? "max-h-24 opacity-100" : "max-h-0 border-t-0 opacity-0")}>
          <div className="container max-w-2xl py-4">{searchForm}</div>
        </div>
      </nav>
    </header>;
};
