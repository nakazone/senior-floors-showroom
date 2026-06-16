import { SkipToContent } from "@/components/a11y/skip-to-content";
import { NavBar } from "@/components/nav/nav-bar";
import { Footer } from "@/components/nav/footer";
import { NewsletterBand } from "@/components/nav/newsletter-band";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SkipToContent />
      <NavBar />
      <div id="main-content" tabIndex={-1} className="outline-none">
        {children}
      </div>
      <NewsletterBand />
      <Footer />
    </>
  );
}
