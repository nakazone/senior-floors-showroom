"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, Scale, Search, Sparkles, User, X } from "lucide-react";
import { BrandLogo } from "@/components/brand/brand-logo";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CartDrawer } from "@/components/nav/cart-drawer";
import { CompareNavLink } from "@/components/nav/compare-nav-link";
import { NavIconButton } from "@/components/nav/nav-logo";
import { MegaMenu } from "@/components/nav/mega-menu";
import { ProductSearch } from "@/components/search/product-search";
import { primaryNavLinks, shopMegaMenu } from "@/lib/nav-links";
import { siteConfig } from "@/lib/siteConfig";

export function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    if (!searchOpen) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setSearchOpen(false);
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [searchOpen]);

  return (
    <header className="fixed top-0 right-0 left-0 z-50 bg-primary shadow-lg">
      <div className="mx-auto flex h-[var(--nav-height)] max-w-7xl items-center gap-4 px-4 sm:px-6 lg:gap-6 lg:px-8">
        <BrandLogo onClick={() => setMobileOpen(false)} />

        <div className="hidden flex-1 justify-center xl:flex">
          <MegaMenu />
        </div>

        <div className="hidden max-w-sm flex-1 lg:block xl:max-w-md">
          <ProductSearch inputClassName="rounded-md" />
        </div>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            aria-label="Open search"
            onClick={() => setSearchOpen(true)}
            className="flex min-h-11 min-w-11 cursor-pointer items-center justify-center text-white/85 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-primary lg:hidden"
          >
            <Search className="h-[19px] w-[19px]" strokeWidth={1.5} />
          </button>

          <NavIconButton href="/ai-finder" label="AI Floor Finder" className="hidden sm:flex">
            <Sparkles className="h-[19px] w-[19px]" strokeWidth={1.5} />
          </NavIconButton>

          <CompareNavLink className="hidden sm:flex" />

          <NavIconButton href="/account/orders" label="My Account">
            <User className="h-[19px] w-[19px]" strokeWidth={1.5} />
          </NavIconButton>

          <CartDrawer />

          <Link
            href="/shop"
            className="btn-gold hidden min-h-11 items-center px-4 py-2 text-sm whitespace-nowrap lg:inline-flex"
          >
            Shop Flooring
          </Link>

          <a
            href={`tel:${siteConfig.phoneTel}`}
            className="btn-gold hidden min-h-11 items-center px-4 py-2 text-sm whitespace-nowrap xl:inline-flex"
          >
            Call Now
          </a>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              className="flex min-h-11 min-w-11 items-center justify-center text-white/85 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-primary xl:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-full overflow-y-auto bg-primary p-0 sm:max-w-md"
            >
              <SheetHeader className="border-b border-white/10 px-6 py-5">
                <SheetTitle className="sr-only">Navigation menu</SheetTitle>
                <BrandLogo onClick={() => setMobileOpen(false)} />
                <div className="mt-4 lg:hidden">
                  <ProductSearch
                    onNavigate={() => setMobileOpen(false)}
                    inputClassName="rounded-md"
                  />
                </div>
              </SheetHeader>

              <nav className="px-6 py-4" aria-label="Mobile">
                <Accordion className="border-none">
                  <AccordionItem value="shop" className="border-white/10">
                    <AccordionTrigger className="py-4 text-sm font-medium tracking-wide text-white uppercase hover:no-underline">
                      Shop
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <div className="flex flex-col gap-6">
                        {shopMegaMenu.map((column) => (
                          <div key={column.title}>
                            <p className="mb-3 text-[10px] font-semibold tracking-[0.18em] text-secondary uppercase">
                              {column.title}
                            </p>
                            <ul className="flex flex-col gap-2.5">
                              {column.links.map((link) => (
                                <li key={link.href + link.label}>
                                  <Link
                                    href={link.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-2 text-sm text-white/85 no-underline transition-colors hover:text-white"
                                  >
                                    <span className="h-px w-3 bg-secondary/70" />
                                    {link.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <ul className="border-t border-white/10">
                  {primaryNavLinks.map((link) => (
                    <li key={link.href} className="border-b border-white/10">
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex h-12 items-center text-sm tracking-wide text-white/85 no-underline transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                  <li className="border-b border-white/10 sm:hidden">
                    <Link
                      href="/ai-finder"
                      onClick={() => setMobileOpen(false)}
                      className="flex h-12 items-center gap-2 text-sm text-white/85 no-underline transition-colors hover:text-white"
                    >
                      <Sparkles className="h-4 w-4" />
                      AI Floor Finder
                    </Link>
                  </li>
                  <li className="border-b border-white/10 sm:hidden">
                    <Link
                      href="/compare"
                      onClick={() => setMobileOpen(false)}
                      className="flex h-12 items-center gap-2 text-sm text-white/85 no-underline transition-colors hover:text-white"
                    >
                      <Scale className="h-4 w-4" />
                      Compare Floors
                    </Link>
                  </li>
                </ul>

                <div className="mt-6 flex flex-col gap-3">
                  <Link
                    href="/shop"
                    onClick={() => setMobileOpen(false)}
                    className="btn-gold w-full text-center"
                  >
                    Shop Flooring
                  </Link>
                  <a href={`tel:${siteConfig.phoneTel}`} className="btn-gold w-full text-center">
                    Call {siteConfig.phone}
                  </a>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {searchOpen ? (
        <div className="border-t border-white/10 bg-primary px-4 py-4 lg:hidden">
          <div className="mx-auto flex max-w-xl items-start gap-3">
            <ProductSearch
              autoFocus
              className="flex-1"
              inputClassName="rounded-md"
              onNavigate={() => setSearchOpen(false)}
            />
            <button
              type="button"
              aria-label="Close search"
              onClick={() => setSearchOpen(false)}
              className="mt-2 min-h-11 min-w-11 cursor-pointer text-white/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
