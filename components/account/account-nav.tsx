"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/actions/auth";
import { cn } from "@/lib/utils";

const links = [
  { href: "/account/orders", label: "Orders" },
  { href: "/account/wishlist", label: "Wishlist" },
  { href: "/account/samples", label: "Samples" },
  { href: "/account/quotes", label: "Quotes" },
  { href: "/account/visualizations", label: "Visualizations" },
];

interface AccountNavProps {
  customerName?: string | null;
  customerEmail: string;
}

export function AccountNav({ customerName, customerEmail }: AccountNavProps) {
  const pathname = usePathname();

  return (
    <div className="border border-sand bg-white">
      <div className="border-b border-cream px-6 py-5">
        <p className="font-serif text-2xl font-light text-espresso">
          My Account
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {customerName || customerEmail}
        </p>
      </div>

      <nav
        className="flex overflow-x-auto border-b border-cream"
        aria-label="Account sections"
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

      <div className="px-6 py-4">
        <form action={signOut}>
          <button
            type="submit"
            className="cursor-pointer text-sm text-walnut underline"
          >
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
