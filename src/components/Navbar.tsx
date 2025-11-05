import { Link } from "react-router-dom";
import { CartDrawer } from "./CartDrawer";
import { Search, User } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.jpg";
import { supabase } from "@/integrations/supabase/client";

export const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Use AI to enhance search
      try {
        const { data } = await supabase.functions.invoke('gemini-smart-search', {
          body: { query: searchQuery }
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

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <img src={logo} alt="Smart Closet" className="h-10 w-10 object-contain" />
            <span className="text-xl font-bold hidden sm:inline">Smart Closet</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <Link to="/catalog?category=women" className="text-sm font-medium hover:text-primary transition-colors">
              Women
            </Link>
            <Link to="/catalog?category=men" className="text-sm font-medium hover:text-primary transition-colors">
              Men
            </Link>
            <Link to="/catalog?category=kids" className="text-sm font-medium hover:text-primary transition-colors">
              Kids
            </Link>
            <Link to="/catalog?category=accessories" className="text-sm font-medium hover:text-primary transition-colors">
              Accessories
            </Link>
          </div>

          <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4 hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate("/auth")}>
              <User className="h-5 w-5" />
            </Button>
            <CartDrawer />
          </div>
        </div>
      </div>
    </nav>
  );
};