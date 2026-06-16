import { FileDown } from "lucide-react";
import { getProductAssetUrls } from "@/lib/product-assets";

interface ProductDownloadsProps {
  slug: string;
}

const downloads = [
  { key: "installationGuide", label: "Installation Guide" },
  { key: "warranty", label: "Warranty PDF" },
  { key: "technicalSheet", label: "Technical Sheet" },
] as const;

export function ProductDownloads({ slug }: ProductDownloadsProps) {
  const assets = getProductAssetUrls(slug);

  return (
    <div>
      <p className="mb-3 text-[11px] font-medium tracking-widest text-walnut uppercase">
        Downloads
      </p>
      <div className="flex flex-wrap gap-2">
        {downloads.map((download) => {
          const href = assets?.[download.key];

          return (
            <a
              key={download.key}
              href={href ?? "#"}
              target={href ? "_blank" : undefined}
              rel={href ? "noopener noreferrer" : undefined}
              aria-disabled={!href}
              className="inline-flex items-center gap-1.5 border border-sand px-3 py-1.5 text-xs text-walnut no-underline transition-colors hover:border-espresso hover:text-espresso aria-disabled:pointer-events-none aria-disabled:opacity-50"
            >
              <FileDown className="h-3.5 w-3.5" />
              {download.label}
            </a>
          );
        })}
      </div>
      {!assets ? (
        <p className="mt-2 text-xs text-muted-foreground">
          PDF assets will be available once R2 document URLs are configured.
        </p>
      ) : null}
    </div>
  );
}
