import { formatPrice } from "@/lib/utils";

export const FREE_DELIVERY_THRESHOLD = 500;
export const STORE_CURRENCY = "ZAR";

export const freeDeliveryLabel = `Free delivery on orders over ${formatPrice(FREE_DELIVERY_THRESHOLD, STORE_CURRENCY).replace(/\s|\.00$/g, "")}`;
