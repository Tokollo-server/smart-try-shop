import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";

const columns = [
  {
    title: "Shop",
    links: [
      { label: "Women", to: "/catalog?category=women" },
      { label: "Men", to: "/catalog?category=men" },
      { label: "Kids", to: "/catalog?category=kids" },
      { label: "Accessories", to: "/catalog?category=accessories" },
      { label: "Deals", to: "/catalog?category=deals" },
    ],
  },
  {
    title: "Help & services",
    links: [
      { label: "Style Assistant", to: "/ai-assistant" },
      { label: "Look Creator", to: "/image-generator" },
      { label: "My account", to: "/auth" },
    ],
  },
];

export const Footer = () => {
  return <footer className="mt-auto bg-black text-white">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="text-2xl font-extrabold tracking-tight">smartcloset</Link>
            <p className="mt-3 max-w-xs text-sm text-white/70">
              Fashion for the whole family, delivered to your door.
            </p>
            <div className="mt-5 flex gap-2">
              {[{ Icon: Facebook, label: "Facebook" }, { Icon: Instagram, label: "Instagram" }, { Icon: Twitter, label: "Twitter" }].map(({ Icon, label }) => <a key={label} href="#" aria-label={label} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20">
                  <Icon className="h-4 w-4" />
                </a>)}
            </div>
          </div>

          {columns.map(column => <div key={column.title}>
              <h3 className="mb-4 text-sm font-bold text-white">{column.title}</h3>
              <ul className="space-y-2.5 text-sm">
                {column.links.map(link => <li key={link.label}>
                    <Link to={link.to} className="text-white/70 transition-colors hover:text-white">{link.label}</Link>
                  </li>)}
              </ul>
            </div>)}

          <div className="col-span-2 md:col-span-1">
            <h3 className="mb-4 text-sm font-bold text-white">Contact us</h3>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li><a href="mailto:support@smartcloset.com" className="hover:text-white">support@smartcloset.com</a></li>
              <li><a href="tel:+27646630612" className="hover:text-white">+27 64 663 0612</a></li>
              <li>Mon-Fri, 9am-6pm</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/15 pt-6 text-xs text-white/60 md:flex-row md:items-center md:justify-between">
          <p>&copy; {new Date().getFullYear()} Smart Closet. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-white">Privacy policy</a>
            <a href="#" className="hover:text-white">Terms & conditions</a>
            <a href="#" className="hover:text-white">Delivery</a>
          </div>
        </div>
      </div>
    </footer>;
};
