"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { primaryNavLinks, shopMegaMenu, type NavColumn } from "@/lib/nav-links";
import { cn } from "@/lib/utils";

function MegaColumn({ column }: { column: NavColumn }) {
  return (
    <div>
      <p className="mb-4 text-[11px] font-semibold tracking-[0.14em] text-gold uppercase">
        {column.title}
      </p>
      <ul className="flex flex-col gap-2">
        {column.links.map((link) => (
          <li key={link.href + link.label}>
            <NavigationMenuLink
              render={
                <Link
                  href={link.href}
                  className="flex items-center gap-1.5 text-sm text-walnut no-underline transition-colors hover:bg-transparent hover:text-espresso"
                />
              }
            >
              <span className="h-px w-3 shrink-0 bg-sand" aria-hidden="true" />
              {link.label}
            </NavigationMenuLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DesktopNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <NavigationMenuItem>
      <NavigationMenuLink
        render={
          <Link
            href={href}
            className={cn(
              "inline-flex h-[var(--nav-height)] items-center px-5 text-[13px] tracking-[0.04em] text-walnut no-underline transition-colors hover:bg-transparent hover:text-espresso",
            )}
          />
        }
      >
        {children}
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
}

export function MegaMenu() {
  return (
    <NavigationMenu className="max-w-none" aria-label="Primary">
      <NavigationMenuList className="gap-0">
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={cn(
              "h-[var(--nav-height)] rounded-none bg-transparent px-5 text-[13px] tracking-[0.04em] text-walnut shadow-none hover:bg-transparent hover:text-espresso data-popup-open:bg-transparent data-popup-open:text-espresso",
            )}
          >
            Shop
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[min(920px,calc(100vw-3rem))] grid-cols-4 gap-8 border border-sand border-t-0 bg-white p-10 shadow-[0_24px_60px_rgba(30,20,12,0.1)]">
              {shopMegaMenu.map((column) => (
                <MegaColumn key={column.title} column={column} />
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {primaryNavLinks.map((link) => (
          <DesktopNavLink key={link.href} href={link.href}>
            {link.label}
          </DesktopNavLink>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
