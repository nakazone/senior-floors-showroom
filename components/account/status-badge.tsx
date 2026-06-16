import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  PENDING: "bg-cream text-walnut",
  PROCESSING: "bg-[#FDF3E8] text-[#8B5A1A]",
  IN_TRANSIT: "bg-[#E8F4F0] text-[#2A6B5A]",
  DELIVERED: "bg-[#E8F4F0] text-[#2A6B5A]",
  CANCELLED: "bg-cream text-muted-foreground",
  REQUESTED: "bg-[#FDF3E8] text-[#8B5A1A]",
  SHIPPED: "bg-[#E8F4F0] text-[#2A6B5A]",
  OPEN: "bg-bone text-espresso",
  CONVERTED: "bg-[#E8F4F0] text-[#2A6B5A]",
  EXPIRED: "bg-cream text-muted-foreground",
};

export function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const label = status
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  return (
    <span
      className={cn(
        "inline-flex px-3 py-1 text-[11px] font-medium tracking-wider uppercase",
        statusStyles[status] ?? "bg-cream text-walnut",
        className,
      )}
    >
      {label}
    </span>
  );
}
