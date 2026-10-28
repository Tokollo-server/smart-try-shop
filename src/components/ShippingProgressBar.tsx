import { useCartStore } from "@/stores/cartStore";
import { Truck } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { FREE_DELIVERY_THRESHOLD, STORE_CURRENCY } from "@/lib/shipping";

export const ShippingProgressBar = () => {
  const items = useCartStore(state => state.items);
  
  const totalPrice = items.reduce((sum, item) => sum + (parseFloat(item.price.amount) * item.quantity), 0);
  const shippingThreshold = FREE_DELIVERY_THRESHOLD;
  const currency = items[0]?.price.currencyCode || STORE_CURRENCY;
  const progress = Math.min((totalPrice / shippingThreshold) * 100, 100);
  const remaining = Math.max(shippingThreshold - totalPrice, 0);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background">
      <div className="container py-2.5">
        <div className="flex items-center gap-3">
          <Truck className="h-4 w-4 flex-shrink-0 " />
          <div className="flex-1">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-xs font-semibold">
                {progress >= 100 
                  ? "You qualify for free delivery" 
                  : `Spend ${formatPrice(remaining, currency)} more for free delivery`}
              </span>
              <span className="hidden text-xs text-muted-foreground sm:inline">{formatPrice(totalPrice, currency)} / {formatPrice(shippingThreshold, currency)}</span>
            </div>
            <div className="relative h-1 overflow-hidden rounded-full bg-secondary">
              <div 
                className="absolute left-0 top-0 h-full rounded-full bg-accent transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
