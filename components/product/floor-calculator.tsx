"use client";

import { useMemo, useState, useTransition, useEffect } from "react";
import type { Product } from "@/types";
import { createQuote } from "@/app/actions/quotes";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/shared/toast-provider";
import Link from "next/link";

interface FloorCalculatorProps {
  product: Pick<
    Product,
    "id" | "slug" | "name" | "pricePerSqFt" | "boxCoverageSqFt"
  >;
  onResultChange?: (
    result: {
      sqFt: number;
      boxesNeeded: number;
      totalPrice: number;
      length: number;
      width: number;
    } | null,
  ) => void;
}

export function FloorCalculator({ product, onResultChange }: FloorCalculatorProps) {
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [isPending, startTransition] = useTransition();

  const result = useMemo(() => {
    const l = parseFloat(length);
    const w = parseFloat(width);
    if (!l || !w || l <= 0 || w <= 0) return null;

    const sqFt = l * w * 1.1;
    const boxesNeeded = Math.ceil(sqFt / product.boxCoverageSqFt);
    const totalPrice = sqFt * product.pricePerSqFt;

    return { sqFt, boxesNeeded, totalPrice, length: l, width: w };
  }, [length, width, product.boxCoverageSqFt, product.pricePerSqFt]);

  useEffect(() => {
    onResultChange?.(result);
  }, [onResultChange, result]);

  function handleSaveQuote() {
    if (!result) return;

    startTransition(async () => {
      const response = await createQuote({
        productId: product.id,
        slug: product.slug,
        name: product.name,
        sqFt: result.sqFt,
        unitPrice: product.pricePerSqFt,
        totalPrice: result.totalPrice,
        length: result.length,
        width: result.width,
      });

      if (response.success) {
        toast.success("Quote saved to your account.");
        return;
      }

      if (response.error === "sign_in_required") {
        toast.error("Sign in to save this quote.", {
          action: {
            label: "Account",
            onClick: () => {
              window.location.href = "/account/login";
            },
          },
        });
        return;
      }

      toast.error("Unable to save quote. Please try again.");
    });
  }

  return (
    <div className="mb-6 bg-bone p-5">
      <p className="mb-3.5 text-xs font-semibold tracking-widest text-espresso uppercase">
        Floor Calculator
      </p>
      <div className="mb-3.5 grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor={`length-${product.id}`} className="mb-1.5 text-xs text-walnut">
            Length (ft)
          </Label>
          <Input
            id={`length-${product.id}`}
            type="number"
            min="0"
            step="0.1"
            value={length}
            onChange={(e) => setLength(e.target.value)}
            className="rounded-none border-sand bg-white"
          />
        </div>
        <div>
          <Label htmlFor={`width-${product.id}`} className="mb-1.5 text-xs text-walnut">
            Width (ft)
          </Label>
          <Input
            id={`width-${product.id}`}
            type="number"
            min="0"
            step="0.1"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            className="rounded-none border-sand bg-white"
          />
        </div>
      </div>
      {result ? (
        <>
          <div className="mb-3 grid grid-cols-3 gap-2 bg-white p-3.5 text-center">
            <div>
              <p className="font-serif text-[22px] text-espresso">
                {result.sqFt.toFixed(1)}
              </p>
              <p className="text-[11px] text-muted-foreground">Sq Ft (+10%)</p>
            </div>
            <div>
              <p className="font-serif text-[22px] text-espresso">
                {result.boxesNeeded}
              </p>
              <p className="text-[11px] text-muted-foreground">Boxes</p>
            </div>
            <div>
              <p className="font-serif text-[22px] text-espresso">
                ${result.totalPrice.toFixed(2)}
              </p>
              <p className="text-[11px] text-muted-foreground">Estimate</p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={handleSaveQuote}
            className="w-full rounded-none border-espresso text-espresso hover:bg-espresso hover:text-bone"
          >
            {isPending ? "Saving quote..." : "Save as Quote"}
          </Button>
        </>
      ) : (
        <p className="text-sm text-muted-foreground">
          Enter room dimensions to calculate coverage and cost.
        </p>
      )}
      <p className="mt-3 text-xs text-muted-foreground">
        Includes 10% waste factor.{" "}
        <Link href="/account/quotes" className="text-walnut underline">
          View saved quotes
        </Link>
      </p>
    </div>
  );
}
