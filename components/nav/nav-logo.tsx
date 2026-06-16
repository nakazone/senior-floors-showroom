import Link from "next/link";
import { cn } from "@/lib/utils";

interface NavIconButtonProps {
  href: string;
  label: string;
  children: React.ReactNode;
  badge?: number;
  className?: string;
}

export function NavIconButton({
  href,
  label,
  children,
  badge,
  className,
}: NavIconButtonProps) {
  return (
    <Link
      href={href}
      aria-label={label}
      title={label}
      className={cn(
        "relative flex min-h-11 min-w-11 items-center justify-center text-walnut transition-colors hover:text-espresso focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bone",
        className,
      )}
    >
      {children}
      {badge && badge > 0 ? (
        <span className="absolute top-0.5 right-0.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-espresso">
          {badge > 9 ? "9+" : badge}
        </span>
      ) : null}
    </Link>
  );
}

interface NavLogoProps {
  className?: string;
  onClick?: () => void;
}

export function NavLogo({ className, onClick }: NavLogoProps) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className={cn("shrink-0 rounded-sm no-underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bone", className)}
    >
      <span className="font-serif text-[21px] font-light tracking-[0.06em] text-espresso">
        Senior <span className="font-semibold text-gold">Floors</span>
      </span>
      <small className="-mt-0.5 block text-[10px] tracking-[0.22em] text-muted-foreground uppercase">
        Studio
      </small>
    </Link>
  );
}
