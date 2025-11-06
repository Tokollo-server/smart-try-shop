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
    <div className="bg-zinc-900 border-b border-zinc-800">
      <div className="container py-3">
        <div className="flex items-center gap-3">
          <Truck className="h-4 w-4 text-primary flex-shrink-0" />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-white">
                {progress >= 100 
                  ? "FREE SHIPPING UNLOCKED! 🎉" 
                  : `Add $${remaining.toFixed(2)} more for FREE SHIPPING!`}
              </span>
              <span className="text-xs text-gray-400">${totalPrice.toFixed(2)} / $29.00</span>
            </div>
            <Progress value={progress} className="h-1.5 bg-zinc-800" />
          </div>
        </div>
      </div>
    </div>
  );
};
