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
      <p className="mb-4 text-[11px] font-semibold tracking-[0.14em] text-secondary uppercase">
        {column.title}
      </p>
      <ul className="flex flex-col gap-2">
        {column.links.map((link) => (
          <li key={link.href + link.label}>
            <NavigationMenuLink
              render={
                <Link
                  href={link.href}
                  className="flex items-center gap-1.5 text-sm text-text-light no-underline transition-colors hover:bg-transparent hover:text-primary"
                />
              }
            >
              <span className="h-px w-3 shrink-0 bg-border" aria-hidden="true" />
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
              "nav-link inline-flex h-[var(--nav-height)] items-center px-4 no-underline",
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
              "nav-link h-[var(--nav-height)] rounded-none bg-transparent px-4 text-sm shadow-none hover:bg-transparent data-popup-open:bg-transparent",
            )}
          >
            Shop
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[min(920px,calc(100vw-3rem))] grid-cols-4 gap-8 rounded-lg border border-gray-100 border-t-2 border-t-secondary bg-white p-10 shadow-xl shadow-primary/20">
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
