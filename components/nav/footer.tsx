import Link from "next/link";
import { BrandLogo } from "@/components/brand/brand-logo";
import { siteConfig } from "@/lib/siteConfig";
import { footerColumns } from "@/lib/nav-links";

const socialLinks = [
  { href: siteConfig.social.instagram, label: "Instagram", abbr: "ig" },
  { href: siteConfig.social.facebook, label: "Facebook", abbr: "fb" },
];

export function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="section-inner py-12 md:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <div className="lg:col-span-1">
            <BrandLogo variant="footer" showShowroomLabel={false} />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/80">
              Elegant, durable flooring installed with precision and care. Shop premium
              LVP and engineered hardwood online, or visit our main site for installation
              services across the Denver metro area.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Licensed", "Insured", "10+ Years Experience"].map((badge) => (
                <span
                  key={badge}
                  className="inline-block rounded-md border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide text-white/95 uppercase"
                >
                  {badge}
                </span>
              ))}
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <a href={`tel:${siteConfig.phoneTel}`} className="block text-secondary hover:underline">
                {siteConfig.phone}
              </a>
              <a href={`mailto:${siteConfig.email}`} className="block text-secondary hover:underline">
                {siteConfig.email}
              </a>
              <a
                href={siteConfig.mainSiteUrl}
                className="block text-white/80 hover:text-secondary"
                target="_blank"
                rel="noopener noreferrer"
              >
                senior-floors.com
              </a>
            </div>
            <div className="mt-6 flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-xs font-semibold text-white uppercase transition-colors hover:border-secondary hover:bg-secondary hover:text-primary"
                >
                  {social.abbr}
                </a>
              ))}
            </div>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title}>
              <h4 className="mb-4 text-lg font-semibold text-secondary">{column.title}</h4>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/80 no-underline transition-colors hover:text-secondary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="mb-4 text-lg font-semibold text-secondary">Contact Us</h4>
            <div className="space-y-3 text-sm text-white/80">
              <p>
                {siteConfig.address.street}
                <br />
                {siteConfig.address.city}, {siteConfig.address.state} {siteConfig.address.zip}
              </p>
              <p>{siteConfig.serviceArea}</p>
              <div className="inline-block rounded-md border border-white/20 bg-white/10 px-4 py-2">
                <div className="text-sm font-semibold tracking-wider text-secondary">
                  ★★★★★ Google Reviews
                </div>
                <div className="text-xs font-semibold tracking-wide text-white/95 uppercase">
                  Hardwood Flooring Specialists
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/20 pt-8 text-sm text-white/80 md:flex-row">
          <span>
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </span>
          <span className="text-white/60">
            Studio Showroom | Stripe Checkout | Roomvo Ready
          </span>
        </div>
      </div>
    </footer>
  );
}
