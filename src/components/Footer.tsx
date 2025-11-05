import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 mt-auto">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <h3 className="font-bold text-xl mb-6 text-white">About Smart Closet</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your destination for curated fashion. We bring together the latest trends and timeless classics for the entire family.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-xl mb-6 text-white">Shop</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/catalog?category=women" className="text-gray-400 hover:text-white transition-colors">Women's Collection</Link></li>
              <li><Link to="/catalog?category=men" className="text-gray-400 hover:text-white transition-colors">Men's Collection</Link></li>
              <li><Link to="/catalog?category=kids" className="text-gray-400 hover:text-white transition-colors">Kids' Collection</Link></li>
              <li><Link to="/catalog?category=accessories" className="text-gray-400 hover:text-white transition-colors">Accessories</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-xl mb-6 text-white">Customer Care</h3>
            <ul className="space-y-3 text-sm">
              <li className="text-gray-400">Email: support@smartcloset.com</li>
              <li className="text-gray-400">Phone: +1 (555) 123-4567</li>
              <li className="text-gray-400">Hours: Mon-Fri 9AM-6PM EST</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-xl mb-6 text-white">Connect</h3>
            <div className="flex gap-4 mb-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
            </div>
            <p className="text-sm text-gray-400">
              Follow us for the latest updates and exclusive offers
            </p>
          </div>
        </div>
        
        <div className="border-t border-zinc-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">&copy; 2024 Smart Closet. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Shipping Info</a>
          </div>
        </div>
      </div>
    </footer>
  );
};