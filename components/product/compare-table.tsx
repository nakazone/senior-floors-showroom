"use client";

import Link from "next/link";
import { X } from "lucide-react";
import type { CompareItem, Product } from "@/types";
import { useCompareStore } from "@/lib/stores/compare-store";
import { AddToCartButton } from "@/components/product/add-to-cart-button";

const rows: { key: keyof CompareItem; label: string }[] = [
  { key: "series", label: "Series" },
  { key: "thickness", label: "Thickness" },
  { key: "wearLayer", label: "Wear Layer" },
  { key: "width", label: "Width" },
  { key: "finish", label: "Finish" },
  { key: "installType", label: "Installation" },
  { key: "warranty", label: "Warranty" },
  { key: "waterproof", label: "Waterproof" },
  { key: "petFriendly", label: "Pet Friendly" },
  { key: "pricePerSqFt", label: "Price / Sq Ft" },
];

function formatValue(key: keyof CompareItem, value: CompareItem[keyof CompareItem]) {
  if (typeof value === "boolean") {
    return value ? (
      <span className="font-medium text-sage">Yes</span>
    ) : (
      <span className="text-muted-foreground">No</span>
    );
  }

  if (key === "pricePerSqFt" && typeof value === "number") {
    return <span className="font-serif text-lg">${value.toFixed(2)}</span>;
  }

  return String(value);
}

function compareItemToProduct(item: CompareItem): Product {
  return {
    id: item.productId,
    slug: item.slug,
    name: item.name,
    series: item.series,
    description: "",
    type: "LVP",
    colorFamily: "",
    style: [],
    rooms: [],
    thickness: item.thickness,
    wearLayer: item.wearLayer,
    width: item.width,
    length: "",
    finish: item.finish,
    installType: item.installType,
    warranty: item.warranty,
    waterproof: item.waterproof,
    petFriendly: item.petFriendly,
    pricePerSqFt: item.pricePerSqFt,
    stockSqFt: 0,
    boxCoverageSqFt: item.boxCoverageSqFt ?? 20,
    images: item.imageUrl
      ? [{ id: item.productId, url: item.imageUrl, type: "gallery", position: 0 }]
      : undefined,
  };
}

interface CompareTableProps {
  items: CompareItem[];
  showActions?: boolean;
}

export function CompareTable({ items, showActions = true }: CompareTableProps) {
  const removeItem = useCompareStore((state) => state.removeItem);

  if (items.length === 0) {
    return (
      <div className="border border-sand bg-bone p-10 text-center">
        <p className="mb-2 font-serif text-xl text-walnut">
          No floors selected yet
        </p>
        <p className="mb-6 text-sm text-muted-foreground">
          Add up to 4 products using the Compare button on any floor card.
        </p>
        <Link
          href="/shop"
          className="inline-block bg-espresso px-6 py-3 text-sm font-medium tracking-wide text-bone uppercase no-underline"
        >
          Browse catalog
        </Link>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-3 text-sm text-walnut md:hidden">
        Swipe horizontally to compare all specifications.
      </p>
      <div
        className="overflow-x-auto rounded-sm focus-within:ring-2 focus-within:ring-gold"
        tabIndex={0}
        role="region"
        aria-label="Product comparison table. Scroll horizontally on smaller screens."
      >
      <table className="compare-table w-full min-w-[640px] border-collapse text-sm sm:min-w-[720px]">
        <thead>
          <tr>
            <th className="w-40 bg-white p-4 text-left text-[11px] font-medium tracking-widest text-muted-foreground uppercase">
              Specification
            </th>
            {items.map((item) => (
              <th
                key={item.productId}
                className="min-w-[180px] bg-espresso p-4 text-left align-top font-serif text-[17px] font-light text-bone"
              >
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div
                    className="h-20 w-full bg-cream bg-cover bg-center"
                    style={
                      item.imageUrl
                        ? { backgroundImage: `url(${item.imageUrl})` }
                        : undefined
                    }
                  />
                  {showActions ? (
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="flex min-h-11 min-w-11 shrink-0 cursor-pointer items-center justify-center text-bone/70 transition-colors hover:text-bone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                      aria-label={`Remove ${item.name} from compare`}
                    >
                      <X className="h-4 w-4" strokeWidth={1.5} />
                    </button>
                  ) : null}
                </div>
                <Link
                  href={`/product/${item.slug}`}
                  className="text-bone no-underline hover:text-gold"
                >
                  {item.name}
                </Link>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className="group">
              <td className="bg-bone p-4 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                {row.label}
              </td>
              {items.map((item) => (
                <td
                  key={`${item.productId}-${row.key}`}
                  className="border-b border-cream bg-white p-4 text-espresso transition-colors group-hover:bg-bone"
                >
                  {formatValue(row.key, item[row.key])}
                </td>
              ))}
            </tr>
          ))}
          {showActions ? (
            <tr>
              <td className="bg-bone p-4 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Actions
              </td>
              {items.map((item) => (
                <td
                  key={`${item.productId}-actions`}
                  className="border-b border-cream bg-white p-4"
                >
                  <div className="flex flex-col gap-2">
                    <AddToCartButton
                      product={compareItemToProduct(item)}
                      size="sm"
                      label="Add to Cart"
                      className="w-full px-3"
                    />
                    <Link
                      href={`/product/${item.slug}`}
                      className="text-center text-xs text-walnut underline"
                    >
                      View details
                    </Link>
                  </div>
                </td>
              ))}
            </tr>
          ) : null}
        </tbody>
      </table>
      </div>
    </div>
  );
}
