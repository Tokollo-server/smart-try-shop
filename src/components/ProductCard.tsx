import { Link } from "react-router-dom";
import { ShoppingBag, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/lib/utils";

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
          {image ? <img src={image.url} alt={image.altText || product.node.title} loading="lazy" className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground/50" />
            </div>}
        </Link>
        {variant && <button type="button" onClick={handleAddToCart} aria-label={`Add ${product.node.title} to cart`} className="absolute bottom-2 right-2 flex h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow-sm transition-colors hover:bg-black hover:text-white md:opacity-0 md:group-hover:opacity-100">
            <ShoppingCart className="h-4 w-4" />
          </button>}
      </div>
      <Link to={`/product/${product.node.handle}`} className="mt-2 block">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug">{product.node.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">Smart Closet</p>
        <p className="mt-1 text-sm font-bold">{formatPrice(price.amount, price.currencyCode)}</p>
      </Link>
    </div>;
};

export const ProductCardSkeleton = () => <div className="animate-pulse">
    <div className="aspect-[3/4] bg-secondary" />
    <div className="mt-2 h-4 w-3/4 bg-secondary" />
    <div className="mt-2 h-4 w-1/3 bg-secondary" />
  </div>;
