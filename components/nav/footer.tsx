import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import { footerColumns } from "@/lib/nav-links";

const socialLinks = [
  { href: siteConfig.social.linkedin, label: "LinkedIn", abbr: "in" },
  { href: siteConfig.social.instagram, label: "Instagram", abbr: "ig" },
  { href: siteConfig.social.pinterest, label: "Pinterest", abbr: "pi" },
  { href: siteConfig.social.youtube, label: "YouTube", abbr: "yt" },
];

export function Footer() {
  return (
    <footer className="bg-[#120C06] px-6 pt-20 pb-8 md:px-16">
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-8 grid gap-10 border-b border-bone/7 pb-16 lg:grid-cols-[2.5fr_repeat(4,1fr)] lg:gap-12">
          <div>
            <div className="mb-1 font-serif text-[26px] font-light tracking-wide text-bone">
              Senior <span className="font-semibold text-gold">Floors</span>
            </div>
            <small className="block text-[10px] tracking-[0.22em] text-muted-foreground uppercase">
              Studio
            </small>
            <p className="mt-4 max-w-[260px] text-sm leading-relaxed text-bone/35">
              Luxury flooring curated for people who understand that the floor defines
              the room - and the life lived in it.
            </p>
            <div className="mt-6 flex gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.abbr}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-[34px] w-[34px] items-center justify-center bg-bone/7 text-[13px] text-bone/45 no-underline transition-all hover:bg-bone/14 hover:text-bone"
                >
                  {social.abbr}
                </a>
              ))}
            </div>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title}>
              <p className="mb-5 text-[10px] font-semibold tracking-[0.18em] text-gold uppercase">
                {column.title}
              </p>
              <ul className="flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-bone/40 no-underline transition-colors hover:text-bone"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 text-xs text-bone/25 sm:flex-row sm:items-center sm:justify-between">
          <span>
            (c) {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </span>
          <span>Built for Stripe | Roomvo Ready | Next.js Production</span>
        </div>
      </div>
    </footer>
  );
}
