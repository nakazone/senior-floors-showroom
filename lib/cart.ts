import type { CartItem } from "@/types";

export function formatCartCurrency(amount: number) {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function getLineTotal(item: CartItem) {
  return item.sqFt * item.pricePerSqFt;
}

export function getCartSubtotal(items: CartItem[]) {
  return items.reduce((total, item) => total + getLineTotal(item), 0);
}

export function getCartSqFtTotal(items: CartItem[]) {
  return items.reduce((total, item) => total + item.sqFt, 0);
}

export function normalizeCartItem(item: CartItem): CartItem {
  return {
    ...item,
    series: item.series ?? "",
    boxCoverageSqFt: item.boxCoverageSqFt > 0 ? item.boxCoverageSqFt : 20,
  };
}
