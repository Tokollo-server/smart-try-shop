import { Link } from "react-router-dom";
import { CartDrawer } from "./CartDrawer";
import { ShoppingBag } from "lucide-react";

export const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <ShoppingBag className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">Smart Closet</span>
        </Link>
        
        <div className="flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/catalog" className="text-sm font-medium hover:text-primary transition-colors">
            Shop
          </Link>
          <CartDrawer />
        </div>
      </div>
    </nav>
  );
};