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
        "relative flex min-h-11 min-w-11 items-center justify-center text-white/85 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-primary",
        className,
      )}
    >
      {children}
      {badge && badge > 0 ? (
        <span className="absolute top-0.5 right-0.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-secondary px-1 text-[10px] font-bold text-text-dark">
          {badge > 9 ? "9+" : badge}
        </span>
      ) : null}
    </Link>
  );
}
