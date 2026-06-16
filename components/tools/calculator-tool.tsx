"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/types";
import { FloorCalculator } from "@/components/product/floor-calculator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type CalculatorProduct = Pick<
  Product,
  "id" | "slug" | "name" | "pricePerSqFt" | "boxCoverageSqFt"
>;

interface CalculatorToolProps {
  products: CalculatorProduct[];
}

export function CalculatorTool({ products }: CalculatorToolProps) {
  const [selectedId, setSelectedId] = useState(products[0]?.id ?? "");

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === selectedId) ?? products[0],
    [products, selectedId],
  );

  if (!selectedProduct) {
    return (
      <p className="text-sm text-muted-foreground">
        No products available. Run the database seed to use the calculator.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <label
          htmlFor="calculator-product"
          className="mb-2 block text-xs font-semibold tracking-widest text-espresso uppercase"
        >
          Product
        </label>
        <Select
          value={selectedId}
          onValueChange={(value) => {
            if (value) setSelectedId(value);
          }}
        >
          <SelectTrigger
            id="calculator-product"
            className="rounded-none border-sand bg-white"
          >
            <SelectValue placeholder="Choose a floor" />
          </SelectTrigger>
          <SelectContent>
            {products.map((product) => (
              <SelectItem key={product.id} value={product.id}>
                {product.name} - ${product.pricePerSqFt.toFixed(2)}/sq ft
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <FloorCalculator key={selectedProduct.id} product={selectedProduct} />
    </div>
  );
}
