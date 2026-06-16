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
    return <span className="text-lg font-bold">${value.toFixed(2)}</span>;
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
      <div className="rounded-lg border border-border bg-bg-light p-10 text-center shadow-md">
        <p className="mb-2 text-xl font-bold text-text-dark">No floors selected yet</p>
        <p className="mb-6 text-sm text-text-muted">
          Add up to 4 products using the Compare button on any floor card.
        </p>
        <Link href="/shop" className="btn-dark no-underline">
          Browse catalog
        </Link>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-3 text-sm text-text-light md:hidden">
        Swipe horizontally to compare all specifications.
      </p>
      <div
        className="overflow-x-auto rounded-lg focus-within:ring-2 focus-within:ring-secondary"
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
                className="min-w-[180px] bg-primary p-4 text-left align-top text-[17px] font-bold text-white"
              >
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div
                    className="h-20 w-full bg-bg-light bg-cover bg-center"
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
                      className="flex min-h-11 min-w-11 shrink-0 cursor-pointer items-center justify-center text-white/70 transition-colors duration-300 hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
                      aria-label={`Remove ${item.name} from compare`}
                    >
                      <X className="h-4 w-4" strokeWidth={1.5} />
                    </button>
                  ) : null}
                </div>
                <Link
                  href={`/product/${item.slug}`}
                  className="text-white no-underline transition-colors duration-300 hover:text-secondary"
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
              <td className="bg-bg-light p-4 text-xs font-semibold tracking-wider text-text-muted uppercase">
                {row.label}
              </td>
              {items.map((item) => (
                <td
                  key={`${item.productId}-${row.key}`}
                  className="border-b border-border bg-white p-4 text-text-dark transition-colors duration-300 group-hover:bg-bg-light"
                >
                  {formatValue(row.key, item[row.key])}
                </td>
              ))}
            </tr>
          ))}
          {showActions ? (
            <tr>
              <td className="bg-bg-light p-4 text-xs font-semibold tracking-wider text-text-muted uppercase">
                Actions
              </td>
              {items.map((item) => (
                <td
                  key={`${item.productId}-actions`}
                  className="border-b border-border bg-white p-4"
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
                      className="sf-link text-center text-xs"
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
