"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { formatAccountType } from "@/lib/pro";
import type { AccountType } from "@/types";

const links = [
  { href: "/pro/dashboard", label: "Overview" },
  { href: "/pro/orders", label: "Orders" },
  { href: "/pro/quotes", label: "Quotes" },
  { href: "/pro/samples", label: "Samples" },
  { href: "/pro/pricing", label: "Pricing" },
];

interface ProNavProps {
  customerName?: string | null;
  customerEmail: string;
  accountType: AccountType;
  discountPercent: number;
}

export function ProNav({
  customerName,
  customerEmail,
  accountType,
  discountPercent,
}: ProNavProps) {
  const pathname = usePathname();

  return (
    <div className="border border-sand bg-white">
      <div className="border-b border-cream px-6 py-5">
        <p className="font-serif text-2xl font-light text-espresso">
          Pro Portal
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {customerName || customerEmail}
        </p>
        <p className="mt-2 text-xs tracking-wider text-gold uppercase">
          {formatAccountType(accountType)} | {discountPercent}% trade discount
        </p>
      </div>

      <nav
        className="flex overflow-x-auto border-b border-cream"
        aria-label="Pro portal sections"
      >
        {links.map((link) => {
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "border-b-2 px-5 py-3.5 text-sm whitespace-nowrap transition-colors no-underline",
                isActive
                  ? "border-espresso text-espresso"
                  : "border-transparent text-muted-foreground hover:text-espresso",
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-3 px-6 py-4 text-sm">
        <Link href="/shop" className="block text-walnut underline">
          Shop with trade pricing
        </Link>
        <Link href="/account/orders" className="block text-walnut underline">
          Retail account
        </Link>
      </div>
    </div>
  );
}
