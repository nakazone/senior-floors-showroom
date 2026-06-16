"use client";

import { useEffect, useState } from "react";
import { Scale } from "lucide-react";
import { NavIconButton } from "@/components/nav/nav-logo";
import { useCompareStore } from "@/lib/stores/compare-store";

interface CompareNavLinkProps {
  className?: string;
}

export function CompareNavLink({ className }: CompareNavLinkProps) {
  const itemCount = useCompareStore((state) => state.items.length);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <NavIconButton
      href="/compare"
      label="Compare Floors"
      badge={mounted ? itemCount : 0}
      className={className}
    >
      <Scale className="h-[19px] w-[19px]" strokeWidth={1.5} />
    </NavIconButton>
  );
}
