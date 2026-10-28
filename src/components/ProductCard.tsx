import { Link } from "react-router-dom";
import { Plus, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";

export const ProductCard = ({ product }: { product: ShopifyProduct }) => {
  const addItem = useCartStore(state => state.addItem);
  const image = product.node.images?.edges?.[0]?.node;
  const price = product.node.priceRange.minVariantPrice;
  const variant = product.node.variants.edges[0]?.node;

  const handleAddToCart = () => {
    if (!variant) return;
    addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions
    });
    toast.success("Added to cart", { description: product.node.title });
  };

  return <div className="group">
      <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
        <Link to={`/product/${product.node.handle}`} aria-label={product.node.title}>
          {image ? <img src={image.url} alt={image.altText || product.node.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" /> : <div className="flex h-full w-full items-center justify-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground/50" />
            </div>}
        </Link>
        {variant && <button type="button" onClick={handleAddToCart} className="absolute inset-x-3 bottom-3 flex items-center justify-center gap-2 bg-background/95 py-3 text-xs font-medium uppercase tracking-[0.15em] text-foreground opacity-100 shadow-sm transition-all duration-300 hover:bg-primary hover:text-primary-foreground md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
            <Plus className="h-3.5 w-3.5" />
            Quick add
          </button>}
      </div>
      <Link to={`/product/${product.node.handle}`} className="mt-4 block">
        <h3 className="line-clamp-1 text-sm font-medium">{product.node.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
        </p>
      </Link>
    </div>;
};

export const ProductCardSkeleton = () => <div className="animate-pulse">
    <div className="aspect-[3/4] bg-secondary" />
    <div className="mt-4 h-4 w-3/4 bg-secondary" />
    <div className="mt-2 h-4 w-1/3 bg-secondary" />
  </div>;
