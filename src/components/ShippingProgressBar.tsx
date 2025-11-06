import { useCartStore } from "@/stores/cartStore";
import { Progress } from "@/components/ui/progress";
import { Truck } from "lucide-react";

export const ShippingProgressBar = () => {
  const items = useCartStore(state => state.items);
  
  const totalPrice = items.reduce((sum, item) => sum + (parseFloat(item.price.amount) * item.quantity), 0);
  const shippingThreshold = 29;
  const progress = Math.min((totalPrice / shippingThreshold) * 100, 100);
  const remaining = Math.max(shippingThreshold - totalPrice, 0);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 z-50 animate-in slide-in-from-bottom duration-500">
      <div className="container py-3">
        <div className="flex items-center gap-3">
          <Truck className="h-4 w-4 text-primary flex-shrink-0 animate-bounce" />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-white">
                {progress >= 100 
                  ? "FREE SHIPPING UNLOCKED! 🎉" 
                  : `Add $${remaining.toFixed(2)} more for FREE SHIPPING!`}
              </span>
              <span className="text-xs text-gray-400">${totalPrice.toFixed(2)} / $29.00</span>
            </div>
            <div className="relative">
              <Progress value={progress} className="h-1.5 bg-zinc-800" />
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary via-purple-500 to-primary bg-[length:200%_100%] animate-shimmer rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
