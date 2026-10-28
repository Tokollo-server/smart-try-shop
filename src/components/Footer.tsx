import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";

const shopLinks = [
  { label: "Women's Collection", to: "/catalog?category=women" },
  { label: "Men's Collection", to: "/catalog?category=men" },
  { label: "Kids' Collection", to: "/catalog?category=kids" },
  { label: "Accessories", to: "/catalog?category=accessories" },
];

const aiLinks = [
  { label: "AI Shopping Assistant", to: "/ai-assistant" },
  { label: "AI Image Generator", to: "/image-generator" },
  { label: "My Account", to: "/auth" },
];

export const Footer = () => {
  return <footer className="mt-auto bg-primary text-primary-foreground">
      <div className="container py-16 md:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <Link to="/" className="font-display text-3xl">Smart Closet</Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-primary-foreground/70">
              Your destination for curated fashion. We bring together the latest trends and timeless classics for the entire family.
            </p>
            <div className="mt-6 flex gap-3">
              {[Facebook, Instagram, Twitter].map((Icon, idx) => <a key={idx} href="#" className="flex h-10 w-10 items-center justify-center rounded-full border border-primary-foreground/20 text-primary-foreground/80 transition-colors hover:border-primary-foreground hover:text-primary-foreground">
                  <Icon className="h-4 w-4" />
                </a>)}
            </div>
          </div>

          <div className="md:col-span-2 md:col-start-6">
            <h3 className="mb-5 text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground">Shop</h3>
            <ul className="space-y-3 text-sm">
              {shopLinks.map(link => <li key={link.to}>
                  <Link to={link.to} className="text-primary-foreground/70 transition-colors hover:text-primary-foreground">{link.label}</Link>
                </li>)}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="mb-5 text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground">Smart Closet AI</h3>
            <ul className="space-y-3 text-sm">
              {aiLinks.map(link => <li key={link.to}>
                  <Link to={link.to} className="text-primary-foreground/70 transition-colors hover:text-primary-foreground">{link.label}</Link>
                </li>)}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h3 className="mb-5 text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground">Customer Care</h3>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li>Email: support@smartcloset.com</li>
              <li>Phone: +27 64 663 0612</li>
              <li>Hours: Mon-Fri 9AM-6PM EST</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-primary-foreground/15 pt-8 md:flex-row">
          <p className="text-xs text-primary-foreground/60">&copy; {new Date().getFullYear()} Smart Closet. All rights reserved.</p>
          <div className="flex gap-6 text-xs text-primary-foreground/60">
            <a href="#" className="transition-colors hover:text-primary-foreground">Privacy Policy</a>
            <a href="#" className="transition-colors hover:text-primary-foreground">Terms of Service</a>
            <a href="#" className="transition-colors hover:text-primary-foreground">Shipping Info</a>
          </div>
        </div>
      </div>
    </footer>;
};
