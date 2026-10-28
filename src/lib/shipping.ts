import { formatPrice } from "@/lib/utils";

export const FREE_DELIVERY_THRESHOLD = 29;
export const STORE_CURRENCY = "USD";

export const freeDeliveryLabel = `Free delivery on orders over ${formatPrice(FREE_DELIVERY_THRESHOLD, STORE_CURRENCY)}`;
