"use client";

import { useEffect, useRef } from "react";
import type { Product } from "@/types";
import { trackViewItem } from "@/lib/analytics";

interface ViewItemTrackerProps {
  product: Product;
}

export function ViewItemTracker({ product }: ViewItemTrackerProps) {
  const trackedRef = useRef(false);

  useEffect(() => {
    if (trackedRef.current) return;
    trackedRef.current = true;

    trackViewItem({
      item_id: product.id,
      item_name: product.name,
      item_category: product.type,
      price: product.pricePerSqFt,
      value: product.pricePerSqFt,
      quantity: 1,
    });
  }, [product]);

  return null;
}
