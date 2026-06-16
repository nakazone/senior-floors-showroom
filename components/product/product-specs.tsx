import type { Product } from "@/types";

interface ProductSpecsProps {
  product: Pick<
    Product,
    | "thickness"
    | "wearLayer"
    | "width"
    | "length"
    | "finish"
    | "installType"
    | "warranty"
    | "waterproof"
    | "petFriendly"
  >;
}

const specs = [
  { key: "thickness", label: "Thickness" },
  { key: "wearLayer", label: "Wear Layer" },
  { key: "width", label: "Width" },
  { key: "length", label: "Length" },
  { key: "finish", label: "Finish" },
  { key: "installType", label: "Installation" },
  { key: "warranty", label: "Warranty" },
] as const;

export function ProductSpecs({ product }: ProductSpecsProps) {
  return (
    <div className="mb-6 grid grid-cols-2 gap-px bg-cream">
      {specs.map((spec) => (
        <div key={spec.key} className="bg-white p-3.5">
          <p className="mb-0.5 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
            {spec.label}
          </p>
          <p className="text-[15px] font-medium text-espresso">
            {product[spec.key]}
          </p>
        </div>
      ))}
      <div className="bg-white p-3.5">
        <p className="mb-0.5 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
          Waterproof
        </p>
        <p className="text-[15px] font-medium text-espresso">
          {product.waterproof ? "Yes" : "No"}
        </p>
      </div>
      <div className="bg-white p-3.5">
        <p className="mb-0.5 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
          Pet Friendly
        </p>
        <p className="text-[15px] font-medium text-espresso">
          {product.petFriendly ? "Yes" : "No"}
        </p>
      </div>
    </div>
  );
}
